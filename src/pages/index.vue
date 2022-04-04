<script setup lang="ts">
import {BlockState} from '~/type'
const WIDTH = 6;
const HEIGHT = 6;

const state = ref(Array.from({ length: HEIGHT }, (_, y) => Array.from({ length: WIDTH }, (_, x): BlockState => ({
  x,
  y,
  adajacentMine: 0,
  revealed: false
}))))
// console.log(state);

let mineGenerated = false;
let dev = false;
function onRightClick(block: BlockState) {
  if (block.revealed) {
    return;
  }
  block.flagged = !block.flagged;
  checkGameState()
}
function onClick(e: MouseEvent, block: BlockState) {
  if (!mineGenerated) {
    generateMines(block)
    mineGenerated = true;
  }
  block.revealed = true;
  if (block.mine) {
    alert('BOOM!!!!!!!')
  }
  expendZero(block)
  checkGameState()
}

function generateMines(initial: BlockState) {
  for (const row of state.value) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1) continue;
      if (Math.abs(initial.y - block.y) <= 1) continue;
      block.mine = Math.random() < 0.2;
    }
  }
  updateNumber()
}
const direction = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, 1],
  [-1, -1],
  [0, -1],
  [-1, 1],
  [-1, 0]
]
const numberColors = [
  'text-white-500',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
  'text-p-500',
  'text-pink-500',
]
// watchEffect(checkGameState)
function updateNumber() {
  state.value.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine) {
        return;
      }
      getSiblings(block).forEach(b => {
        if (b.mine) block.adajacentMine += 1;
      });
    })
  })


}
function getSiblings(block: BlockState) {
  return direction.map(([dx, dy]) => {
    const x2 = block.x + dx;
    const y2 = block.y + dy;
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined;
    return state.value[y2][x2]
  }).filter(Boolean) as BlockState[]
}
function getBlockClass(block: BlockState) {
  if (block.flagged) {
    return 'bg-gray-500/10'
  }
  if (!block.revealed) return 'bg-gray-500/10 hover:bg-gray'
  return block.mine ? 'text-red' : numberColors[block.adajacentMine]
}
function expendZero(block: BlockState) {
  if (block.adajacentMine) {
    return;
  }
  getSiblings(block).forEach(s => {
    if (!s.revealed) {
      s.revealed = true;
      expendZero(s);
    }

  })
}
function checkGameState() {
  if (!mineGenerated) return;
  const blocks = state.value.flat();
  if (blocks.every((block) => block.flagged || block.revealed)){
     if (blocks.some(block => block.flagged && !block.mine)) {
       alert("you CHeat!!!")
     }
     alert("you win!!!!!")
  }
}

</script>

<template>
  <div text-center>
    MineSweeper
    <div p5>
      <div v-for="row, y in state" :key="y" flex="~" items-center justify-center>
        <button
          v-for="block, x in row"
          @click="onClick($event, block)"
          @contextmenu.prevent="onRightClick(block)"
          :class="getBlockClass(block)"
          border="1 gray-400/30"
          w-10
          h-10
          :key="x"
          flex="~"
          items-center
          justify-center
          m="0.5"
        >
          <template v-if="block.flagged">
            <div i-mdi:flag text-red></div>
          </template>
          <template v-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi:mine></div>
            <div v-else>{{ block.adajacentMine }}</div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
