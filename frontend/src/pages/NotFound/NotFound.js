import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./NotFound.css";

function NotFound() {
    return (
        <div className="not-found-container">
            <Container className="text-center">
                <Row className="justify-content-center align-items-center vh-100">
                    <Col md={6}>
                        <div className="unicorn-animation">
                            🦄
                        </div>
                        <h1 className="gradient-text">Oops! Page Not Found</h1>
                        <p className="lead">
                            It seems you've stumbled upon a magical place, but the page you're
                            looking for doesn't exist.
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default NotFound;
