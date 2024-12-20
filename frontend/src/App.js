import React, { useState } from 'react';
import {
  Button, Container, Row, Col, Tabs, Tab, InputGroup,
  Form, FloatingLabel, Spinner, Image, Card
} from 'react-bootstrap';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Home from './pages/Home/Home';
import ChatForm from './pages/ChatForm/ChatForm';
import ResponseDisplay from './pages/ResponseDisplay/ResponseDisplay';
import AssistantsPage from './pages/AssistantsPage/AssistantsPage';
import AssistantsReloadPage from './pages/AssistantsReloadPage/AssistantsReloadPage';
import TranslationChatForm from './pages/TranslationChatForm/TranslationChatForm';
import { SERVER_URL } from './Consts';

const packageJson = require('../package.json');

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [working, setWorking] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [translationResult, setTranslationResult] = useState(null); 

  const reloadAssistants = async () => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/assistants/reload`, {
        password
      });

      if (res.status === 200) {
        alert("Assistants reloaded successfully.");
        setRefresh(prev => !prev);
      }

    } catch (err) {
      if (err.status === 401) {
        alert("Unauthorized access: Please check your password.");
      }
    }
  }

  const handleAssistantSubmit = async (e, assistantId) => {
    e.preventDefault();
    setWorking(true);
    setResponse('');

    try {
      await axios.get(`${SERVER_URL}/api/assistants/${assistantId}/interact`, {
        params: { prompt, password }
      });
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 415)) {
        alert("Unauthorized access: Please check your password.");
        setWorking(false);
        return;
      }
    }

    const eventSource = new EventSource(
      `${SERVER_URL}/api/assistants/${assistantId}/interact?prompt=${encodeURIComponent(prompt)}&password=${encodeURIComponent(password)}`
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

  const handleChatSubmit = async (e, assistantType) => {
    e.preventDefault();
    setWorking(true);
    setResponse('');

    try {
      await axios.get(`${SERVER_URL}/api/chat`, {
        params: { prompt, assistant_type: assistantType, password }
      });
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 415)) {
        alert("Unauthorized access: Please check your password.");
        setWorking(false);
        return;
      }
    }

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

  const handleTranslateSubmit = async (e, srcL, tarL) => {
    e.preventDefault();
    setWorking(true);
    try {
      const res = await axios.post(`${SERVER_URL}/api/translate`, {
        prompt,
        srcL, 
        tarL,
        password
      });

      setTranslationResult(res.data.translated_text);
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        alert("Unauthorized access: Please check your password.");
      }
    }
    setWorking(false);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setWorking(true);
    try {
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
    <>
      <Container className="mt-3">
        <Row className="align-items-center justify-content-between">
          <Col md="auto">
            <h1>
              RBS-AI Testing Bed
            </h1>
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
                onClick={() => setShowPassword(!showPassword)}
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
            />
          </Col>
        </Row>
        <hr />
        <Router>
          <Routes>
            <Route path="/" element={
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
                    </Col>
                  </Row>
                </Tab>
                {/* <Tab eventKey="a_vierfelder" title="A: Vierfeldertafel">
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
                      <ResponseDisplay response={response} />
                    </Col>
                  </Row>
                </Tab> */}
                {/* <Tab eventKey="a_trommelbremse" title="A: Trommelbremse">
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
                      <ResponseDisplay response={response} />
                    </Col>
                  </Row>
                </Tab> */}
                {/* <Tab eventKey="a_verschluesselung" title="A: Verschlüsselung">
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
                      <ResponseDisplay response={response} />
                    </Col>
                  </Row>
                </Tab> */}
                <Tab eventKey="assistants" title="Assistants">
                  <Row className="justify-content-md-center">
                    <Col xs={12}>
                      <AssistantsPage
                        reloadAssistants={reloadAssistants}
                        refresh={refresh}
                      />
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="translation" title="Translation">
                  <Row className="justify-content-md-center">
                    <Col xs={12}>
                      <TranslationChatForm
                        handleTranslateSubmit={handleTranslateSubmit}
                        working={working}
                        setPrompt={setPrompt}
                        flLabel={"Enter any text for Translation."}
                        prompt={prompt}
                        translatedText={translationResult}
                      />
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
                            placeholder="Make an image about unicorns..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            style={{ height: '150px' }}
                            disabled={working}
                          />
                        </FloatingLabel>
                        <Button
                          type="submit"
                          variant={working ? "secondary" : "primary"}
                          disabled={working}
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
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            } />
            <Route path="/assistants" element={<AssistantsPage
              reloadAssistants={reloadAssistants}
              refresh={refresh}
            />} />
            <Route path="/assistants/reload" element={<AssistantsReloadPage
              reloadAssistants={reloadAssistants}
            />} />
            <Route path="/assistants/:assistantId"
              element={<AssistantsPage
                handleAssistantSubmit={handleAssistantSubmit}
                prompt={prompt}
                setPrompt={setPrompt}
                working={working}
                response={response}
              />} />
          </Routes>
        </Router>

        <div
          className="position-fixed bottom-0 end-0 m-2 px-2 bg-dark text-white opacity-75 rounded"
          style={{ fontSize: '12px', width: 'auto', textAlign: 'right' }}
        >
          Version: {packageJson.version}
        </div>
      </Container>
    </>
  );
}

export default App;
