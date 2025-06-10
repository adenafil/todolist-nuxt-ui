export function useWebPush() {
  const { $api } = useNuxtApp()
  const { token } = useToken()
  const { showSuccessToast, showErrorToast } = useNotifications()

  const vapidPublicKey = 'BCbladojR-E42fS564DypCFvd8RqBolyZ5t0psBEWa8zKcUz7b6OMRTTB_CxKUA1EnJRWlskdZTv1O1bd0V9Edo'

  const isSupported = computed(() => {
    return process.client && 'serviceWorker' in navigator && 'PushManager' in window
  })

  const isPermissionGranted = ref(false)

  const checkPermission = () => {
    if (!isSupported.value) return false
    isPermissionGranted.value = Notification.permission === 'granted'
    return isPermissionGranted.value
  }

  const requestPermission = async () => {
    if (!isSupported.value) {
      showErrorToast('Your browser does not support push notifications')
      return false
    }

    const permission = await Notification.requestPermission()
    isPermissionGranted.value = permission === 'granted'
    
    if (!isPermissionGranted.value) {
      showErrorToast('Push notification permission denied')
      return false
    }

    return true
  }

  const subscribeUser = async () => {
    if (!isSupported.value || !isPermissionGranted.value) {
      return false
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js')
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })

      // Send subscription to backend
      await $api('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          Authorization: token.value
        },
        body: {
          subscription: JSON.stringify(subscription)
        }
      })

      showSuccessToast('Push notifications enabled successfully')
      return true
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      showErrorToast('Failed to enable push notifications')
      return false
    }
  }

  const unsubscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      const subscription = await registration?.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        
        // Notify backend
        await $api('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            Authorization: token.value
          }
        })
      }
      
      showSuccessToast('Push notifications disabled')
    } catch (error) {
      console.error('Error unsubscribing:', error)
      showErrorToast('Failed to disable push notifications')
    }
  }

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Initialize on mount
  onMounted(() => {
    checkPermission()
  })

  return {
    isSupported,
    isPermissionGranted,
    requestPermission,
    subscribeUser,
    unsubscribeUser,
    checkPermission
  }
}