export type TrackerKey = 'records' | 'journals'

export type Collectible = {
  id: string
  title: string
  location: string
  missable?: boolean
  automatic?: boolean
}

type CollectibleCategory = {
  title: string
  items: readonly Collectible[]
}

export type TrackerDefinition = {
  title: string
  unit: string
  note: string
  footer: string
  dense: boolean
  tone: 'gold' | 'teal'
  categories: readonly CollectibleCategory[]
}

const records = [
  {
    title: 'Lojas & Compras (Chroma)',
    items: [
      {
        id: 'childrenoflumiere',
        title: 'Children of Lumière',
        location:
          'Continente › Sacred River — compre na loja Gestral em frente ao portal de entrada por 1.000 Chroma.',
      },
      {
        id: 'goblu',
        title: 'Goblu',
        location:
          'Continente › Ancient Sanctuary — compre na loja a oeste do portal de entrada por 1.000 Chroma.',
      },
      {
        id: 'linenandcotton',
        title: 'Linen and Cotton',
        location:
          'Continente › Isle of the Eyes — compre do mercador Gestral parado ao lado do portal por 1.000 Chroma.',
      },
      {
        id: 'lostvoice',
        title: 'Lost Voice',
        location:
          "Continente › Monoco's Station — na área verde externa, siga ao norte até a loja e compre por 1.000 Chroma.",
      },
      {
        id: 'robedejour',
        title: 'Robe de Jour',
        location:
          'Continente › sul de Sirène — compre na loja Gestral da pequena praia por 1.000 Chroma.',
      },
    ],
  },
  {
    title: 'Relação & Progresso Automático',
    items: [
      {
        id: 'lune',
        title: 'Lune',
        location:
          'Acampamento — recebido automaticamente ao alcançar o nível 6 de relacionamento com Lune.',
        automatic: true,
      },
      {
        id: 'monoco',
        title: 'Monoco',
        location:
          'Acampamento — recebido automaticamente ao alcançar o nível 6 de relacionamento com Monoco.',
        automatic: true,
      },
      {
        id: 'sciel',
        title: 'Sciel',
        location:
          'Acampamento — recebido automaticamente ao alcançar o nível 6 de relacionamento com Sciel.',
        automatic: true,
      },
      {
        id: 'clea',
        title: 'Clea',
        location:
          'Endless Tower — conclua os 33 desafios (11 estágios com 3 lutas cada); o disco é entregue ao terminar a torre.',
        automatic: true,
      },
      {
        id: 'ourdraftscollide',
        title: 'Our Drafts Collide',
        location:
          'História — recebido automaticamente depois de derrotar o chefe final da campanha.',
        automatic: true,
      },
    ],
  },
  {
    title: 'Áreas Laterais',
    items: [
      {
        id: 'alicia',
        title: 'Alicia',
        location:
          'Falling Leaves › Resinveil Grove — contorne a bandeira pela direita, desça as cordas até a Lady of Sap e entre na porta da Manor à esquerda; está sobre a mesa.',
      },
      {
        id: 'aliciabirthday',
        title: "Alicia's Birthday Party",
        location:
          'Boat Graveyard — avance pelo caminho entre os cascos até a clareira central; o disco está visível no chão.',
      },
      {
        id: 'aline',
        title: 'Aline',
        location:
          'White Sands — atravesse a área até o extremo oposto da entrada; está no chão ao lado do barco destruído.',
      },
      {
        id: 'alineglasshouse',
        title: "Aline's Glasshouse",
        location:
          'Lost Woods — entre pela saída atrás do chefe de Yellow Harvest (ou pouse voando) e siga até a parte central; o disco está no chão.',
      },
      {
        id: 'cleasister',
        title: "Clea! Don't Pull Your Sister's Hair!",
        location:
          'Frozen Hearts › Glacial Falls — da bandeira, pegue a caverna à direita e desça à área subterrânea com o inimigo grande; entre na porta da Manor e procure sobre a mesa.',
      },
      {
        id: 'endlesslight',
        title: 'Endless Light',
        location:
          "Renoir's Drafts › Entrance — desça a rampa, vire à esquerda e use o grapple para subir ao prédio; siga o trajeto e procure no chão à direita.",
      },
      {
        id: 'honeymoon',
        title: 'Honeymoon in Lumière',
        location:
          'White Tree — avance até a base da árvore branca no centro da área; o disco está no chão junto do diário da Expedição 36.',
      },
      {
        id: 'legrandcafe',
        title: 'Le Grand Café de Lumière',
        location:
          'The Carousel › Entrance — partindo da bandeira, acompanhe a parede esquerda até encontrar uma pequena caverna; o disco está dentro.',
      },
      {
        id: 'lightsofthepast',
        title: 'Lights of the Past',
        location:
          'Ancient Gestral City — percorra a pequena área lateral até a região central; o disco fica exposto no chão do caminho.',
      },
      {
        id: 'nocturnepourlumiere',
        title: 'Nocturne pour Lumière',
        location:
          'Sinister Cave › Entrance — mantenha-se nas rotas à direita, suba pelo grapple da rampa, vire e atravesse o segundo grapple; no beco sem saída à esquerda, caia pelo buraco até o disco.',
      },
      {
        id: 'ourpaintedfamily',
        title: 'Our Painted Family',
        location:
          'The Meadows — a partir da entrada, acompanhe o lado direito da pequena área; o disco está visível no chão.',
      },
      {
        id: 'reverence',
        title: 'Reverence',
        location:
          "Blades' Graveyard — siga o percurso entre as lâminas até o centro da área; o disco está visível no chão.",
      },
      {
        id: 'reveriesdansparis',
        title: 'Rêveries dans Paris',
        location:
          'Flying Casino — suba pelo caminho até o prédio do cassino e contorne-o pela direita; o disco está no chão, nos fundos.',
      },
      {
        id: 'un33decembre',
        title: 'Un 33 Décembre à Lumière',
        location:
          'Twilight Quarry — avance pelo único trajeto até o centro da pequena área; o disco está visível no chão.',
      },
      {
        id: 'untilnextlife',
        title: 'Until Next Life',
        location:
          'Falling Leaves › Resinveil Grove — fale com o Fading Boy, consulte a Lady of Sap e volte ao garoto; atravesse o portão, suba a corda, derrote o Scavenger e retorne para receber o disco.',
      },
    ],
  },
  {
    title: 'Áreas Principais, Mansão & História',
    items: [
      {
        id: 'forlorn',
        title: 'Forlorn',
        location:
          'Continente › grande planície a leste — voe até a costa sul, perto da água, e entre na porta da Manor; no quarto, interaja com o guarda-roupa para revelar o compartimento secreto.',
      },
      {
        id: 'gustave',
        title: 'Gustave',
        location:
          'Stone Wave Cliffs › Basalt Waves — depois do Ato 1, volte à arena do Lampmaster; o disco está no penhasco onde ocorreu a cena após a luta.',
      },
      {
        id: 'lamourdunemere',
        title: "L'Amour d'une Mère",
        location:
          'Inside the Monolith › Tainted Battlefield — na bifurcação marcada por uma lápide, siga à esquerda e entre na porta da Manor; o disco fica à esquerda da sala.',
      },
      {
        id: 'lumiere',
        title: 'Lumière',
        location:
          'Prólogo › Main Street — antes de descer ao porto, vá à direita das escadas e derrote o Mimo perto do palco. Alternativa: Ato 3 › Opera House, à direita após a bandeira.',
        missable: true,
      },
      {
        id: 'nocturnetristesse',
        title: 'Nocturne pour un masque de tristesse',
        location:
          'The Manor › salão da mesa comprida — acione quatro ornamentos (entrada à direita, verso do pilar ao fundo, parede curva à esquerda e lareira); entre na passagem aberta e quebre as caixas.',
      },
      {
        id: 'renoir',
        title: 'Renoir',
        location:
          'Old Lumière › Manor Gardens — da bandeira, atravesse a parede quebrada à esquerda e entre na porta da Manor; o disco está sobre as pias do banheiro.',
      },
      {
        id: 'verso',
        title: 'Verso',
        location:
          'Visages › Anger Vale — pegue a primeira caverna à direita e vire à direita na bifurcação; entre na porta da Manor e procure o disco ao lado do piano de brinquedo.',
      },
      {
        id: 'lettreamaelle',
        title: 'Lettre à Maelle',
        location:
          'Acampamento › Ato 2 — após derrotar o primeiro Axon, use “Ver como os outros estão” e assista à cena de Verso e Maelle no piano antes de concluir Inside the Monolith.',
        missable: true,
      },
    ],
  },
] as const satisfies readonly CollectibleCategory[]

const journals = [
  {
    title: 'Nomeados & Desconhecidos',
    items: [
      {
        id: 'j-verso',
        title: 'Verso',
        location:
          'Continente › saliência a oeste de Stone Quarry — voe até o platô elevado acima da saída norte de Forgotten Battlefield; está junto do diário de Julie.',
      },
      {
        id: 'j-aline',
        title: 'Aline',
        location:
          'Inside the Monolith › Tainted Battlefield — na bifurcação com a lápide, siga à esquerda e entre na porta da Manor; o diário está junto à fonte da estufa.',
      },
      {
        id: 'j-renoir',
        title: 'Renoir',
        location:
          'Old Lumière › Manor Gardens — atravesse a abertura à esquerda da bandeira e entre na porta da Manor; no quarto, procure o diário sobre o criado-mudo.',
      },
      {
        id: 'j-unknown1',
        title: 'Desconhecido #1',
        location:
          'The Reacher › Ladder Area — desça até a parte inferior da área e entre na porta da Manor; ao fim da rampa, vire à direita e procure no centro da sala.',
      },
      {
        id: 'j-unknown2',
        title: 'Desconhecido #2',
        location:
          'Visages › Anger Vale — entre na caverna à direita e use a porta da Manor; no mesmo quarto do disco Verso, abra o baú em frente à cama.',
      },
      {
        id: 'j-unknown3',
        title: 'Desconhecido #3',
        location:
          'The Manor › Entry Hall — obtenha a Family Canvas em The Canvas e coloque-a no quadro vazio da escada direita; a passagem do Atelier se abre para o diário.',
      },
      {
        id: 'j-survivor',
        title: 'Sobrevivente (Fracture Survivor)',
        location:
          'Old Lumière › após Left Street — no segundo campo aberto do caminho de Maelle, pegue a direita e caia no cano grande; abra o portão com a Old Key do Prólogo ou a cópia adicionada à área final.',
      },
      {
        id: 'j-julie',
        title: 'Julie',
        location:
          'Continente › saliência a oeste de Stone Quarry — voe até o platô elevado acima da saída norte de Forgotten Battlefield; está junto do diário de Verso.',
      },
      {
        id: 'j-simon',
        title: 'Simon',
        location:
          "Renoir's Drafts › The Abyss — derrote Simon, o superboss opcional; o diário fica acessível na arena depois da batalha.",
      },
    ],
  },
  {
    title: 'Numerados — Expedição 34 a 70',
    items: [
      {
        id: 'j-e34',
        title: 'Expedição 34',
        location:
          'The Crows › Entrance — partindo da bandeira de entrada, siga para a direita; o diário está ao lado dos restos da expedição.',
      },
      {
        id: 'j-e35',
        title: 'Expedição 35',
        location:
          'Falling Leaves › Resinveil Grove — passe pela Lady of Sap e siga até a ponte de corpos que leva ao Chromatic Ballet; o diário está junto à ponte.',
      },
      {
        id: 'j-e36',
        title: 'Expedição 36',
        location:
          'White Tree — ao entrar, siga pela direita até a base da árvore branca; o diário está no chão junto do disco Honeymoon in Lumière.',
      },
      {
        id: 'j-e37',
        title: 'Expedição 37',
        location:
          'Continente › Gestral Beach cercada por montanhas a nordeste — voe para dentro da área do desafio de escalada; o diário fica junto ao lago.',
      },
      {
        id: 'j-e38',
        title: 'Expedição 38',
        location:
          "Yellow Harvest › Harvester's Hollow — desça a ladeira, vire à direita e suba até a área de lanternas, perto da caverna do Mimo; está no centro, junto aos corpos.",
      },
      {
        id: 'j-e39',
        title: 'Expedição 39',
        location:
          'Visages › Sadness Vale — siga à direita do grande rosto triste e continue subindo a ladeira; o diário está no beco sem saída no topo.',
      },
      {
        id: 'j-e40',
        title: 'Expedição 40',
        location:
          'Continente — pouse na pequena ilha escura a noroeste de Sirène e ao sul do Monolith; o diário está no acampamento.',
      },
      {
        id: 'j-e41',
        title: 'Expedição 41',
        location:
          'Forgotten Battlefield — depois de encontrar a Fading Woman, entre na trincheira do caminho à direita e siga até o recuo sem saída.',
      },
      {
        id: 'j-e42',
        title: 'Expedição 42',
        location:
          'Old Lumière › Manor Gardens — volte após concluir a área, use a nova passagem à direita da Manor e desça pela corda; está na base da grande espada dourada.',
      },
      {
        id: 'j-e43',
        title: 'Expedição 43',
        location:
          'Continente › ilha a leste de Coastal Cave, na enseada próxima de White Sands — pouse na ilha do Chromatic Reaper Cultist; o diário fica no acampamento.',
      },
      {
        id: 'j-e44',
        title: 'Expedição 44',
        location:
          "Yellow Harvest › Harvester's Hollow — avance até a área aberta com Jars/Portiers, pegue o caminho à direita e siga até os corpos atravessados por uma luminária.",
      },
      {
        id: 'j-e45',
        title: 'Expedição 45',
        location:
          'Crushing Cavern — derrote o Giant Sapling, siga pelo túnel e suba a corda; na bifurcação seguinte, escolha a esquerda até o expedicionário caído.',
      },
      {
        id: 'j-e46',
        title: 'Expedição 46',
        location:
          "Sirène › Sirène's Dress — derrote o Chromatic Glissando e avance para a área imediatamente posterior à arena; o diário está no caminho.",
      },
      {
        id: 'j-e47',
        title: 'Expedição 47',
        location:
          "Continente — nas montanhas a sudoeste de Old Lumière e a oeste de Monoco's Station, procure a estrutura desabada próxima do mercador Carnovi.",
      },
      {
        id: 'j-e48',
        title: 'Expedição 48',
        location:
          'Stone Quarry — entre na pequena área de uma única sala; o diário está no chão, entre os corpos nas ruínas.',
      },
      {
        id: 'j-e49',
        title: 'Expedição 49',
        location:
          'Falling Leaves › Resinveil Grove — ajude o Fading Boy falando com a Lady of Sap e volte para ele abrir o portão; suba a corda e encontre o diário antes da arena do Scavenger.',
      },
      {
        id: 'j-e50',
        title: 'Expedição 50',
        location:
          'Stone Wave Cliffs › Paintress Shrine — avance ao setor seguinte e, na bifurcação, desça pelo caminho esquerdo; o diário está à esquerda, junto aos corpos.',
      },
      {
        id: 'j-e51',
        title: 'Expedição 51',
        location:
          'Frozen Hearts › Icebound Train Station — siga à esquerda, passe pelas cavernas e pelo vagão com um item inalcançável; o diário está diante da grande porta logo adiante.',
      },
      {
        id: 'j-e52',
        title: 'Expedição 52',
        location:
          'Gestral Village › Infirmary — perto da entrada da Arena, pegue a passagem estreita à direita e siga na direção do Gestral Doctor até o corpo.',
      },
      {
        id: 'j-e53',
        title: 'Expedição 53',
        location:
          'The Small Bourgeon — na bifurcação diante do Bourgeon, siga pelo caminho da esquerda até o fim; o diário está entre os corpos e a vegetação alta.',
      },
      {
        id: 'j-e54',
        title: 'Expedição 54',
        location:
          'Stone Wave Cliffs Cave — atravesse a caverna até a área do Chromatic Hexga; o diário está junto ao corpo perto das ruínas no fim do percurso.',
      },
      {
        id: 'j-e55',
        title: 'Expedição 55',
        location:
          'Sirène › Dancing Classes — após a primeira bandeira, avance à área aberta com Ballets e procure à direita, junto aos potes e corpos.',
      },
      {
        id: 'j-e56',
        title: 'Expedição 56',
        location:
          'Stone Wave Cliffs — depois do primeiro grapple, chegue à área aberta com Greatsword e Reaper Cultists; escolha a esquerda até o poste atravessado por uma espada.',
      },
      {
        id: 'j-e57',
        title: 'Expedição 57',
        location:
          'Forgotten Battlefield — passe pela Painted Cage e saia das trincheiras para a área gramada; está junto aos corpos no caminho do chefe, antes das ruínas do mercador.',
      },
      {
        id: 'j-e58',
        title: 'Expedição 58',
        location:
          'Acampamento — recebido automaticamente numa cena de história depois de concluir Old Lumière.',
        automatic: true,
      },
      {
        id: 'j-e59',
        title: 'Expedição 59',
        location:
          'Yellow Harvest › Yellow Spire Wrecks — da bandeira anterior ao chefe, desça pelo caminho esquerdo até o beco sem saída com o grande pilar âmbar.',
      },
      {
        id: 'j-e60',
        title: 'Expedição 60',
        location:
          'Lumière › Ato 3 — do lado de fora da Opera House, siga à direita até o fim do píer de pedra e interaja com o ponto indicado para Esquie trazer o diário.',
      },
      {
        id: 'j-e61',
        title: 'Expedição 61',
        location:
          'The Reacher › Foggy Area — avance pela rota principal em direção ao balão que leva ao pico; o diário está no acampamento pouco antes do balão.',
      },
      {
        id: 'j-e62',
        title: 'Expedição 62',
        location:
          'Continente — ao norte de Gestral Village, use Esquie para atravessar o terreno rochoso até as construções abandonadas na borda do penhasco; está junto à placa com marcas.',
      },
      {
        id: 'j-e63',
        title: 'Expedição 63',
        location:
          'Ancient Sanctuary — na segunda metade do labirinto, antes de Giant Bell Alley, siga reto na bifurcação do Robust Sakapatate até o beco com a marca de Paint Cage.',
      },
      {
        id: 'j-e64',
        title: 'Expedição 64',
        location:
          'Continente — encontre o pequeno acampamento em terra firme a sudoeste do portal de The Meadows e a leste de Ancient Gestral City.',
      },
      {
        id: 'j-e65',
        title: 'Expedição 65',
        location:
          "Monoco's Station — atravesse a estação até a saída dos fundos que leva à montanha de Frozen Hearts; o diário está perto dos Grandis e da parede.",
      },
      {
        id: 'j-e66',
        title: 'Expedição 66',
        location:
          "Esquie's Nest — depois que Esquie derrubar o pilar e entrar no grupo, siga pela passagem aberta em direção à saída; o diário está junto ao corpo no acampamento.",
      },
      {
        id: 'j-e67',
        title: 'Expedição 67',
        location:
          'Sirène — após derrotar o Glissando, use a plataforma móvel e avance até a área aberta anterior ao chefe principal; procure junto às caixas e aos corpos.',
      },
      {
        id: 'j-e68',
        title: 'Expedição 68',
        location:
          'Flying Waters › após Coral Cave — depois do segundo Cruler, escolha a esquerda na bifurcação (a direita leva à Paint Cage vermelha); o diário está na rota principal.',
      },
      {
        id: 'j-e69',
        title: 'Expedição 69',
        location:
          'Visages › Joy Vale — atravesse a área para a extremidade esquerda/oeste e derrote ou contorne os inimigos; o diário está atrás deles, junto aos corpos.',
      },
      {
        id: 'j-e70',
        title: 'Expedição 70',
        location:
          'Inside the Monolith › Tainted Lumière — ao alcançar a árvore vista no Prólogo, entre no beco à direita, use os grapples e passe pelos inimigos; o diário está atrás deles.',
      },
    ],
  },
  {
    title: 'Numerados — Fora de sequência',
    items: [
      {
        id: 'j-e78',
        title: 'Expedição 78',
        location:
          'Stone Wave Cliffs › Entrance — logo após a bandeira, na área do Hexga, pegue o caminho à direita antes do inimigo e suba a corda até a saliência.',
      },
      {
        id: 'j-e81',
        title: 'Expedição 81',
        location:
          'Spring Meadows › Abandoned Expeditioner Camp — recebido automaticamente na cena de apresentação do Jar; é o diário tutorial da campanha.',
        automatic: true,
      },
      {
        id: 'j-e84',
        title: 'Expedição 84',
        location:
          'The Fountain — partindo de Blanche, siga pelo caminho do lado oposto até o fim; o diário está junto ao expedicionário caído.',
      },
    ],
  },
] as const satisfies readonly CollectibleCategory[]

export const TRACKERS: Record<TrackerKey, TrackerDefinition> = {
  records: {
    title: 'Discos Musicais',
    unit: 'discos encontrados',
    note: 'Marque cada disco assim que ouvir no gramofone do acampamento. Seu progresso fica salvo automaticamente na sua conta.',
    footer: '33 discos únicos = conquista “Conhecedor”.',
    dense: false,
    tone: 'gold',
    categories: records,
  },
  journals: {
    title: 'Diários de Expedição',
    unit: 'diários encontrados',
    note: 'Marque cada diário conforme for encontrando pelo Continente. Seu progresso fica salvo automaticamente na sua conta.',
    footer: '49 diários = conquista “Follow the Trail” (Seguir o Rastro).',
    dense: true,
    tone: 'teal',
    categories: journals,
  },
}

export function getCollectibles(tracker: TrackerKey): readonly Collectible[] {
  return TRACKERS[tracker].categories.flatMap((category) => category.items)
}

export const ALL_COLLECTIBLE_IDS = Object.values(TRACKERS).flatMap((tracker) =>
  tracker.categories.flatMap((category) => category.items.map((item) => item.id)),
)

const collectibleIdSet = new Set<string>(ALL_COLLECTIBLE_IDS)

export function isCollectibleId(value: string): boolean {
  return collectibleIdSet.has(value)
}
