import { SHOW_NOTIFICATION } from '../../constant/messageType'

export function sendMessage(type: string, data?: unknown) {
  parent.postMessage({ pluginMessage: { type, data } }, '*')
}

export function figmaNotify(message: string, options?: NotificationOptions) {
  sendMessage(SHOW_NOTIFICATION, { message, options })
}
