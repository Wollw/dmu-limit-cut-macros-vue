<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()

const source = ref('')
const { text, copy, copied, isSupported } = useClipboard({ source })

function _copy(_source: string) {
  copy(_source)
  $toast.success('Copied Macro')
}

interface Props {
  name: string
  lines: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="output">
    {{ name }}
    <pre @click="_copy(lines)">{{ lines }}</pre>
  </div>
</template>
