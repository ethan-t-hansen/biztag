import React from 'react';
import logo from '../assets/logo.svg';
import '../styles/ui.css';

function App() {

  const widthbox = React.useRef<HTMLInputElement>(undefined);
  const heightbox = React.useRef<HTMLInputElement>(undefined);

  const widthRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '620';
    widthbox.current = element;
  }, []);

  const heightRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '830';
    heightbox.current = element;
  }, []);

  const onCreate = () => {
    const width = parseInt(widthbox.current.value, 10);
    const height = parseInt(heightbox.current.value, 10);

    parent.postMessage({ pluginMessage: { type: 'create-nametags', width, height } }, '*');
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
  <h2 className="title">BizTag</h2>
  <h4 className="subtitle">by ethanth</h4>

  <p>
    Width: <input id="width" ref={widthRef} className="input-field" />
  </p>

  <p>
    Height: <input id="height" ref={heightRef} className="input-field" />
  </p>

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
