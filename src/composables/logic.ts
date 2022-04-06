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
  startMs: number;
}
export class GamePlay {
  state = ref() as Ref<GameState>;
  constructor(
    public width: number,
    public height: number,
    public mines: number
  ) {
    this.reset();
  }
  reset(width = this.width, height = this.height, mines = this.mines) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.state.value = {
      startMs: Date.now(),
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
  get blocks() {
    return this.state.value.board.flat() as BlockState[];
  }
  onRightClick(block: BlockState) {
    if (block.revealed) {
      return;
    }
    block.flagged = !block.flagged;
    // this.checkGameState();
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
    // this.checkGameState();
  }
  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  randomInt(min: number, max: number) {
    return Math.round(this.random(min, max));
  }
  generateMines(state: BlockState[][], initial: BlockState) {
    const placeRandom = () => {
      const x = this.randomInt(0, this.width - 1);
      const y = this.randomInt(0, this.height - 1);
      const block = state[y][x];

      if (
        Math.abs(initial.x - block.x) <= 1 &&
        Math.abs(initial.y - block.y) <= 1
      )
        return false;
      if (block.mine) return false;
      block.mine = true;
      return true;
    };
    Array.from({ length: this.mines }, () => null).forEach(() => {
      while (!placeRandom()) {}
    });
    // for (const row of state) {
    //   for (const block of row) {
    //     if (Math.abs(initial.x - block.x) <= 1) continue;
    //     if (Math.abs(initial.y - block.y) <= 1) continue;
    //     block.mine = Math.random() < 0.2;
    //   }
    // }
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
    if (blocks.every((block) => block.flagged || block.revealed || block.mine)) {
      if (blocks.some((block) => block.flagged && !block.mine)) {
        this.state.value.gameState = "lost";
        this.showAllMines();
        alert("lost");
      } else {
        this.state.value.gameState = "won";
        // alert("won");
      }
    }
  }
  autoExpand(block: BlockState) {
    const sliblings = this.getSiblings(block)
    const flags = sliblings.reduce((acc, cur) => {
      return acc + (cur.flagged ? 1 : 0)
    }, 0)
    const notRevealed = sliblings.reduce((acc, cur) => {
      return acc + (!cur.revealed && !block.flagged ? 1 : 0)
    }, 0)
    if (flags === block.adajacentMine) {
      sliblings.forEach((s) => {
        s.revealed = true
      })
    }
    const missingFlags = block.adajacentMine - flags
    if (notRevealed === missingFlags) {
      sliblings.forEach(i => {
        if (!i.revealed && !i.flagged) {
          i.flagged = true
        }
      })
    }
  }
}
