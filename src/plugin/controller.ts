import { loadFonts, createTextElement, fillFrameWithImageFromURL } from './functions';

const TEST_OBJECT = [
  ['Person One', 'Software Engineer @ Google', 'He / Him'],
  ['Person Two', 'Product Designer @ Meta', 'She / Her'],
  ['Person Three', 'UX Designer @ Samsung', 'They / Them'],
  ['Person Four', 'Business Analyst @ Apple', 'He / Him'],
  ['Person Five', 'Data Engineer @ Google', 'He / Him'],
  ['Person Six', 'Software Engineer @ Google', 'He / Him'],
  ['Person Seven', 'Product Designer @ Meta', 'She / Her'],
  ['Person Eight', 'UX Designer @ Samsung', 'They / Them'],
  ['Person Nine', 'Business Analyst @ Apple', 'He / Him'],
  ['Person Ten', 'Data Engineer @ Google', 'He / Him'],
];

const TYPE_SCALE = [64, 32, 24, 20, 16, 12]

const TEMPLATE_IMG_URL = 'https://images.unsplash.com/photo-1534543210152-32025bcfaad9?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

figma.showUI(__html__);
figma.ui.resize(400, 450);

figma.ui.onmessage = async (msg: { type: string; width: number; height: number }) => {

  if (msg.type === 'create-nametags') {

    const nodes: SceneNode[] = [];

    loadFonts().then(() => {
      for (let i = 0; i < TEST_OBJECT.length; i++) {
        const frame = figma.createFrame();
        frame.layoutMode = 'VERTICAL';
        frame.primaryAxisAlignItems = 'CENTER';
        frame.counterAxisAlignItems = 'CENTER';

        for (let j = 0; j < TEST_OBJECT[i].length; j++) {
          let txtelement = createTextElement(TEST_OBJECT[i][j]);
          txtelement.fontSize = TYPE_SCALE[j];
          frame.appendChild(txtelement);
        }

        frame.x = (i % 5) * 1.1 * msg.width;
        frame.y = (Math.floor(i / 5)) * 1.1 * msg.height;
        frame.resize(msg.width, msg.height);
        frame.itemSpacing = 16;

        fillFrameWithImageFromURL(frame, TEMPLATE_IMG_URL);
        //   {
        //     type: 'GRADIENT_RADIAL',
        //     gradientTransform: [
        //       [1, 0, 0],
        //       [0, 1, 0],
        //     ],
        //     gradientStops: [
        //       { position: 0, color: { r: 1, g: 0.5, b: 0.2, a: 1 } },
        //       { position: 1, color: { r: 0.8, g: 0.3, b: 0.4, a: 1 } },
        //     ],
        //   },
        // ];
        
        figma.currentPage.appendChild(frame);
        nodes.push(frame);
      }

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    });
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
