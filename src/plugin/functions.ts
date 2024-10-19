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

function base64ToUint8Array(base64: string): Uint8Array {
  const base64WithoutPrefix = base64.split(',')[1];

  // Decode base64 manually
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bufferLength = Math.floor((base64WithoutPrefix.length * 3) / 4) - (base64WithoutPrefix.endsWith('==') ? 2 : base64WithoutPrefix.endsWith('=') ? 1 : 0);
  const bytes = new Uint8Array(bufferLength);

  for (let i = 0, p = 0; i < base64WithoutPrefix.length; i += 4) {
    const encoded1 = chars.indexOf(base64WithoutPrefix.charAt(i));
    const encoded2 = chars.indexOf(base64WithoutPrefix.charAt(i + 1));
    const encoded3 = chars.indexOf(base64WithoutPrefix.charAt(i + 2));
    const encoded4 = chars.indexOf(base64WithoutPrefix.charAt(i + 3));

    const buffer = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

    if (p < bufferLength) bytes[p++] = (buffer >> 16) & 0xFF;
    if (p < bufferLength) bytes[p++] = (buffer >> 8) & 0xFF;
    if (p < bufferLength) bytes[p++] = buffer & 0xFF;
  }

  return bytes;
}

async function fillFrameWithImage(frame: FrameNode, base64ImageData: string) {
  try {
    // Step 1: Convert base64 to Uint8Array
    const uint8Array = base64ToUint8Array(base64ImageData);

    // Step 2: Create an image in Figma using the Uint8Array
    const image = figma.createImage(uint8Array);

    // Step 3: Apply the image fill to the frame
    frame.fills = [{
      type: 'IMAGE',
      imageHash: image.hash, // Apply the image hash
      scaleMode: 'FILL' // Set how the image should fill the frame
    }];

    console.log('Image applied to frame successfully!');
  } catch (error) {
    console.error('Error applying image to frame:', error);
  }
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

    qr.name = "QR Code"

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

export { loadFonts, createTextElement, fillFrameWithImage, generateFrame, appendQRToFrame };
