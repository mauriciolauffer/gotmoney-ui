<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Billboard from './components/Billboard.vue'
import PixelForm from './components/PixelForm.vue'

const pixels = ref([])
const selectedPixel = ref<{ x: number, y: number } | null>(null)

const fetchPixels = async () => {
  try {
    const response = await fetch('http://localhost:8787/api/pixels')
    if (response.ok) {
      pixels.value = await response.json()
    }
  } catch (e) {
    console.error('Failed to fetch pixels', e)
  }
}

onMounted(() => {
  fetchPixels()
})

const handlePixelClick = (data: { x: number, y: number }) => {
  selectedPixel.value = { x: data.x, y: data.y }
}
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Million Pixel Billboard</h1>
      <p>1,000,000 pixels. $1 per pixel. Own a piece of the internet!</p>
    </header>

    <main>
      <div class="billboard-wrapper">
        <Billboard :pixels="pixels" @pixel-click="handlePixelClick" />
      </div>

      <div class="sidebar" v-if="selectedPixel">
        <PixelForm
          :selectedX="selectedPixel.x"
          :selectedY="selectedPixel.y"
          @pixel-updated="fetchPixels"
        />
      </div>
    </main>
  </div>
</template>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: sans-serif;
}
header {
  text-align: center;
  padding: 1rem;
}
main {
  display: flex;
  gap: 20px;
}
.billboard-wrapper {
  flex: 1;
}
.sidebar {
  width: 320px;
}
</style>
