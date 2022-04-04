export interface BlockState {
    x: number
    y: number
    revealed: boolean
    mine?: boolean
    flagged?: boolean,
    adajacentMine: number
  }