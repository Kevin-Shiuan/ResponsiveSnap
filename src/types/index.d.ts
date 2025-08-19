export type DeviceSettings = {
  width: number
  height: number
  emulateDevice: string
  fullPage: boolean
}

export interface ScreenshotData {
  name: string
  width: number
  height: number
  data: string[]
}
