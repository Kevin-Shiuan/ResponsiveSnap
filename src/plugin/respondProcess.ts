import { DeviceSettings } from '../types/index'
import { insertImage } from './insertImage'
import { requestSnap } from './requestSnap'
import { delayExecution } from './utils/delayExecution'
import { random } from './utils/random'

interface Params {
  URL: string
  settings: DeviceSettings
  userId: string | null
}

export async function respondProcess({
  params,
  fetchUrl,
  posX = figma.viewport.center.x,
  posY = figma.viewport.center.y
}: {
  params: Params
  fetchUrl: string
  posX: number
  posY: number
}) {
  // TODO: refactor this function
  return new Promise((resolve, reject) => {
    // setTimeout(res, Math.random() * 5000);
    // await delayExecution(random(5000, 10000));
    ;(async () => {
      const numberOfRetries = 5
      let retryCount = 0
      let retry = true

      while (retry) {
        try {
          const respond = await requestSnap({ params: params, fetchUrl })
          if (respond.errMsg) throw respond.errMsg
          resolve(insertImage({ ...respond, posX, posY }))
          return
        } catch (err) {
          console.log(`error in fetching from server, retrying ${retryCount + 1}/${numberOfRetries}`)
        }
        retryCount++
        if (retryCount < numberOfRetries) {
          await delayExecution(random(2000, 8000))
        } else {
          retry = false
        }
      }

      reject('error in fetching from server')
    })()
  })
}
