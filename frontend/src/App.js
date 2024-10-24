import React, { useState } from 'react';
import { Button, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';

import Home from './pages/Home/Home';

const SERVER_URL = 'http://127.0.0.1:5000';  // Update this if needed!

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [imageURL, setImageURL] = useState('');

  // const [assistantType, setAssistantType] = useState('friendly');

  // Function to handle chat request with streaming
  const handleChatSubmit = (e, assistantType) => {
    e.preventDefault();
    setResponse('');  // Clear previous response

    // Open an EventSource for streaming the response
    // const eventSource = new EventSource(`${SERVER_URL}/chat?prompt=${encodeURIComponent(prompt)}`);
    const eventSource = new EventSource(`${SERVER_URL}/chat?prompt=${encodeURIComponent(prompt)}&assistant_type=${encodeURIComponent(assistantType)}`);

    // Listen for each chunk of streamed data
    eventSource.onmessage = (event) => {
      setResponse((prevResponse) => prevResponse + event.data);  // Append streamed data to the response
    };

    eventSource.onerror = (err) => {
      console.error("Error in streaming response:", err);
      eventSource.close();  // Close the event stream on error
    };
  };

  // Function to handle image generation request (unchanged)
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${SERVER_URL}/image`, { prompt });
      setImageURL(res.data.image_url);
    } catch (err) {
      console.error(err);
    }
  };

  return (

    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h1>RBS-AI Testing Bed</h1>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="home"
        id="fill-tab-example"
        className="mb-3"

        fill
      >
        <Tab eventKey="home" title="Home">

          <Row className="justify-content-md-center">
            <Col md="auto">
              <Home/>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="generalchat" title="General Chat">
          <Row className="justify-content-md-center">
            <Col md="auto">
              <form onSubmit={(e) => handleChatSubmit(e, "friendly")}>
                <label>Enter your prompt for Chat:</label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
              {response && <div><h3>Assistant's Response (Streaming):</h3><p>{response}</p></div>}
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="a_vierfelder" title="A: Vierfeldertafel">
          <Row className="justify-content-md-center">
            <Col md="auto">
              <form onSubmit={(e) => handleChatSubmit(e, "a_vierfelder")}>
                <label>Enter your prompt for Chat:</label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
              {response && <div><h3>Assistant's Response (Streaming):</h3><p>{response}</p></div>}
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="a_trommelbremse" title="A: Trommelbremse">
          <Row className="justify-content-md-center">
            <Col md="auto">
              <form onSubmit={(e) => handleChatSubmit(e, "a_trommelbremse")}>
                <label>Enter your prompt for Chat:</label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
              {response && <div><h3>Assistant's Response (Streaming):</h3><p>{response}</p></div>}
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="a_verschluesselung" title="A: Verschlüsselung">
          <Row className="justify-content-md-center">
            <Col md="auto">
              <form onSubmit={(e) => handleChatSubmit(e, "a_verschluesselung")}>
                <label>Enter your prompt for Chat:</label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
              {response && <div><h3>Assistant's Response (Streaming):</h3><p>{response}</p></div>}
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="imagecreation" title="Image Creation">
          <Row className="justify-content-md-center">
            <Col md="auto">
              <form onSubmit={handleImageSubmit}>
                <label>Enter your prompt for Image Generation:</label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="submit">Generate Image</button>
              </form>
              {imageURL && <div><h3>Generated Image:</h3><img src={imageURL} alt="Generated" /></div>}
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
