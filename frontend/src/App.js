import React, { useState } from 'react';
import {
  Button, Container, Row, Col, Tabs, Tab, InputGroup,
  Form, FloatingLabel, Spinner, Image, Card
} from 'react-bootstrap';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import axios from 'axios';

import Home from './pages/Home/Home';
import ChatForm from './pages/ChatForm/ChatForm';
import ResponseDisplay from './pages/ResponseDisplay/ResponseDisplay';

const SERVER_URL = 'http://127.0.0.1:5000';
// const SERVER_URL = 'https://rbs-ai.degiorgi.de';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [working, setWorking] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // const [assistantType, setAssistantType] = useState('friendly');

  // Function to handle chat request with streaming
  const handleChatSubmit = (e, assistantType) => {
    e.preventDefault();
    setWorking(true);
    // console.log("setting working to true");
    setResponse('');  // Clear previous response

    // Open an EventSource for streaming the response
    // const eventSource = new EventSource(`${SERVER_URL}/chat?prompt=${encodeURIComponent(prompt)}`);
    // const eventSource = new EventSource(`${SERVER_URL}/api/chat?prompt=${encodeURIComponent(prompt)}&assistant_type=${encodeURIComponent(assistantType)}`);
    const eventSource = new EventSource(
      `${SERVER_URL}/api/chat?prompt=${encodeURIComponent(prompt)}&assistant_type=${encodeURIComponent(assistantType)}&password=${encodeURIComponent(password)}`
    );

    eventSource.onmessage = (event) => {
      if (event.data === "Unauthorized") {
        alert("Unauthorized access: Please check your password.");
        eventSource.close();
        setWorking(false);
      } else {
        setResponse((prevResponse) => prevResponse + event.data);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Error in streaming response:", err);
      eventSource.close();
      setWorking(false);
      if (err.status === 401) {
        alert("Unauthorized access: Please check your password.");
      }
    };

  };

  // Function to handle image generation request (unchanged)
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setWorking(true);
    // console.log("setting working to true");

    try {
      // const res = await axios.post(`${SERVER_URL}/api/image`, { prompt });
      const res = await axios.post(`${SERVER_URL}/api/image`, {
        prompt,
        password
      });

      setImageURL(res.data.image_url);
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        alert("Unauthorized access: Please check your password.");
      }
    }
    setWorking(false);
  };

  return (

    <Container className="mt-3">
      {/* <Row className="justify-content-md-center">
        <Col md="auto">

          <h1>RBS-AI Testing Bed</h1>
        </Col>
      </Row> */}

      <Row className="align-items-center justify-content-between">
        <Col md="auto">
          <h1>RBS-AI Testing Bed</h1>
        </Col>
        <Col md="auto">
          <InputGroup>
            <FloatingLabel
              controlId="floatingPasswordInput"
              label="Enter Password"
              className="flex-grow-1"
            >
              <Form.Control
                type={showPassword ? "text" : "password"} // Toggle type
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FloatingLabel>
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)} // Toggle visibility
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </Button>
          </InputGroup>
        </Col>
        <Col md="auto" className="text-end">
          <Image
            src={`${process.env.PUBLIC_URL}/rbs.png`}
            alt="Rolf-Benz-Schule Logo"
            className="mb-1"
            fluid
          // style={{ maxWidth: '120px' }}
          />
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
            <Col xs={12}>
              <Home />
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="generalchat" title="General Chat">
          <Row className="justify-content-md-center">
            <Col xs={12}>

              <ChatForm
                SystemMessage="friendly"
                handleSubmit={handleChatSubmit}
                prompt={prompt}
                setPrompt={setPrompt}
                flLabel={"Enter any prompt for Chat. This is an 'openBot' assistant."}
                working={working}
              />
              <ResponseDisplay response={response} />
              {/* {response && <div><h3>Assistant's Response (Streaming):</h3><p>{response}</p></div>} */}
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="a_vierfelder" title="A: Vierfeldertafel">
          <Row className="justify-content-md-center">
            <Col xs={12}>
              <ChatForm
                SystemMessage="a_vierfelder"
                handleSubmit={handleChatSubmit}
                prompt={prompt}
                setPrompt={setPrompt}
                flLabel={"Enter any prompt that has to do with stochastics or the four-field table."}
                working={working}
              />
              {/* <form onSubmit={(e) => handleChatSubmit(e, "a_vierfelder")}>
                <label>Enter your prompt for Chat:</label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="submit">Send</button>
              </form> */}
              {/* {response && <div><h3>Assistant's Response (Streaming):</h3><p>{response}</p></div>} */}
              <ResponseDisplay response={response} />

            </Col>
          </Row>
        </Tab>
        <Tab eventKey="a_trommelbremse" title="A: Trommelbremse">
          <Row className="justify-content-md-center">
            <Col xs={12}>
              <ChatForm
                SystemMessage="a_trommelbremse"
                handleSubmit={handleChatSubmit}
                prompt={prompt}
                setPrompt={setPrompt}
                flLabel={"Enter any prompt that has to do with braking technology or the drum brake."}
                working={working}
              />
              {/* {response && <div><h3>Assistant's Response (Streaming):</h3><p>{response}</p></div>} */}
              <ResponseDisplay response={response} />

            </Col>
          </Row>
        </Tab>
        <Tab eventKey="a_verschluesselung" title="A: Verschlüsselung">
          <Row className="justify-content-md-center">
            <Col xs={12}>
              <ChatForm
                SystemMessage="a_verschluesselung"
                handleSubmit={handleChatSubmit}
                prompt={prompt}
                setPrompt={setPrompt}
                flLabel={"Enter any prompt that has to do with encryption and encryption methods."}
                working={working}
              />
              {/* {response && <div><h3>Assistant's Response (Streaming):</h3><p>{response}</p></div>} */}
              <ResponseDisplay response={response} />

            </Col>
          </Row>
        </Tab>
        <Tab eventKey="imagecreation" title="Image Creation">
          <Row className="justify-content-md-center">
            <Col xs={12}>
              <Form onSubmit={handleImageSubmit}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Enter a prompt for Image Generation (like: Make an image of a cat playing guitar with a unicorn)"
                  className="mb-3"
                >
                  <Form.Control
                    as="textarea"
                    type="text"
                    placeholder="Make a song about unicorns..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{ height: '150px' }}
                    disabled={working}
                  />
                </FloatingLabel>
                {/* <Button type="submit" variant="primary">Generate Image</Button> */}
                <Button
                  type="submit"
                  variant={working ? "secondary" : "primary"}  // Change color when working
                  disabled={working}  // Disable button when working
                >
                  {working ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      Working ... Please stand by ...
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </Form>


              {imageURL && <Card className="my-3">
                <Card.Header as="h3">Generated Image</Card.Header>
                <Card.Body>
                  <Card.Text><img src={imageURL} alt="Generated" /></Card.Text>
                </Card.Body>
              </Card>}

              {/* {imageURL && <div><h3>Generated Image:</h3><img src={imageURL} alt="Generated" /></div>} */}
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
