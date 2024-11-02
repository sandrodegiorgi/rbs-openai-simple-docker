import React, { useState } from 'react';
import { Form, Button, FloatingLabel, Spinner, Col, Row, Card } from 'react-bootstrap';

import { LANGUAGES } from '../../Consts';

function TranslationForm({ prompt, setPrompt, response, working, 
    handleTranslateSubmit, translatedText }) {

    const [sourceLanguage, setSourceLanguage] = useState("auto-detect");
    const [targetLanguage, setTargetLanguage] = useState("english");

    const onSubmit = (e) => {
        e.preventDefault();
        handleTranslateSubmit(e, sourceLanguage, targetLanguage);
    };

    return (
        <Form onSubmit={onSubmit}>
            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <FloatingLabel controlId="sourceLanguageSelect" label="Source Language" className="mb-3">
                        <Form.Select
                            value={sourceLanguage}
                            onChange={(e) => setSourceLanguage(e.target.value)}
                            disabled={working}
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="sourceTextInput" label="Enter Source Text" className="mb-3">
                        <Form.Control
                            as="textarea"
                            type="text"
                            placeholder="Enter text here..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            style={{ height: '150px' }}
                            disabled={working}
                        />
                    </FloatingLabel>
                </Col>

                <Col xs={12} md={6}>
                    <FloatingLabel controlId="targetLanguageSelect" label="Target Language" className="mb-3">
                        <Form.Select
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            disabled={working}
                        >
                            {LANGUAGES.filter((lang) => lang.value !== "auto-detect").map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="targetTextOutput" label="Translation Output" className="mb-3">
                        <Form.Control
                            as="textarea"
                            type="text"
                            value={translatedText || ''}
                            placeholder="Translated text will appear here..."
                            style={{ height: '150px' }}
                            readOnly
                            disabled
                        />
                    </FloatingLabel>
                </Col>
            </Row>

            {sourceLanguage === "auto-detect" && (
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Text>
                            "Auto-detect" uses language detection technology provided by{' '}
                            <a
                                href="https://github.com/pemistahl/lingua"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                lingua-py
                            </a> in the backend. The software is licensed under the{' '}
                            <a
                                href="http://www.apache.org/licenses/LICENSE-2.0"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Apache License 2.0
                            </a>.
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}

            <Row>
                <Col className="text-start">
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
                </Col>
            </Row>
        </Form>
    );
}

export default TranslationForm;
