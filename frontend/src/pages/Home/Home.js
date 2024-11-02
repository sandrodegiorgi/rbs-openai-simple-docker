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
            This platform is a testing environment for the AI-projects of the
            <strong> Rolf-Benz-Schule Gewerbliche Schule Nagold.</strong> Explore our AI-powered tools and assistants below!
          </p>
        </Col>
      </Row>

      <Row className="fade-in">
        <Col>
          <h3 className="section-title rainbow-text">General Chat</h3>
          <p>
            Engage in a general conversation with our AI assistant. Ask any question, and get insightful, intelligent responses in real-time.
          </p>
        </Col>
      </Row>

      <Row className="fade-in">
        <Col>
          <h3 className="section-title rainbow-text">Assistants</h3>
          <p>
            Our AI assistants are here to help you. Whether you need friendly advice or technical expertise, interact with specialized assistants for tailored responses.
          </p>
        </Col>
      </Row>

      <Row className="fade-in">
        <Col>
          <h3 className="section-title rainbow-text">Translation</h3>
          <p>
            Translate text between multiple languages with our AI-powered translation tool. Communicate effectively across language barriers.
          </p>
        </Col>
      </Row>

      <Row className="fade-in">
        <Col>
          <h3 className="section-title rainbow-text">Image Generation</h3>
          <p>
            Let your creativity flow! Provide a description, and our AI will generate stunning images based on your imagination. Try it now!
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
