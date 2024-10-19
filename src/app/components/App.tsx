import React from 'react';
import logo from '../assets/logo.svg';
import checkmark from '../assets/checkmark.svg';
import '../styles/ui.css';
import Papa from 'papaparse';
import { useState } from 'react';

function App() {

  const [error, setError] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [imgData, setImageData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [imgName, setImageName] = useState(null);

  // // Handle file input change
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0]; // Get the first file
  //   if (file && file.type === "application/json") { // Ensure it's a .json file
  //     setFileName(file.name);
  //     const reader = new FileReader();

  //     // Read the file's content as text
  //     reader.onload = (e) => {
  //       const result = e.target?.result;

  //       // Type guard to ensure result is a string
  //       if (typeof result === "string") {
  //         try {
  //           const json = JSON.parse(result); // Parse JSON data
  //           setJsonData(json); // Save JSON data to state
  //         } catch (error) {
  //           console.error("Error parsing JSON", error);
  //         }
  //       }
  //     };

  //     reader.readAsText(file); // Read the file as text
  //   } else {
  //     console.error("Please upload a valid .json file");
  //   }
  // };

  // Handle file input change
const handleDataFileChange = (event) => {
  const file = event.target.files[0]; // Get the first file
  if (!file) return;

  const fileType = file.type;
  const validTypes = ['application/json', 'text/csv'];

  if (validTypes.includes(fileType)) {
    setFileName(file.name);
    const reader = new FileReader();

    // Read the file's content as text
    reader.onload = (e) => {
      const result = e.target?.result;

      // Type guard to ensure result is a string
      if (typeof result === 'string') {
        if (fileType === 'application/json') {
          // Handle JSON file
          try {
            const json = JSON.parse(result); // Parse JSON data
            setJsonData(json); // Save JSON data to state
          } catch (error) {
            console.error('Error parsing JSON', error);
          }
        } else if (fileType === 'text/csv') {
          // Handle CSV file using PapaParse
          Papa.parse(result, {
            header: true, // Assumes the first row is the header
            complete: (parsedResult) => {
              setJsonData(parsedResult.data); // Save CSV data (as JSON) to state
            },
            error: (error) => {
              console.error('Error parsing CSV', error);
            },
          });
        }
      }
    };

    reader.readAsText(file); // Read the file as text
  } else {
    console.error('Please upload a valid .json or .csv file');
  }
};

const handleImageFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) {
    setError('Please select an image file');
    console.log(error);
    return;
  }

  // Check if the file is either .png or .jpg
  const validTypes = ['image/png', 'image/jpeg'];
  if (!validTypes.includes(file.type)) {
    setError('Only .png or .jpg files are allowed');
    console.log(error);
    return;
  }

  setError('');
  setImageName(file.name);

  // Read the file as a data URL
  const reader = new FileReader();
  reader.onload = async (e) => {
    const imageDataUrl = e.target.result;

    setImageData(imageDataUrl);
  };

  reader.readAsDataURL(file); // Read the file as a data URL
};

  // const imgbox = React.useRef<HTMLInputElement>(undefined);
  const widthbox = React.useRef<HTMLInputElement>(undefined);
  const heightbox = React.useRef<HTMLInputElement>(undefined);

  // const imgRef = React.useCallback((element: HTMLInputElement) => {
  //   if (element) element.value = '';
  //   imgbox.current = element;
  // }, []);

  const widthRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '';
    widthbox.current = element;
  }, []);

  const heightRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '';
    heightbox.current = element;
  }, []);

  const onCreate = () => {

    // const imgurl = imgbox.current.value;
    const width = parseInt(widthbox.current.value, 10);
    const height = parseInt(heightbox.current.value, 10);

    parent.postMessage({ pluginMessage: { type: 'create-nametags', image: imgData, json: jsonData, width: width, height: height} }, '*');
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    // figma.ui.resize(600, 200)
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-nametags') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (
    <div className="container">
      <img src={logo} className="logo" alt="Logo" />
      <h2 className="title">BizTag - Name Tag Generator</h2>
      <h3 className="subtitle">By @ethan-t-hansen</h3>

      {/* <p>
        Background Image URL 
      </p>
      <input id="imgurl" ref={imgRef} className="input-field" placeholder="example.com"/> */}

      <p>
        Image Background
      </p>
      <div className='file-wrap'>
        <label className="custom-file-upload">
          Upload Image (.png or .jpeg)
          <input id="jsonfile" type="file" accept=".png,.jpg,.jpeg" onChange={handleImageFileChange} required/>
        </label>
        <div className='file-name'>
          {imgName ? <div> {imgName} <img src={checkmark} width="14" height="auto" alt="check" /> </div> : ''}
        </div>
      </div>

      <p>
        Partner Data
      </p>
      <div className='file-wrap'>
        <label className="custom-file-upload">
          Upload File (.csv or .json)
          <input id="jsonfile" type="file" accept=".json,.csv" onChange={handleDataFileChange} required/>
        </label>
        <div className='file-name'>
          {fileName ? <div> {fileName} <img src={checkmark} width="14" height="auto" alt="check" /> </div> : ''}
        </div>
      </div>

      <p>
        Width (px)
      </p>
      <input id="width" ref={widthRef} className="input-field" required placeholder="620"/>

      <p>
        Height (px)
      </p>
      <input id="height" ref={heightRef} className="input-field" required placeholder="830"/>

      <div className="button-group">
        <button id="create" className="btn primary" onClick={onCreate}>
          Create
        </button>
        <button className="btn secondary" onClick={onCancel}>
          Close
        </button>
      </div>
    </div>
  );
}

export default App;
