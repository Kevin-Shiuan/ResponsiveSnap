import { DeviceSettings, ScreenshotData } from '../types/index'
import { insertImage } from './insertImage'
import { requestScreenshotData } from './requestScreenshotData'

interface takeScreenshotsProps {
  fetchUrl: string
  url: string
  devices: DeviceSettings[]
}

const MAX_RETRY = 2

export default async function takeScreenshots({ fetchUrl, url, devices }: takeScreenshotsProps) {
  let figmaNotification = figma.notify('Taking screenshots...', {
    timeout: Infinity
  })

  const posX0 = figma.viewport.center.x
  const posY0 = figma.viewport.center.y
  const userId = figma.currentUser ? figma.currentUser.id || '' : ''

  const screenshotNodes: FrameNode[] = []
  const totalTasks = devices.length
  let completedTasks = 0
  let uncompletedTasks = 0

  const getNotificationMessage = () => {
    return uncompletedTasks
      ? `Taking screenshots... ${completedTasks}/${totalTasks}, (${uncompletedTasks} failed)`
      : `Taking screenshots... ${completedTasks}/${totalTasks}`
  }

  const tasks = devices.map((device) => {
    const screenshotPromise = new Promise((resolve, reject) => {
      let retryCount = 0
      const attemptScreenshot = () => {
        requestScreenshotData({
          fetchUrl,
          url,
          settings: device,
          userId
        })
          .then((data) => resolve(data))
          .catch((err) => {
            retryCount++
            if (retryCount < MAX_RETRY) {
              attemptScreenshot()
            } else {
              reject(err)
            }
          })
      }
      attemptScreenshot()
    })

    screenshotPromise
      .then((data) => {
        const screenshotNode = insertImage({
          screenshotData: data as ScreenshotData,
          posX: posX0,
          posY: posY0
        })
        screenshotNodes.push(screenshotNode)
        completedTasks++
        figmaNotification.cancel()
        figmaNotification = figma.notify(getNotificationMessage(), {
          timeout: Infinity
        })
      })
      .catch(() => {
        uncompletedTasks++
        figmaNotification.cancel()
        figmaNotification = figma.notify(getNotificationMessage(), {
          timeout: Infinity
        })
      })

    return screenshotPromise
  })

  try {
    figmaNotification.cancel()
    figmaNotification = figma.notify(getNotificationMessage(), {
      timeout: Infinity
    })
    await Promise.allSettled(tasks)
  } catch (err) {
    console.log(err)
    figmaNotification.cancel()
  }

  const arrangedScreenshotNodes = screenshotNodes.map((node, index) => {
    if (index) {
      const preNode = screenshotNodes[index - 1]
      node.x = preNode.x + preNode.width + 100
    }
    return node
  })

  figma.viewport.scrollAndZoomIntoView(arrangedScreenshotNodes)
  figmaNotification.cancel()
  const finalMessage = uncompletedTasks
    ? `${completedTasks}/${totalTasks} screenshots success (${uncompletedTasks} failed)`
    : 'Your screenshots are ready, enjoy!'
  figma.notify(finalMessage)
}
