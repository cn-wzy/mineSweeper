import { BlockState } from "~/type";
import { Ref } from "Vue";
const direction = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, 1],
  [-1, -1],
  [0, -1],
  [-1, 1],
  [-1, 0],
];
interface GameState {
  board: BlockState[][];
  mineGenerated: boolean;
  gameState: "play" | "won" | "lost";
}
export class GamePlay {
  state = ref() as Ref<GameState>;
  constructor(public width: number, public height: number) {
    this.reset();
  }
  reset() {
    this.state.value = {
      mineGenerated: false,
      gameState: "play",
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from(
          { length: this.width },
          (_, x): BlockState => ({
            x,
            y,
            adajacentMine: 0,
            revealed: false,
          })
        )
      ),
    };
  }

  get board() {
    return this.state.value.board;
  }
  onRightClick(block: BlockState) {
    if (block.revealed) {
      return;
    }
    block.flagged = !block.flagged;
    this.checkGameState();
  }
  onClick(block: BlockState) {
    if (this.state.value.gameState !== "play") return;

    if (!this.state.value.mineGenerated) {
      this.generateMines(this.board, block);
      this.state.value.mineGenerated = true;
    }
    block.revealed = true;
    if (block.mine) {
        this.state.value.gameState = "lost";
      this.showAllMines();
      return;
    }
    this.expendZero(block);
    this.checkGameState();
  }

  generateMines(state: BlockState[][], initial: BlockState) {
    for (const row of state) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) <= 1) continue;
        if (Math.abs(initial.y - block.y) <= 1) continue;
        block.mine = Math.random() < 0.2;
      }
    }
    this.updateNumber();
  }

  updateNumber() {
    this.board.forEach((row) => {
      row.forEach((block) => {
        if (block.mine) {
          return;
        }
        this.getSiblings(block).forEach((b) => {
          if (b.mine) block.adajacentMine += 1;
        });
      });
    });
  }
  getSiblings(block: BlockState) {
    return direction
      .map(([dx, dy]) => {
        const x2 = block.x + dx;
        const y2 = block.y + dy;
        if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
          return undefined;
        return this.board[y2][x2];
      })
      .filter(Boolean) as BlockState[];
  }

  expendZero(block: BlockState) {
    if (block.adajacentMine) {
      return;
    }
    this.getSiblings(block).forEach((s) => {
      if (!s.revealed) {
        s.revealed = true;
        this.expendZero(s);
      }
    });
  }
  showAllMines() {
    this.board.flat().forEach((i) => {
      if (i.mine) i.revealed = true;
    });
  }
  checkGameState() {
    if (!this.state.value.mineGenerated) return;
    const blocks = this.board.flat();
    if (blocks.every((block) => block.flagged || block.revealed)) {
      if (blocks.some((block) => block.flagged && !block.mine)) {
        this.state.value.gameState = "lost";
        this.showAllMines();
      } else this.state.value.gameState = "won";
    }
  }
}
