<script setup lang="ts">
import { BlockState } from '~/type';
import { isDev } from '~/composables/storage'
defineProps<{ block: BlockState }>()

const numberColors = [
  'text-transparent',
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
function getBlockClass(block: BlockState) {
    if (block.flagged) {
      return 'bg-gray-500/10'
    }
    if (!block.revealed) return 'bg-gray-500/10 hover:bg-gray'
    return block.mine ? 'text-red' : numberColors[block.adajacentMine]
  }
</script>
<template>
  <button
    :class="getBlockClass(block)"
    border="0.5 gray-400/30"
    w-8
    h-8
    flex="~"
    items-center
    justify-center
    m="1px"
  >
    <template v-if="block.flagged">
      <div i-mdi:flag text-red></div>
    </template>
    <template v-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi:mine></div>
      <div v-else font-600>{{ block.adajacentMine }}</div>
    </template>
  </button>
</template>