import { BlockState } from "~/type";
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
export class GamePlay {
  mineGenerated = false;
  state = ref<BlockState[][]>([]);
  // console.log(state);
  constructor(public width: number, public height: number) {
    this.reset();
  }

  reset() {
    this.mineGenerated = false;
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from(
        { length: this.width },
        (_, x): BlockState => ({
          x,
          y,
          adajacentMine: 0,
          revealed: false,
        })
      )
    );
  }

  onRightClick(block: BlockState) {
    if (block.revealed) {
      return;
    }
    block.flagged = !block.flagged;
    this.checkGameState();
  }
  onClick(block: BlockState) {
    if (!this.mineGenerated) {
      this.generateMines(this.state.value, block);
      this.mineGenerated = true;
    }
    block.revealed = true;
    if (block.mine) {
      alert("BOOM!!!!!!!");
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
    this.state.value.forEach((row) => {
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
        return this.state.value[y2][x2];
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
  checkGameState() {
    if (!this.mineGenerated) return;
    const blocks = this.state.value.flat();
    if (blocks.every((block) => block.flagged || block.revealed)) {
      if (blocks.some((block) => block.flagged && !block.mine)) {
        alert("you CHeat!!!");
      }
      alert("you win!!!!!");
    }
  }
}
