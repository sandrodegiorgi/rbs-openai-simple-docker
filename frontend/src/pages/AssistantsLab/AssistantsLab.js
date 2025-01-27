import React, { useState, useEffect } from 'react';
import { Form, Button, FloatingLabel, Spinner, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AssistantsLabHelperModal from './AssistantsLabHelperModal';
import InteractionsDisplay from '../InteractionsDisplay/InteractionsDisplay';

import {
    default_tooltip_show, default_tooltip_hide,
    label_send_prompt_working, label_send_assistant_lab,
    tooltip_send_assistant_lab, tooltip_assistants_lab_virtual_url,
    tooltip_assistants_lab_password, label_assistants_lab_create_config
} from './../../Consts';

import "./AssistantsLab.css";

function AssistantsLab({ response, working,
    handleAssitantsLabSubmit, interactions,
    handleCallBackFetchInteractions
}) {

    useEffect(() => {
        if (!working) {
            console.log("should call get all interactions for Lab");
            handleCallBackFetchInteractions("lab");
        }
    }, [working]);

    const [systemMessage, setSystemMessage] = useState('');
    const [assistantPrompt, setAssistantsPrompt] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const [assistantName, setAssistantName] = useState('');
    const [promptExample, setPromptExample] = useState('');
    const [virtualUrl, setVirtualUrl] = useState('');
    const [assistantPassword, setAssistantPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};
        if (!assistantName.trim()) newErrors.assistantName = "Assistant Name is required.";
        if (!promptExample.trim()) newErrors.promptExample = "Prompt Example is required.";
        if (!virtualUrl.trim()) newErrors.virtualUrl = "Virtual URL is required.";
        if (!assistantPassword.trim()) newErrors.assistantPassword = "Password is required.";
        if (!systemMessage.trim()) newErrors.systemMessage = "System Message is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (setter, fieldName) => (e) => {
        const value = e.target.value;
        setter(value);
        if (errors[fieldName] && value.trim()) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const openModal = () => {
        if (!validateFields()) {
            alert("Bitte prüfen Sie Ihre Eingaben. Sie müssen alle Felder (außer den Test-Prompt) ausfüllen, sonst ist eine Erstellung eines Assistenten nicht möglich.");
            return;
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

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
        handleAssitantsLabSubmit(e, systemMessage, assistantPrompt);
    };

    return (
        <>
            <InteractionsDisplay interactions={interactions} />

            <Form onSubmit={onSubmit}>
                <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                            overlay={<Tooltip className="custom-tooltipper">Geben Sie dem Assistenten einen Namen</Tooltip>}
                        >
                            <FloatingLabel controlId="assistantNameInput" label="Assistant Name" className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter assistant name..."
                                    value={assistantName}
                                    onChange={handleInputChange(setAssistantName, "assistantName")}
                                    disabled={working}
                                    isInvalid={!!errors.assistantName}
                                />
                                <Form.Control.Feedback type="invalid">{errors.assistantName}</Form.Control.Feedback>
                            </FloatingLabel>
                        </OverlayTrigger>
                    </Col>

                    <Col xs={12} md={6}>
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                            overlay={<Tooltip className="custom-tooltipper">Geben Sie einen beispielhaften Prompt für die Nutzung des Assistenten an.</Tooltip>}
                        >
                            <FloatingLabel controlId="promptExampleInput" label="Prompt Example" className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter a prompt example..."
                                    value={promptExample}
                                    onChange={handleInputChange(setPromptExample, "promptExample")}
                                    disabled={working}
                                    isInvalid={!!errors.promptExample}
                                />
                                <Form.Control.Feedback type="invalid">{errors.promptExample}</Form.Control.Feedback>
                            </FloatingLabel>
                        </OverlayTrigger>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                            overlay={<Tooltip className="custom-tooltipper">{tooltip_assistants_lab_virtual_url}</Tooltip>}
                        >
                            <FloatingLabel controlId="virtualUrlInput" label="Virtual URL / Link" className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter virtual URL or link..."
                                    value={virtualUrl}
                                    // onChange={handleInputChange(setPromptExample, "promptExample")}

                                    onChange={(e) => {
                                        const input = e.target.value;
                                        const regex = /^[a-zA-Z0-9-_]*$/;
                                        if (regex.test(input)) {
                                            // setVirtualUrl(input);
                                            handleInputChange(setVirtualUrl, "virtualUrl")(e);
                                        }
                                    }}
                                    disabled={working}
                                    isInvalid={!!errors.virtualUrl}
                                />
                                <Form.Control.Feedback type="invalid">{errors.virtualUrl}</Form.Control.Feedback>
                            </FloatingLabel>
                        </OverlayTrigger>
                    </Col>

                    <Col xs={12} md={6}>
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                            overlay={<Tooltip className="custom-tooltipper">{tooltip_assistants_lab_password}</Tooltip>}
                        >
                            <FloatingLabel controlId="assistantPasswordInput" label="Passwort" className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter password..."
                                    value={assistantPassword}
                                    onChange={handleInputChange(setAssistantPassword, "assistantPassword")}
                                    disabled={working}
                                    isInvalid={!!errors.assistantPassword}
                                />
                                <Form.Control.Feedback type="invalid">{errors.assistantPassword}</Form.Control.Feedback>
                            </FloatingLabel>
                        </OverlayTrigger>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                            overlay={<Tooltip className="custom-tooltipper">Geben Sie das gewünschte Priming für Ihren Assistenten an.</Tooltip>}
                        >
                            <FloatingLabel controlId="systemMessageTextInput" label="Enter System Message" className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    type="text"
                                    placeholder="Enter system message here..."
                                    value={systemMessage}
                                    onChange={handleInputChange(setSystemMessage, "systemMessage")}
                                    style={{ height: '150px' }}
                                    disabled={working}
                                    isInvalid={!!errors.systemMessage}
                                />
                                <Form.Control.Feedback type="invalid">{errors.systemMessage}</Form.Control.Feedback>
                            </FloatingLabel>
                        </OverlayTrigger>
                    </Col>

                    <Col xs={12} md={6}>
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                            overlay={<Tooltip className="custom-tooltipper">Hier können Sie den Prompt angeben, mit dem Sie Ihren Assistenten testen möchten.</Tooltip>}
                        >
                            <FloatingLabel controlId="userMessageTextOutput" label="Enter Prompt" className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    type="text"
                                    value={assistantPrompt}
                                    onChange={(e) => setAssistantsPrompt(e.target.value)}
                                    placeholder="Enter prompt here..."
                                    style={{ height: '150px' }}
                                />
                            </FloatingLabel>
                        </OverlayTrigger>
                    </Col>
                </Row>

                <Row>
                    <Col className="text-start">
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                            overlay={<Tooltip className="custom-tooltipper">{tooltip_send_assistant_lab}</Tooltip>}
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
                                        {label_send_prompt_working} - {elapsedTime.toFixed(1)}s
                                    </>
                                ) : (
                                    label_send_assistant_lab
                                )}
                            </Button>
                        </OverlayTrigger>
                    </Col>
                </Row>

                <OverlayTrigger
                    placement="top"
                    delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                    overlay={<Tooltip className="custom-tooltipper">Klicken Sie hier um die Konfiguration des Assistenten anzuzeigen. Diese können Sie dann kopieren und/oder herunter laden.</Tooltip>}
                >
                    <Button
                        className="position-fixed"
                        style={{ bottom: '20px', right: '20px' }}
                        variant="info"
                        onClick={openModal}
                    >
                        {label_assistants_lab_create_config}
                    </Button>
                </OverlayTrigger>
            </Form>

            <AssistantsLabHelperModal show={showModal} handleClose={closeModal}
                assistantName={assistantName}
                promptExample={promptExample}
                virtualUrl={virtualUrl}
                assistantPassword={assistantPassword}
                systemMessage={systemMessage}
            />
        </>
    );
}

export default AssistantsLab;
