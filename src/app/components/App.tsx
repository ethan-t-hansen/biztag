import React from 'react';
import logo from '../assets/logo.svg';
import checkmark from '../assets/checkmark-green.svg';
import xicon from '../assets/x-red.svg';
import '../styles/ui.css';
import Papa from 'papaparse';
import { useState } from 'react';
// import { PuffLoader } from 'react-spinners';

function App() {
  const [jsonError, setJsonError] = useState('');
  const [imageError, setImageError] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [imgData, setImageData] = useState(null);
  const [dataFileName, setFileName] = useState(null);
  const [imageFileName, setImageName] = useState(null);
  // const [processing, setProcessing] = useState(false);

  // Handle file input change
  const handleDataFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file

    if (!file) {
      setJsonError('Please upload a data file');
      return;
    }

    if (file.size > 5242880) {
      setJsonError('File size is too large (max 1MB)');
      return;
    }

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
      setImageError('Please select an image file');
      console.log(imageError);
      return;
    }

    if (file.size > 5242880) {
      setImageError('File size is too large (max 5MB)');
      console.log(imageError);
      return;
    }

    // Check if the file is either .png or .jpg
    const validTypes = ['image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      setImageError('Only .png or .jpg files are allowed');
      console.log(imageError);
      return;
    }

    setImageError('');
    setImageName(file.name);

    // Read the file as a data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target.result;

      setImageData(imageDataUrl);
    };

    reader.readAsDataURL(file); // Read the file as a data URL
  };

  // useRef to track width and height
  const widthbox = React.useRef<HTMLInputElement>(undefined);
  const heightbox = React.useRef<HTMLInputElement>(undefined);

  const widthRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '';
    widthbox.current = element;
  }, []);

  const heightRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '';
    heightbox.current = element;
  }, []);

  const onCreate = () => {
    if (!imgData || !jsonData) {
      if (!imgData) {
        setImageError('Please select an image file');
      }
      if (!jsonData) {
        setJsonError('Please upload a data file');
      }
      return;
    }

    const width = widthbox.current.value ? parseInt(widthbox.current.value, 10) : 620;
    const height = heightbox.current.value ? parseInt(heightbox.current.value, 10) : 830;

    parent.postMessage(
      { pluginMessage: { type: 'create-nametags', image: imgData, json: jsonData, width: width, height: height } },
      '*'
    );

    // setProcessing(true);
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
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

      <div className="form">
        <p>Image Background</p>
        <div className="file-wrap">
          <label className="custom-file-upload">
            Upload Image (.png or .jpeg)
            <input id="jsonfile" type="file" accept=".png,.jpg,.jpeg" onChange={handleImageFileChange} />
          </label>
          <div className="file-name">
            {imageFileName ? (
              <div className="file-success">
                {' '}
                <img src={checkmark} width="14" height="auto" alt="check" /> {imageFileName}{' '}
              </div>
            ) : imageError ? (
              <div className="file-error">
                {' '}
                <img src={xicon} width="14" height="auto" alt="check" /> {imageError}{' '}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>

        <p>Partner Data</p>
        <div className="file-wrap">
          <label className="custom-file-upload">
            Upload File (.csv or .json)
            <input id="jsonfile" type="file" accept=".json,.csv" onChange={handleDataFileChange} />
          </label>
          <div className="file-name">
            {dataFileName ? (
              <div className="file-success">
                {' '}
                <img src={checkmark} width="14" height="auto" alt="check" /> {dataFileName}{' '}
              </div>
            ) : jsonError ? (
              <div className="file-error">
                {' '}
                <img src={xicon} width="14" height="auto" alt="check" /> {jsonError}{' '}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>

        <p>Width (px)</p>
        <input id="width" ref={widthRef} className="input-field" placeholder="620" />

        <p>Height (px)</p>
        <input id="height" ref={heightRef} className="input-field" placeholder="830" />

        <div className="button-group">
          <button id="create" className="btn primary" onClick={onCreate}>
            Create
          </button>
          <button className="btn secondary" onClick={onCancel}>
            Close
          </button>
        </div>

        {/* {processing ? (
          <p> <PuffLoader color='#ffffff' /> Generating tags... </p>
        ) : (
          <div className="button-group">
            <button id="create" className="btn primary" onClick={onCreate}>
              Create
            </button>
            <button className="btn secondary" onClick={onCancel}>
             Close
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default App;
