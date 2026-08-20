import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('não apresenta violações automáticas de acessibilidade', async ({ page }) => {
  await page.goto('/login')
  await page.waitForFunction(() => !('$_TSR' in window), undefined, { timeout: 10_000 })

  const results = await new AxeBuilder({ page }).analyze()

  expect(results.violations).toEqual([])
})

test('oferece tema persistente e assistência no preenchimento do cadastro', async ({
  page,
}) => {
  await page.goto('/login')
  await page.waitForFunction(() => !('$_TSR' in window), undefined, { timeout: 10_000 })

  const initialTheme = await page.locator('html').getAttribute('data-theme')
  const nextTheme = initialTheme === 'light' ? 'dark' : 'light'
  await page
    .getByRole('button', {
      name: `Ativar tema ${nextTheme === 'light' ? 'claro' : 'escuro'}`,
    })
    .click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', nextTheme)

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', nextTheme)
  await page.waitForFunction(() => !('$_TSR' in window), undefined, { timeout: 10_000 })

  const email = page.getByLabel('E-mail')
  await email.fill('lune@hot')
  await email.press('ArrowDown')
  await email.press('Enter')
  await expect(email).toHaveValue('lune@hotmail.com')

  const password = page.getByLabel('Senha', { exact: true })
  await password.fill('painted-world')
  await expect(password).toHaveAttribute('type', 'password')
  await page.getByRole('button', { name: 'Mostrar senha' }).click()
  await expect(password).toHaveAttribute('type', 'text')
})

test('permite explorar o checklist sem criar uma conta', async ({ page }) => {
  await page.goto('/login')
  await page.waitForFunction(() => !('$_TSR' in window), undefined, { timeout: 10_000 })
  await page.getByRole('button', { name: 'Explorar demonstração' }).click()

  await expect(page).toHaveURL('/demo')
  await expect(page.getByText('Demonstração interativa do checklist')).toBeVisible()
  await expect(page.getByRole('checkbox', { name: /Children of Lumière/ })).toBeDisabled()

  await page.getByRole('searchbox', { name: 'Buscar' }).fill('gestral')
  await expect(page.getByRole('checkbox', { name: /Linen and Cotton/ })).toBeVisible()
})

test('no mobile o seletor de tema integra a barra e não acompanha o scroll', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile')

  await page.goto('/demo')
  await page.waitForFunction(() => !('$_TSR' in window), undefined, { timeout: 10_000 })
  const themeToggle = page.getByRole('button', { name: /Ativar tema/ })
  await expect(themeToggle).toBeVisible()
  await expect(
    page.locator('.account-bar').getByRole('button', { name: /Ativar tema/ }),
  ).toBeVisible()

  await page.evaluate(() => window.scrollTo(0, 600))

  await expect.poll(async () => (await themeToggle.boundingBox())?.y ?? 0).toBeLessThan(0)
})

test('cria uma conta e mantém o progresso após recarregar', async ({
  page,
}, testInfo) => {
  const email = `expedition-${testInfo.project.name}-${Date.now()}@example.com`

  await page.goto('/login')
  await page.waitForFunction(() => !('$_TSR' in window), undefined, { timeout: 10_000 })
  await page.getByRole('tab', { name: 'Criar conta' }).click()
  await page.getByLabel('Nome').fill('Expedicionário 33')
  await page.getByLabel('E-mail').fill(email)
  await page.getByLabel('Senha', { exact: true }).fill('painted-world')
  await page.getByRole('button', { name: 'Iniciar expedição' }).click()

  await expect(page).toHaveURL('/')
  const firstRecord = page.getByRole('checkbox', { name: /Children of Lumière/ })
  await firstRecord.check()
  await expect(page.getByRole('status')).toContainText('salvo')

  await page.reload()
  await page.waitForFunction(() => !('$_TSR' in window), undefined, { timeout: 10_000 })
  await expect(firstRecord).toBeChecked()
  await expect(page.getByRole('tab', { name: /Discos Musicais/ })).toContainText('1/33')

  await page.getByRole('button', { name: 'Perfil privado' }).click()
  const publicProfileLink = page.getByRole('link', { name: 'Ver perfil' })
  const profilePath = await publicProfileLink.getAttribute('href')
  expect(profilePath).toMatch(/^\/expedition\//)

  await expect
    .poll(async () => (await page.request.get(profilePath ?? '/')).status())
    .toBe(200)
  await page.goto(profilePath ?? '/')

  await expect(
    page.getByText('Expedição compartilhada por Expedicionário 33'),
  ).toBeVisible()
  await expect(page.getByRole('checkbox', { name: /Children of Lumière/ })).toBeChecked()
  await expect(page.getByRole('checkbox', { name: /Children of Lumière/ })).toBeDisabled()
})
