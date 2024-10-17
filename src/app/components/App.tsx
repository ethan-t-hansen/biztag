import React from 'react';
import logo from '../assets/logo.svg';
import checkmark from '../assets/checkmark.svg';
import '../styles/ui.css';
import { useState } from 'react';

function App() {

  const [jsonData, setJsonData] = useState(null);
  const [fileName, setFileName] = useState(null)

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file && file.type === "application/json") { // Ensure it's a .json file
      setFileName(file.name);
      const reader = new FileReader();

      // Read the file's content as text
      reader.onload = (e) => {
        const result = e.target?.result;

        // Type guard to ensure result is a string
        if (typeof result === "string") {
          try {
            const json = JSON.parse(result); // Parse JSON data
            setJsonData(json); // Save JSON data to state
          } catch (error) {
            console.error("Error parsing JSON", error);
          }
        }
      };

      reader.readAsText(file); // Read the file as text
    } else {
      console.error("Please upload a valid .json file");
    }
  };

  const imgbox = React.useRef<HTMLInputElement>(undefined);
  const widthbox = React.useRef<HTMLInputElement>(undefined);
  const heightbox = React.useRef<HTMLInputElement>(undefined);

  const imgRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '';
    imgbox.current = element;
  }, []);

  const widthRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '';
    widthbox.current = element;
  }, []);

  const heightRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '';
    heightbox.current = element;
  }, []);

  const onCreate = () => {

    const imgurl = imgbox.current.value;
    const width = parseInt(widthbox.current.value, 10);
    const height = parseInt(heightbox.current.value, 10);
    const data = jsonData;

    parent.postMessage({ pluginMessage: { type: 'create-nametags', imgurl, data, width, height } }, '*');
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
      <h2 className="title">Name Tag Generator</h2>
      <h3 className="subtitle">By @ethan-t-hansen</h3>

      <p>
        Background Image URL 
      </p>
      <input id="imgurl" ref={imgRef} className="input-field" placeholder="example.com"/>

      <p>
        Partner Data
      </p>
      <div className='file-wrap'>
        <label className="custom-file-upload">
          Upload File (.json)
          <input id="jsonfile" type="file" accept=".json" onChange={handleFileChange} required/>
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
