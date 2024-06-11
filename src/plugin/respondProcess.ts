import { insertImage } from './insertImage';
import { requestSnap } from './requestSnap';
import { random } from './utils/random';
import { delayExecution } from './utils/delayExecution';

interface Params {
  URL: string;
  settings: Settings;
  userId: string | null;
}

interface Settings {
  width: number;
  height: number;
  emulateDevice: string;
  fullpage: boolean;
}
export async function respondProcess({
  params,
  fetchUrl,
  posX = figma.viewport.center.x,
  posY = figma.viewport.center.y,
}: {
  params: Params;
  fetchUrl: string;
  posX: number;
  posY: number;
}) {
  return new Promise(async (resolve, reject) => {
    // setTimeout(res, Math.random() * 5000);
    // await delayExecution(random(5000, 10000));
    const numberOfRetries = 5;
    let retryCount = 0;
    let retry = true;
    while (retry) {
      try {
        const respond = await requestSnap({ params: params, fetchUrl });
        if (respond.errMsg) throw respond.errMsg;
        return resolve(insertImage({ ...respond, posX, posY }));
      } catch (err) {
        console.log(`error in fetching from server, retrying ${retryCount + 1}/${numberOfRetries}`);
      }
      retryCount++;
      retryCount < numberOfRetries ? await delayExecution(random(2000, 8000)) : (retry = false);
    }
    reject('error in fetching from server');
  });
}
