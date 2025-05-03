export default defineNuxtPlugin(() => {
  const bus = reactive({
    listeners: {},
    on(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = []
      }
      this.listeners[event].push(callback)
    },
    off(event, callback) {
      if (!this.listeners[event]) return
      
      if (!callback) {
        delete this.listeners[event]
        return
      }
      
      const index = this.listeners[event].indexOf(callback)
      if (index > -1) {
        this.listeners[event].splice(index, 1)
      }
    },
    emit(event, ...args) {
      if (!this.listeners[event]) return
      this.listeners[event].forEach(callback => {
        callback(...args)
      })
    }
  })

  return {
    provide: {
      bus
    }
  }
})