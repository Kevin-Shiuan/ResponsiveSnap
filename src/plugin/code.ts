import MESSAGE_TYPE from '../constants/messageType'
import takeScreenshots from './takeScreenshots'
import { checkServer } from './utils/checkServer'

const fetchUrl = 'https://responsivesnap-backend.up.railway.app'

checkServer({ fetchUrl }).then(() => {
  figma.showUI(__html__, { visible: true, themeColors: true, width: 320, height: 600 })

  figma.ui.onmessage = async (pluginMessage) => {
    switch (pluginMessage.type) {
      case MESSAGE_TYPE.SHOW_NOTIFICATION:
        figma.notify(pluginMessage.data.message, pluginMessage.data.options)
        break
      case MESSAGE_TYPE.TAKE_SCREENSHOT:
        await takeScreenshots({ fetchUrl, url: pluginMessage.data.url, devices: pluginMessage.data.devices })
        break
      default:
        break
    }
  }
})
