<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  selectedX: number
  selectedY: number
}>()

const emit = defineEmits(['pixel-updated'])

const color = ref('#000000')
const link = ref('')
const owner = ref('')
const loading = ref(false)
const message = ref('')

const handleSubmit = async () => {
  loading.value = true
  message.value = ''
  try {
    const response = await fetch('http://localhost:8787/api/pixels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        x: props.selectedX,
        y: props.selectedY,
        color: color.value,
        link: link.value,
        owner: owner.value
      })
    })

    if (response.ok) {
      message.value = 'Pixel purchased successfully!'
      emit('pixel-updated')
    } else {
      const data = await response.json()
      message.value = `Error: ${data.error}`
    }
  } catch (e: any) {
    message.value = `Error: ${e.message}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pixel-form">
    <h3>Buy Pixel ({{ selectedX }}, {{ selectedY }})</h3>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Color:</label>
        <input type="color" v-model="color" required />
      </div>
      <div>
        <label>Link:</label>
        <input type="url" v-model="link" placeholder="https://..." />
      </div>
      <div>
        <label>Owner:</label>
        <input type="text" v-model="owner" placeholder="Your name" />
      </div>
      <button type="submit" :disabled="loading">Buy for $1</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.pixel-form {
  padding: 1rem;
  border: 1px solid #ddd;
  background: #f9f9f9;
  max-width: 300px;
}
form div {
  margin-bottom: 0.5rem;
}
label {
  display: block;
}
</style>
