import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Home.css';

function Home() {

  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in");
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add("visible");
      }, index * 300);
    });
  }, []);

  return (
    <Container className="py-4 home-container">
      <div className="rainbow"></div>

      <Row className="mb-4 text-center">
        <Col>
          <h1 className="title rainbow-text">Welcome to the RBS-AI Testing Bed</h1>
          <p className="lead fade-in">
            This platform is a testing environment for the AI-projects of {' '}
            <span className="fw-bold">
              {/* <a href="https://www.rolf-benz-schule.de" target="_blank"> */}
              Rolf-Benz-Schule Gewerbliche Schule Nagold
              {/* </a> */}
              .</span><br />
            Explore our AI-powered tools and assistants below!
          </p>
        </Col>
      </Row>

      <Row className="fade-in">
        <Col>
          <h3 className="section-title rainbow-text"><a target="rbs-ai-chat" href="/chat">General Chat</a></h3>
          <p>
            Engage in a general conversation with our AI assistant. Ask any question, and get insightful, intelligent responses in real-time.
          </p>
        </Col>
      </Row>

      <Row className="fade-in">
        <Col>
          <h3 className="section-title rainbow-text"><a target="rbs-ai-assistants" href="/assistants">Assistants</a></h3>
          <p>
            Our AI assistants are here to help you. Whether you need friendly advice or technical expertise, interact with specialized assistants for tailored responses.
          </p>
        </Col>
      </Row>

      <Row className="fade-in">
        <Col>
          <h3 className="section-title rainbow-text"><a target="rbs-ai-assistants-lab" href="/assistants-lab">Assistants-Lab</a></h3>
          <p>
            Welcome to the Assistants Lab: Your AI Testing Ground to Innovate, Fine-Tune, and Launch Powerful Assistants Tailored to Your Needs!
          </p>
        </Col>
      </Row>

      <Row className="fade-in">
        <Col>
          <h3 className="section-title rainbow-text"><a target="rbs-ai-translation" href="/translation">Translation</a></h3>
          <p>
            Translate text between multiple languages with our AI-powered translation tool. Communicate effectively across language barriers.
          </p>
        </Col>
      </Row>

      <Row className="fade-in">
        <Col>
          <h3 className="section-title rainbow-text"><a target="rbs-ai-image" href="/image">Image Generation</a></h3>
          <p>
            Let your creativity flow! Provide a description, and our AI will generate stunning images based on your imagination. Try it now!
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
