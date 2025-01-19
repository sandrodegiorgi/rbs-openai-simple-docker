import React, { useState, useEffect } from 'react';
import { Form, Button, FloatingLabel, Spinner, Col, Row, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
    LANGUAGES,
    default_tooltip_show, default_tooltip_hide,
    tooltip_translate_source_language, tooltip_translate_target_language,
    label_send_translate, label_send_prompt_working,
    tooltip_send_translate
} from './../../Consts';

function TranslationForm({ prompt, setPrompt, response, working,
    handleTranslateSubmit, translatedText, resultData }) {

    const [sourceLanguage, setSourceLanguage] = useState("auto-detect");
    const [targetLanguage, setTargetLanguage] = useState("english");
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let timer;
        if (working) {
            timer = setInterval(() => {
                setElapsedTime((prev) => prev + 0.1);
            }, 100);
        } else {
            setElapsedTime(0);
        }
        return () => clearInterval(timer);
    }, [working]);

    const onSubmit = (e) => {
        e.preventDefault();
        handleTranslateSubmit(e, sourceLanguage, targetLanguage);
    };

    return (
        <Form onSubmit={onSubmit}>
            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <FloatingLabel controlId="sourceLanguageSelect" label="Source Language" className="mb-3">
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                            overlay={<Tooltip className="custom-tooltipper">{tooltip_translate_source_language}</Tooltip>}
                        >
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
                        </OverlayTrigger>
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
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                            overlay={<Tooltip className="custom-tooltipper">{tooltip_translate_target_language}</Tooltip>}
                        ><Form.Select
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
                        </OverlayTrigger>
                    </FloatingLabel>

                    <FloatingLabel controlId="targetTextOutput" label="Translation Output" className="mb-3">
                        <Form.Control
                            as="textarea"
                            type="text"
                            // value={translatedText || ''}
                            value={resultData?.translated_text || ''}
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
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                        overlay={<Tooltip className="custom-tooltipper">{tooltip_send_translate}</Tooltip>}
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
                                label_send_translate
                            )}
                        </Button>
                    </OverlayTrigger>
                </Col>
            </Row>
        </Form>
    );
}

export default TranslationForm;
