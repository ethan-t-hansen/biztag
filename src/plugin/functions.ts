const loadFonts = async () => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
};

const createTextElement = (content: string) => {
    const text = figma.createText();
    text.characters = content;
    text.fontName = {
        family: 'Inter',
        style: 'Bold',
    };
    text.fills = [{
      type: 'SOLID',
      color: { r: 1, g: 1, b: 1 },
    }]
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


export { loadFonts, createTextElement, fillFrameWithImageFromURL}
