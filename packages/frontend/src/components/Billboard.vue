<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  pixels: Array<{ x: number, y: number, color: string, link: string }>
}>()

const emit = defineEmits(['pixel-click'])

const canvasRef = ref<HTMLCanvasElement | null>(null)
const width = 1000
const height = 1000

const draw = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, width, height)

  // Draw grid (optional, maybe too heavy for 1M pixels)
  // For now just draw the pixels
  props.pixels.forEach(pixel => {
    ctx.fillStyle = pixel.color
    ctx.fillRect(pixel.x, pixel.y, 1, 1)
  })
}

onMounted(() => {
  draw()
})

watch(() => props.pixels, () => {
  draw()
}, { deep: true })

const handleClick = (event: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const x = Math.floor((event.clientX - rect.left))
  const y = Math.floor((event.clientY - rect.top))

  const pixel = props.pixels.find(p => p.x === x && p.y === y)
  emit('pixel-click', { x, y, pixel })
}
</script>

<template>
  <div class="billboard-container">
    <canvas
      ref="canvasRef"
      :width="width"
      :height="height"
      @click="handleClick"
      class="billboard-canvas"
    ></canvas>
  </div>
</template>

<style scoped>
.billboard-container {
  overflow: auto;
  border: 1px solid #ccc;
  width: 100%;
  height: 80vh;
}
.billboard-canvas {
  image-rendering: pixelated;
  cursor: crosshair;
}
</style>
