import { loadFonts, createTextElement, fillFrameWithImageFromURL, generateFrame, appendQRToFrame } from './functions';

// --------- TYPES ---------

type Delegate = {
  firstname: string;
  lastname: string;
  position: string;
  pronouns: string;
  linkedin: string;
};

type DelegatesList = Delegate[];

// --------- TEST VARIABLES ---------

const LINKEDIN_URL: string = 'https://www.linkedin.com/'

const DEFAULT_IMG_URL = 'https://images.unsplash.com/photo-1534543210152-32025bcfaad9?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const TEST_OBJECT: DelegatesList = [
  {
    firstname: 'No Data',
    lastname: 'Found',
    position: '',
    pronouns: '',
    linkedin: LINKEDIN_URL,
  }
]

// ------------------------------------------------------------------------------------------------------------------------------------------

figma.showUI(__html__);
figma.ui.resize(400, 660);

figma.ui.onmessage = async (msg: { type: string; imgurl: string; data: DelegatesList; width: number; height: number }) => {

  // If user inputted a url, use that, otherwise use default
  const image_url = msg.imgurl ? msg.imgurl : DEFAULT_IMG_URL;
  const jsonData = msg.data ? msg.data : TEST_OBJECT;

  if (msg.type === 'create-nametags') {

    const nodes: SceneNode[] = [];

    loadFonts().then(() => {
      for (let i = 0; i < jsonData.length; i++) {

        // Create a WxH autolayout frame
        const frontFrame = generateFrame(msg.width, msg.height, 20)

        // Append logo to Frame
        const ellipseWrap = generateFrame(msg.width/2.5, msg.height/2.5, 0);
        ellipseWrap.fills = [];
        const ellipse = figma.createEllipse();
        ellipse.resize(msg.width/2.5, msg.width/2.5);
        ellipse.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
        ellipse.name = "Company Logo Element"
        ellipseWrap.name = "Company Logo Frame"
        ellipseWrap.appendChild(ellipse);
        frontFrame.appendChild(ellipseWrap);

        // Append JSON Data to Frame
        let delegate = jsonData[i];

        let position = createTextElement(delegate.position, 24, 'Medium');
        position.name = 'Position'
        frontFrame.appendChild(position)

        let firstName = createTextElement(delegate.firstname, 80, 'Bold');
        firstName.name = 'First Name'
        frontFrame.appendChild(firstName)

        let lastName = createTextElement(delegate.lastname, 80, 'Bold');
        lastName.name = 'Last Name'
        frontFrame.appendChild(lastName)

        let pronouns = createTextElement(delegate.pronouns, 24, 'Medium');
        pronouns.name = 'Pronouns'
        frontFrame.appendChild(pronouns)

        

        // Set frame fill and position on canvas
        fillFrameWithImageFromURL(frontFrame, image_url);
        frontFrame.x = i * 1.2 * msg.width;
        // frontFrame.x = (i % 5) * 1.1 * msg.width;
        // frontFrame.y = (Math.floor(i / 5)) * 1.1 * msg.height;
        frontFrame.name = delegate.firstname + " " + delegate.lastname + " Front";

        // Append front to canvas
        figma.currentPage.appendChild(frontFrame);
        nodes.push(frontFrame);

        // Generate back of name tag
        const backFrame = generateFrame(msg.width, msg.height, 32);
        fillFrameWithImageFromURL(backFrame, image_url);
        let linkedinUrl = delegate.linkedin ? delegate.linkedin : LINKEDIN_URL;
        let linkedinText = createTextElement('linkedin', 64, 'Bold');
        backFrame.appendChild(linkedinText)
        appendQRToFrame(backFrame, linkedinUrl);
        backFrame.x = i * 1.2 * msg.width;
        backFrame.y = msg.height * 1.2;

        backFrame.name = delegate.firstname + " " + delegate.lastname + " Back";

        // Append back to canvas
        figma.currentPage.appendChild(backFrame);
        nodes.push(backFrame);

      }

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);

    });

  } else if (msg.type === 'cancel') {

    figma.closePlugin();

  }
};
