<script setup lang="ts">
// import MineBlock from '~/components/MineBlock.vue'
// import Confetti from '~/components/Confetti.vue'
import { isDev, toggleDev } from '~/composables/storage';
import { GamePlay } from '~/composables/logic'
const play = new GamePlay(6, 6, 3)
// vueuse传一个ref，保存
let start = new Date()
const now = $(useNow())
// vueuse里的东西
const timerMs = $computed(() => Math.round((+now - +start) / 1000))

useStorage('vuesweeper-state', play.state)
const state = $computed(() => play.board)
function newGame(difficuty: 'ez' | 'middle' | 'hard') {
  switch (difficuty) {
    case 'ez':
      play.reset(9, 9, 10)
      start = new Date()
      break;
    case 'middle':
      play.reset(16, 16, 40)
      start = new Date()
      break;
    case 'hard':
      play.reset(20, 20, 99)
      start = new Date()
      break;

    default:
      break;
  }
}
watchEffect(() => {
  play.checkGameState()
})
</script>

<template>
  <div text-center>
    MineSweeper
    <div flex="~ gap-1" justify-center>
      <button btn @click="newGame('ez')">Easy</button>
      <button btn @click="newGame('middle')">Middle</button>
      <button btn @click="newGame('hard')">Hard</button>
    </div>
    <div flex justify-center>
      <div font-mono text-2xl flex="~ gap-1" items-center>
        <div i-carbon-timer></div>
        {{ timerMs }}
      </div>
      <div font-mono text-2xl flex="~ gap-1" items-center>
        <div i-mdi:mine></div>
        {{ play.blocks.reduce((acc, block) => acc + (block.mine ? 1 : 0) - (block.flagged ? 1 : 0), 0) }}
      </div>
    </div>

    <div p5 w-full overflow-auto>
      <div w-max ma v-for="row, y in state" :key="y" flex="~" items-center justify-center>
        <MineBlock
          v-for="block, x in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
          @dblclick="play.autoExpand(block)"
        />
      </div>
    </div>
    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">{{ isDev ? 'DEV' : 'NORMAL' }}</button>
    </div>

    <Confetti :passed="play.state.value.gameState === 'won'" />
  </div>
</template>
