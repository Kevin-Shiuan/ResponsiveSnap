import { type ScreenshotData } from '../types/index'
import stringToUint8Array from './utils/stringToUint8Array'

interface InsertImageProps {
  screenshotData: ScreenshotData
  posX: number
  posY: number
}

export function insertImage({
  screenshotData: { name, width, height, data },
  posX = figma.viewport.center.x,
  posY = figma.viewport.center.y
}: InsertImageProps) {
  const frameNode = figma.createFrame()
  frameNode.resize(width, height)
  frameNode.name = name
  frameNode.x = posX
  frameNode.y = posY
  frameNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]

  for (let y = 0; y * 4096 < height; y += 1) {
    const imageHash = figma.createImage(stringToUint8Array(data[y])).hash
    const imageNode = figma.createRectangle()
    imageNode.name = y.toString()
    imageNode.x = 0
    imageNode.y = y * 4096

    imageNode.resize(width, Math.min(4096, height - y * 4096))
    imageNode.fills = [{ type: 'IMAGE', imageHash: imageHash, scaleMode: 'FIT' }]

    frameNode.appendChild(imageNode)
  }

  return frameNode
}
