import MESSAGE_TYPE from '../constant/messageType'
import { DeviceSettings } from '../types/index'
import { respondProcess } from './respondProcess'

// import { checkServer } from './utils/checkServer'

const fetchUrl = 'https://responsivesnap-backend.up.railway.app'

figma.showUI(__html__, { visible: true, themeColors: true, width: 320, height: 600 })

figma.ui.onmessage = async (pluginMessage) => {
  switch (pluginMessage.type) {
    case MESSAGE_TYPE.SHOW_NOTIFICATION:
      figma.notify(pluginMessage.data.message, pluginMessage.data.options)
      break
    case MESSAGE_TYPE.TAKE_SCREENSHOT:
      console.log(pluginMessage.data)
      break
    // case 'offline':
    //   figma.notify('This plugin requires an internet connection', { error: true })
    //   return

    // case 'online':
    //   await checkServer({ fetchUrl })
    //   return

    // case 'minimum':
    //   figma.notify('Please provide at least one device to take a snapshot')
    //   return

    // case 'maximum':
    //   figma.notify('Maximum 3 devices are allowed')
    //   return

    // case 'invalidURL':
    //   figma.notify('The URL is invalid', { error: true })
    //   return

    default:
      // if (!pluginMessage.devices.length) {
      //   figma.notify('Please fill in the device information')
      //   return
      // }
      // await main({ URL: respond.URL, arrSettings: respond.devices });
      break
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function main({ URL, arrSettings }: { URL: string; arrSettings: DeviceSettings[] }) {
  console.log('ResponsiveSnap plugin is running...')
  const runningNotifier = figma.notify('Taking snapshots...', {
    timeout: Infinity
  })
  // Runs this code if the plugin is run in Figma
  // if (figma.editorType === 'figma') {
  // get the viewport center
  const posX0 = figma.viewport.center.x
  const posY0 = figma.viewport.center.y
  // set the user id
  const userId = figma.currentUser ? figma.currentUser.id : ''

  // create an array of promises, each promise is a snapshot request and insert image process
  const tasks = arrSettings.map((settings) => {
    return respondProcess({
      params: { URL, settings: settings, userId },
      fetchUrl,
      posX: posX0,
      posY: posY0
    })
  })
  // set total number of snapshots
  const totalTasks = tasks.length
  let completedTasks = 0
  let uncompletedTasks = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let insertedImgNodes: any[] = []
  const message = () => {
    return uncompletedTasks
      ? `Taking snapshots... ${completedTasks}/${totalTasks}, (${uncompletedTasks} failed)`
      : `Taking snapshots... ${completedTasks}/${totalTasks}`
  }

  // resolve all promises
  // let insertedImgNodes: any[] = await Promise.allSettled(tasks);
  runningNotifier.cancel()
  let progressBar = figma.notify(message(), {
    timeout: Infinity
  })
  tasks.forEach(async (task) => {
    task
      .then((result) => {
        insertedImgNodes.push(result)
        completedTasks++
        progressBar.cancel()
        progressBar = figma.notify(message(), {
          timeout: Infinity
        })
      })
      .catch(() => {
        uncompletedTasks++
        // insertedImgNodes.push(result);
        // console.log('error in main');
        // console.log(result);
        // completedTasks++;
        progressBar.cancel()
        progressBar = figma.notify(message(), {
          timeout: Infinity
        })
      })
  })
  try {
    await Promise.allSettled(tasks)
  } catch (err) {
    console.log(err)
    progressBar.cancel()
  }
  // adjust nodes position
  insertedImgNodes = insertedImgNodes.map((node, index) => {
    if (index) {
      const preNode = insertedImgNodes[index - 1]
      node.x = preNode.x + preNode.width + 100
    }
    return node
  })
  figma.viewport.scrollAndZoomIntoView(insertedImgNodes)
  console.log('all images are inserted')
  progressBar.cancel()
  const finalMessage = uncompletedTasks
    ? `${completedTasks}/${totalTasks} snaps ready, (${uncompletedTasks} failed)`
    : 'Your snaps are ready, enjoy!'
  figma.notify(finalMessage)

  console.log('ResponsiveSnap plugin runned successfully.')
  // figma.closePlugin();
}
