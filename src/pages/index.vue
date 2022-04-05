<script setup lang="ts">
import MineBlock from '~/components/MineBlock.vue'
import { isDev, toggleDev } from '~/composables/storage';
import { GamePlay } from '~/composables/logic'
const play = new GamePlay(12, 12)
const state = play.state

</script>

<template>
  <div text-center>
    MineSweeper
    <div p5>
      <div v-for="row, y in state" :key="y" flex="~" items-center justify-center>
        <MineBlock
          v-for="block, x in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
      <div flex="~ gap-1" justify-center>
        <button btn @click="toggleDev()">{{ isDev ? 'DEV' : 'NORMAL' }}</button>
        <button btn @click="play.reset()">Reset</button>
      </div>
    </div>
  </div>
</template>
