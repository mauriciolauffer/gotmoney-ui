import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Billboard from './Billboard.vue'

describe('Billboard.vue', () => {
  it('renders a canvas', () => {
    const wrapper = mount(Billboard, {
      props: {
        pixels: []
      }
    })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })
})
