import stringToUint8Array from './utils/stringToUint8Array';

export function insertImage({
  name,
  snap_data,
  width,
  height,
  posX = figma.viewport.center.x,
  posY = figma.viewport.center.y,
}: {
  name: string;
  snap_data: string;
  width: number;
  height: number;
  posX: number;
  posY: number;
}) {
  const imageHash = figma.createImage(stringToUint8Array(snap_data)).hash;

  const imageNode = figma.createRectangle();
  imageNode.name = name;
  imageNode.x = 0;
  imageNode.y = 0;

  imageNode.resize(width, height);
  imageNode.fills = [{ type: 'IMAGE', imageHash: imageHash, scaleMode: 'FIT' }];


  const frameNode = figma.createFrame();
  frameNode.name = name;
  frameNode.x = posX;
  frameNode.y = posY;

  frameNode.resize(width, height);
  frameNode.appendChild(imageNode);

  return frameNode;
}
