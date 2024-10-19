import { loadFonts, createTextElement, fillFrameWithImage, generateFrame, appendQRToFrame } from './functions';

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

figma.ui.onmessage = async (msg: { type: string; image: string; json: DelegatesList; width: number; height: number }) => {

  if (msg.type === 'create-nametags') {

    const { image, json, width, height } = msg;
    
    console.log('Received image data:', image);
    console.log('Received JSON data:', json);
    console.log('Width:', width);
    console.log('Height:', height);

    console.log(image);
    let imageData = image;
    const jsonData = json ? json : TEST_OBJECT;

    const nodes: SceneNode[] = [];

    loadFonts().then(() => {
      for (let i = 0; i < jsonData.length; i++) {

        // Create a WxH autolayout frame
        const frontFrame = generateFrame(width, height, 20)

        // Append logo to Frame
        const ellipseWrap = generateFrame(width/2.5, height/2.5, 0);
        ellipseWrap.fills = [];
        const ellipse = figma.createEllipse();
        ellipse.resize(width/2.5, width/2.5);
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
        fillFrameWithImage(frontFrame, imageData);
        frontFrame.x = i * 1.2 * width;
        frontFrame.name = delegate.firstname + " " + delegate.lastname + " Front";

        // Append front to canvas
        figma.currentPage.appendChild(frontFrame);
        nodes.push(frontFrame);

        // Generate back of name tag
        const backFrame = generateFrame(width, height, 32);
        fillFrameWithImage(backFrame, imageData);
        let linkedinUrl = delegate.linkedin ? delegate.linkedin : LINKEDIN_URL;
        let linkedinText = createTextElement('linkedin', 64, 'Bold');
        backFrame.appendChild(linkedinText)
        appendQRToFrame(backFrame, linkedinUrl);
        backFrame.x = i * 1.2 * width;
        backFrame.y = height * 1.2;

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
