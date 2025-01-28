import React, { useState, useEffect } from 'react';
import {
  Button, Container, Row, Col, Tabs, Tab, InputGroup,
  Form, FloatingLabel, Spinner, Image, Card,
  OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import ChatForm from './pages/ChatForm/ChatForm';
import ResponseDisplay from './pages/ResponseDisplay/ResponseDisplay';
import AssistantsLab from './pages/AssistantsLab/AssistantsLab';
import AssistantsPage from './pages/AssistantsPage/AssistantsPage';
import AssistantsReloadPage from './pages/AssistantsReloadPage/AssistantsReloadPage';
import TranslationChatForm from './pages/TranslationChatForm/TranslationChatForm';
import ImageCreation from './pages/ImageCreation/ImageCreation';

import {
  SERVER_URL, default_tooltip_show, default_tooltip_hide,
  label_enter_password, label_show_hide_password,
  label_general_chat, label_send_image_generation,
  label_send_prompt_working,
  tooltip_version, tooltip_send_image_generation,
  system_message_unauthorized, system_missing_data,
  system_missing_dl_image, system_message_error,
  interaction_type_chat,
  headline_main
} from './Consts';

import 'katex/dist/katex.min.css';

const packageJson = require('../package.json');

const sessionUserId = crypto.randomUUID();

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [working, setWorking] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    if (isComplete) {
      console.log("Response streaming completed!");
      // console.log(response)
      // setResponse("aetsch")
    }
  }, [isComplete]);

  useEffect(() => {
    let timer;
    if (working) {
      console.log("Timer started.");
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(timer);
  }, [working]);


  const handleFetchInteractions = async (assistantId = interaction_type_chat) => {
    let fetch_interaction_type = assistantId;

    if (assistantId === "lab") {
      fetch_interaction_type = "assistants_lab-" + sessionUserId;
    }

    console.log("Fetching interactions for:", fetch_interaction_type);

    try {
      const response = await axios.get(`${SERVER_URL}/api/interactions`, {
        params: {
          user_id: sessionUserId,
          interaction_type: fetch_interaction_type,
        },
      });

      console.log("Fetched interactions:", response.data);
      setInteractions(response.data);
    } catch (err) {
      if (err.response) {
        console.error("Error fetching interactions:", err.response);
      } else {
        console.error("Error fetching interactions:", err.message);
      }
    }
  };

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
        alert(system_message_unauthorized);
      }
    }
  }

  const handleAssistantSubmit = async (e, assistantId) => {
    e.preventDefault();

    setWorking(true);
    setResponse('');
    setIsComplete(false);

    try {
      await axios.get(`${SERVER_URL}/api/assistants/${assistantId}/interact`, {
        params: { prompt, password },
        headers: {
          "X-User-ID": sessionUserId,
        },
      });
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 415)) {
        alert(system_message_unauthorized);
        setWorking(false);
        setIsComplete(true);
        return;
      }
    }

    const eventSource = new EventSource(
      `${SERVER_URL}/api/assistants/${assistantId}/interact?prompt=${encodeURIComponent(
        prompt
      )}&password=${encodeURIComponent(password)}&user_id=${encodeURIComponent(sessionUserId)}&stream=true`
    );

    eventSource.onmessage = (event) => {
      // analyzeCharacterTypes(event.data);
      // console.log("Received chunk:", JSON.stringify(event.data));
      if (event.data === "Unauthorized") {
        alert(system_message_unauthorized);
        eventSource.close();
        setWorking(false);
        setIsComplete(true);
      }
      else if (event.data === "[DONE]") {
        eventSource.close();
        setWorking(false);
        setIsComplete(true);
      }
      else {
        const formattedChunk = event.data.replace(/\[NEWLINE\]/g, '\n');
        setResponse((prevResponse) => prevResponse + formattedChunk);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Error in streaming response:", err);
      eventSource.close();
      setWorking(false);
      setIsComplete(true);
      if (err.status === 401) {
        alert(system_message_unauthorized);
      }
    };
  };

  const analyzeCharacterTypes = (data) => {
    if (!data) {
      console.log("No data to analyze.");
      return;
    }

    console.log(`Analyzing data: "${data}"`);

    data.split('').forEach((char, index) => {
      let charType;

      if (char === '\n') {
        charType = 'Line Feed (\\n)';
      } else if (char === '\t') {
        charType = 'Tab (\\t)';
      } else if (/\d/.test(char)) {
        charType = 'Digit';
      } else if (/[a-zA-Z]/.test(char)) {
        charType = 'Character';
      } else if (/\s/.test(char)) {
        charType = 'Whitespace';
      } else {
        charType = 'Symbol';
      }

      // Get the numeric value (ASCII or Unicode)
      const charCode = char.charCodeAt(0);

      console.log(`Index: ${index}, Char: "${char}", Numeric Value: ${charCode}, Type: ${charType}`);
    });
  };

  const handleChatSubmit = async (e, assistantType) => {
    e.preventDefault();

    setWorking(true);
    setResponse('');
    setIsComplete(false);

    try {
      await axios.get(`${SERVER_URL}/api/chat`, {
        params: { prompt, assistant_type: assistantType, password }, headers: {
          "X-User-ID": sessionUserId,
        },
      });
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 415)) {
        alert(system_message_unauthorized);
        setWorking(false);
        setIsComplete(true);
        return;
      }
    }

    // const eventSource = new EventSource(
    //   `${SERVER_URL}/api/chat?prompt=${encodeURIComponent(prompt)}&assistant_type=${encodeURIComponent(assistantType)}&password=${encodeURIComponent(password)}&stream=true`
    // );

    const eventSource = new EventSource(
      `${SERVER_URL}/api/chat?prompt=${encodeURIComponent(prompt)}&password=${encodeURIComponent(password)}&user_id=${encodeURIComponent(sessionUserId)}&stream=true`
    );

    eventSource.onmessage = (event) => {
      if (event.data === "Unauthorized") {
        alert(system_message_unauthorized);
        eventSource.close();
        setWorking(false);
        setIsComplete(true);
      }
      else if (event.data === "[DONE]") {
        eventSource.close();
        setWorking(false);
        setIsComplete(true);
      }
      else {
        const formattedChunk = event.data.replace(/\[NEWLINE\]/g, '\n');
        setResponse((prevResponse) => prevResponse + formattedChunk);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Error in streaming response:", err);
      eventSource.close();
      setWorking(false);
      setIsComplete(true);
      if (err.status === 401) {
        alert(system_message_unauthorized);
      }
    };

  };

  const handleAssistantsLabSubmit = async (e, systemMessage, assistantPrompt) => {
    const assistantType = "assistants_lab";

    e.preventDefault();

    setWorking(true);
    setResponse('');
    setIsComplete(false);

    try {
      await axios.get(`${SERVER_URL}/api/assistants_lab`, {
        params: {
          system_message: systemMessage,
          assistant_prompt: assistantPrompt,
          assistant_type: assistantType,
          password: password
        },
        headers: {
          "X-User-ID": sessionUserId,
        },
      });
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 415)) {
        alert(system_message_unauthorized);
        setWorking(false);
        setIsComplete(true);
        return;
      }
    }

    const eventSource = new EventSource(
      `${SERVER_URL}/api/assistants_lab?system_message=${encodeURIComponent(systemMessage)}&assistant_prompt=${encodeURIComponent(assistantPrompt)}&assistant_type=${encodeURIComponent(assistantType)}&password=${encodeURIComponent(password)}&user_id=${encodeURIComponent(sessionUserId)}&stream=true`
    );

    eventSource.onmessage = (event) => {
      if (event.data === "Unauthorized") {
        alert(system_message_unauthorized);
        eventSource.close();
        setWorking(false);
        setIsComplete(true);
      }
      else if (event.data === "[DONE]") {
        eventSource.close();
        setWorking(false);
        setIsComplete(true);
      }
      else {
        const formattedChunk = event.data.replace(/\[NEWLINE\]/g, '\n');
        setResponse((prevResponse) => prevResponse + formattedChunk);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Error in streaming response:", err);
      eventSource.close();
      setWorking(false);
      setIsComplete(true);
      if (err.status === 401) {
        alert(system_message_unauthorized);
      }
    };
  };

  const handleTranslateSubmit = async (e, srcL, tarL) => {
    e.preventDefault();
    setWorking(true);

    try {
      const res = await axios.post(`${SERVER_URL}/api/translate`,
        { prompt, srcL, tarL, password },
        {
          headers: {
            "X-User-ID": sessionUserId,
          },
        }
      );

      setTranslationResult(res.data);
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        alert(system_message_unauthorized);
      }
      else {
        alert(system_message_error); // XXX: This should be more specific
      }
    }
    setWorking(false);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setWorking(true);

    try {
      const res = await axios.post(`${SERVER_URL}/api/image`,
        { prompt, password },
        {
          headers: {
            "X-User-ID": sessionUserId,
          },
          // params: { // Query parameters in the URL
          //   someQueryParam: "value",
          // },
        }
      );

      setImageURL(res.data.image_url);
    } catch (err) {
      if (err.status === 401) {
        alert(system_message_unauthorized);
      }
      else if (err.status === 400) {
        alert(system_missing_data);
      }
      else if (err.status === 500) {
        alert(system_missing_dl_image);
      }
    }
    setWorking(false);
  };

  return (
    <>
      <Container className="mt-3">
        <Row className="align-items-center justify-content-between">
          <Col md="auto">
            <h2>{headline_main}</h2>
          </Col>
          <Col md="auto">
            <InputGroup>
              <FloatingLabel
                controlId="floatingPasswordInput"
                label="Enter Password"
                className="flex-grow-1"
              >
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                  overlay={<Tooltip className="custom-tooltipper">{label_enter_password}</Tooltip>}
                ><Form.Control
                    type={showPassword ? "text" : "password"} // Toggle type
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </OverlayTrigger>
              </FloatingLabel>
              <OverlayTrigger
                placement="bottom-end"
                delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                overlay={<Tooltip className="custom-tooltipper">{label_show_hide_password}</Tooltip>}
              ><Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </Button>
              </OverlayTrigger>
            </InputGroup>
          </Col>
          <Col md="auto" className="text-end">
            <Image
              src={`${process.env.PUBLIC_URL}/rbs.png`}
              alt="Rolf-Benz-Schule Logo"
              className="mb-1 img-rbs-logo"
              fluid
            />
          </Col>
        </Row>
        <hr />

        <Router>
          <Routes>
            {/* <Route path="/" element={
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
                        flLabel={label_general_chat}
                        working={working}
                        interactions={interactions}
                        handleCallBackFetchInteractions={handleFetchInteractions}
                        response={response}
                        string_headline="Chat Response"
                      />
                    </Col>
                  </Row>
                </Tab>

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

                <Tab eventKey="assistants-lab" title="Assistants-Lab">
                  <Row className="justify-content-md-center">
                    <Col xs={12}>
                      <AssistantsLab
                        handleAssitantsLabSubmit={handleAssistantsLabSubmit}
                        handleCallBackFetchInteractions={handleFetchInteractions}
                        interactions={interactions}
                        working={working}
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
                        resultData={translationResult}
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
                          label="Enter a prompt for Image Generation (like: Make an image of a cat playing guitar with an unicorn)"
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
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                          overlay={<Tooltip className="custom-tooltipper">{tooltip_send_image_generation}</Tooltip>}
                        >
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
                                {label_send_prompt_working}  - {elapsedTime.toFixed(1)}s
                              </>
                            ) : (
                              label_send_image_generation
                            )}
                          </Button>
                        </OverlayTrigger>
                      </Form>

                      {imageURL && <Card className="my-3">
                        <Card.Header as="h3">Generated Image</Card.Header>
                        <Card.Body>
                          <Card.Text>
                            <img
                              src={imageURL}
                              alt={`Generated: ${prompt}`}
                              title={`Generated: ${prompt}`}
                            />
                          </Card.Text>
                        </Card.Body>
                      </Card>}
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            } /> */}

            <Route path="/chat" element={
              <ChatForm
                SystemMessage="friendly"
                handleSubmit={handleChatSubmit}
                prompt={prompt}
                setPrompt={setPrompt}
                flLabel={label_general_chat}
                working={working}
                interactions={interactions}
                handleCallBackFetchInteractions={handleFetchInteractions}
                response={response}
                string_headline="Chat Response"
              />
            } />

            <Route path="/" element={
              <Home
              />
            } />

            <Route path="/chat" element={
              <ChatForm
                SystemMessage="friendly"
                handleSubmit={handleChatSubmit}
                prompt={prompt}
                setPrompt={setPrompt}
                flLabel={label_general_chat}
                working={working}
                interactions={interactions}
                handleCallBackFetchInteractions={handleFetchInteractions}
                response={response}
                string_headline="Chat Response"
              />
            } />

            <Route path="/translation" element={
              <TranslationChatForm
                handleTranslateSubmit={handleTranslateSubmit}
                working={working}
                setPrompt={setPrompt}
                flLabel={"Enter any text for Translation."}
                prompt={prompt}
                translatedText={translationResult}
                resultData={translationResult}
              />
            } />

            <Route path="/image" element={
              <ImageCreation
                callbackHandleImageSubmit={handleImageSubmit}
              />

            } />

            <Route path="/assistants" element={<AssistantsPage
              reloadAssistants={reloadAssistants}
              refresh={refresh}
            />
            } />

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
                interactions={interactions}
                handleCallBackFetchInteractions={handleFetchInteractions}
              />} />

            <Route path="/assistants-lab" element={
              <AssistantsLab
                handleAssitantsLabSubmit={handleAssistantsLabSubmit}
                handleCallBackFetchInteractions={handleFetchInteractions}
                interactions={interactions}
                working={working}
              />
            } />

            <Route path="*" element={
              <NotFound
              />} />

          </Routes>
        </Router>

        <a href="mailto:degiorgi@rolf-benz-schule.de" className="text-decoration-none">
          <OverlayTrigger
            placement="top-start"
            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
            overlay={<Tooltip className="custom-tooltipper">{tooltip_version}</Tooltip>}
          ><div
            className="position-fixed bottom-0 start-0 m-2 px-2 bg-dark text-white opacity-50 rounded pointerFinger"
            style={{ fontSize: '12px', width: 'auto', textAlign: 'right' }}
          >
              Version: {packageJson.version}
            </div>
          </OverlayTrigger>
        </a>
      </Container>
    </>
  );
}

export default App;
