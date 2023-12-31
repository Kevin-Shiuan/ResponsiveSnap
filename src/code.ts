import { checkServer } from './utils/checkServer';
import { respondProcess } from './respondProcess';

const fetchUrl = process.env.fetchUrl as string;

interface Settings {
  width: number;
  height: number;
  emulateDevice: string;
  fullpage: boolean;
}
// check the server status
checkServer({ fetchUrl });

figma.showUI(__html__, { visible: true, themeColors: true, width: 400, height: 700 });
figma.ui.onmessage = async (message) => {
  if (message === 'offline') {
    figma.notify('This plugin require internet connection', { error: true });
    return;
  }
  if (message === 'online') {
    return;
  }
  if (message === 'minimum') {
    figma.notify('Please provide at least one device to take a snapshot');
    return;
  }
  if (message === 'maximum') {
    figma.notify('Maximum 3 devices are allowed');
    return;
  }
  if (message === 'invalidURL') {
    figma.notify('the URL is invalid', { error: true });
    return;
  }
  const respond = JSON.parse(message);
  // console.log(message);
  if (!respond.devices.length) {
    figma.notify('Please fill in the device information');
    return;
  }
  await main({ URL: respond.URL, arrSettings: respond.devices });
};

async function main({ URL, arrSettings }: { URL: string; arrSettings: Settings[] }) {
  console.log('ResponsiveSnap plugin is running...');
  const runningNotifier = figma.notify('Taking snapshots...', {
    timeout: Infinity,
  });
  // Runs this code if the plugin is run in Figma
  // if (figma.editorType === 'figma') {
  // get the viewport center
  const posX0 = figma.viewport.center.x;
  const posY0 = figma.viewport.center.y;
  // set the user id
  const userId = figma.currentUser ? figma.currentUser.id : '';

  // create an array of promises, each promise is a snapshot request and insert image process
  const tasks = arrSettings.map((settings) => {
    return respondProcess({
      params: { URL, settings: settings, userId },
      fetchUrl,
      posX: posX0,
      posY: posY0,
    });
  });
  // set total number of snapshots
  const totalTasks = tasks.length;
  let completedTasks = 0;
  let uncompletedTasks = 0;
  let insertedImgNodes: any[] = [];
  let message = () => {
    return uncompletedTasks
      ? `Taking snapshots... ${completedTasks}/${totalTasks}, (${uncompletedTasks} failed)`
      : `Taking snapshots... ${completedTasks}/${totalTasks}`;
  };

  // resolve all promises
  // let insertedImgNodes: any[] = await Promise.allSettled(tasks);
  runningNotifier.cancel();
  let progressBar = figma.notify(message(), {
    timeout: Infinity,
  });
  tasks.forEach(async (task) => {
    task
      .then((result) => {
        insertedImgNodes.push(result);
        completedTasks++;
        progressBar.cancel();
        progressBar = figma.notify(message(), {
          timeout: Infinity,
        });
      })
      .catch(() => {
        uncompletedTasks++;
        // insertedImgNodes.push(result);
        // console.log('error in main');
        // console.log(result);
        // completedTasks++;
        progressBar.cancel();
        progressBar = figma.notify(message(), {
          timeout: Infinity,
        });
      });
  });
  try {
    await Promise.allSettled(tasks);
  } catch (err) {
    console.log(err);
    progressBar.cancel();
  }
  // adjust nodes position
  insertedImgNodes = insertedImgNodes.map((node, index) => {
    if (index) {
      const preNode = insertedImgNodes[index - 1];
      node.x = preNode.x + preNode.width + 100;
    }
    return node;
  });
  figma.viewport.scrollAndZoomIntoView(insertedImgNodes);
  console.log('all images are inserted');
  progressBar.cancel();
  const finalMessage = uncompletedTasks
    ? `${completedTasks}/${totalTasks} snaps ready, (${uncompletedTasks} failed)`
    : 'Your snaps are ready, enjoy!';
  figma.notify(finalMessage);

  console.log('ResponsiveSnap plugin runned successfully.');
  // figma.closePlugin();
}
