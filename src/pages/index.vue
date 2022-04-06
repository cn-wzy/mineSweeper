<script setup lang="ts">
// import MineBlock from '~/components/MineBlock.vue'
// import Confetti from '~/components/Confetti.vue'
import { isDev, toggleDev } from '~/composables/storage';
import { GamePlay } from '~/composables/logic'
const play = new GamePlay(6, 6, 3)
// vueuse传一个ref，保存
useStorage('vuesweeper-state', play.state)
const state = computed(() => play.board)
watchEffect(() => {
  play.checkGameState()
})
</script>

<template>
  <div text-center>
    MineSweeper
    <div p5 w-full overflow-auto>
      <div w-max ma v-for="row, y in state" :key="y" flex="~" items-center justify-center>
        <MineBlock
          v-for="block, x in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>

    <div>
      {{play.blocks.reduce((acc, block) => acc + ((!block.revealed && block.mine) ? 1 : 0), 0)}}
    </div>

    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">{{ isDev ? 'DEV' : 'NORMAL' }}</button>
      <button btn @click="play.reset()">Reset</button>
    </div>
    <Confetti :passed="play.state.value.gameState === 'won'"/>
  </div>
</template>
