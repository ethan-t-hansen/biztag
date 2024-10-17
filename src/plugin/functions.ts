const loadFonts = async () => {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
};

const createTextElement = (content: string, size: number, style: string) => {
  const text = figma.createText();
  text.characters = content;
  text.fontName = {
    family: 'Inter',
    style: style,
  };
  text.lineHeight = {
    value: 100,
    unit: 'PERCENT',
  }
  text.fills = [
    {
      type: 'SOLID',
      color: { r: 1, g: 1, b: 1 },
    },
  ];
  text.fontSize = size;
  return text;
};

async function fillFrameWithImageFromURL(frame: FrameNode, imageUrl: string) {
  // Fetch the image from the URL
  const imageResponse = await fetch(imageUrl);
  const imageArrayBuffer = await imageResponse.arrayBuffer();

  // Create a new Figma image using the array buffer
  const image = figma.createImage(new Uint8Array(imageArrayBuffer));

  // Create an image fill
  const imageFill: ImagePaint = {
    type: 'IMAGE',
    scaleMode: 'FILL',
    imageHash: image.hash,
  };

  // Set the fills property of the frame to the image fill
  frame.fills = [imageFill];
}

async function appendQRToFrame(frame: FrameNode, qrUrl: string) {
  const qr = figma.createRectangle();
  qr.resize(300, 300);

  try {
    // Fetch the QR code image from goQR.me API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=300x300&margin=10`;

    // Fetch the image data from the generated QR code URL
    const response = await fetch(qrCodeUrl);
    const buffer = await response.arrayBuffer();
    const imageBytes = new Uint8Array(buffer);

    // Create a Figma image from the bytes
    const imageHash = figma.createImage(imageBytes).hash;

    // Apply the image as the fill for the frame
    qr.fills = [
      {
        type: 'IMAGE',
        imageHash: imageHash,
        scaleMode: 'FILL' // Scale the image to fill the frame
      }
    ];

    // Append the frame to the current page
    frame.appendChild(qr);

  } catch (error) {
    console.error("Error generating QR Code:", error);
  }
}

function generateFrame(width: number, height: number, gap: number) {
  const frame = figma.createFrame();
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisAlignItems = 'CENTER';
  frame.counterAxisAlignItems = 'CENTER';
  frame.resize(width, height);
  frame.itemSpacing = gap;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  return frame;
}

export { loadFonts, createTextElement, fillFrameWithImageFromURL, generateFrame, appendQRToFrame };
