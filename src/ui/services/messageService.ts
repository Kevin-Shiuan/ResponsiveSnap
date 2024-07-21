import MESSAGE_TYPE from '../../constant/messageType'

type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE]

export function sendMessage(type: MessageType, data?: unknown) {
  parent.postMessage({ pluginMessage: { type, data } }, '*')
}

export function figmaNotify(message: string, options?: NotificationOptions) {
  sendMessage(MESSAGE_TYPE.SHOW_NOTIFICATION, { message, options })
}
