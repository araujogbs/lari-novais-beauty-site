/** Uma estrela no desenho (caixa de 400 x 240). `size` acompanha o brilho; `label` só nas principais. */
export interface ConstellationStar {
  x: number;
  y: number;
  size: number;
  label?: string;
}

export interface ConstellationData {
  name: string;
  /** Apelido mostrado ao lado do nome, ligado ao tema da seção. */
  nickname: string;
  /** Texto do botão de estrela. */
  about: string;
  stars: readonly ConstellationStar[];
  /** Pares de índices em `stars`, na ordem em que as linhas se desenham. */
  lines: readonly (readonly [number, number])[];
}

export type ConstellationId = 'noivas' | 'social' | 'cursos' | 'sobre';

export const CONSTELLATIONS: Record<ConstellationId, ConstellationData> = {
  noivas: {
    name: 'Corona Borealis',
    nickname: 'a constelação da noiva',
    about:
      'A Coroa Boreal. Na mitologia grega, é a coroa de estrelas que Dionísio deu a Ariadne no dia do casamento dos dois e depois lançou ao céu. Alphecca, a estrela mais brilhante, é a joia da coroa.',
    stars: [
      { x: 60, y: 70, size: 0.75 },
      { x: 98, y: 128, size: 1.05 },
      { x: 160, y: 170, size: 1.7, label: 'Alphecca' },
      { x: 228, y: 176, size: 0.95 },
      { x: 288, y: 152, size: 0.85 },
      { x: 330, y: 104, size: 0.95 },
      { x: 346, y: 50, size: 0.7 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  social: {
    name: 'Plêiades',
    nickname: 'a constelação da festa',
    about:
      'As Sete Irmãs, filhas de Atlas na mitologia grega: um aglomerado de estrelas que atravessa o céu sempre junto, como as amigas numa celebração. No Brasil, também é chamado de Sete-Estrelo.',
    stars: [
      { x: 150, y: 40, size: 0.8 },
      { x: 140, y: 92, size: 1 },
      { x: 92, y: 128, size: 1 },
      { x: 160, y: 168, size: 0.95 },
      { x: 222, y: 128, size: 1.6, label: 'Alcyone' },
      { x: 300, y: 132, size: 1.1 },
      { x: 312, y: 88, size: 0.75 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
      [4, 5],
      [5, 6],
    ],
  },
  cursos: {
    name: 'Cruzeiro do Sul',
    nickname: 'a constelação que guia',
    about:
      'O Cruzeiro do Sul orientou navegadores por séculos e está na bandeira do Brasil. Prolongando o braço maior da cruz cerca de quatro vezes e meia, chega-se perto do polo sul celeste. É a constelação de quem está encontrando o próprio caminho.',
    stars: [
      { x: 200, y: 24, size: 1.1 },
      { x: 196, y: 214, size: 1.6, label: 'Acrux' },
      { x: 116, y: 108, size: 1.3 },
      { x: 282, y: 96, size: 0.95 },
      { x: 246, y: 160, size: 0.6 },
    ],
    lines: [
      [0, 1],
      [2, 3],
    ],
  },
  sobre: {
    name: 'Lyra',
    nickname: 'a constelação da artista',
    about:
      'A lira de Orfeu, o músico grego cuja arte encantava até as pedras. Vega, a estrela principal, é uma das mais brilhantes do céu noturno.',
    stars: [
      { x: 176, y: 36, size: 1.6, label: 'Vega' },
      { x: 222, y: 22, size: 0.6 },
      { x: 200, y: 92, size: 0.85 },
      { x: 262, y: 104, size: 0.8 },
      { x: 250, y: 196, size: 0.95 },
      { x: 186, y: 184, size: 0.95 },
    ],
    lines: [
      [0, 1],
      [0, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 2],
    ],
  },
};
