import React, { useState } from 'react';
import {
    Button, Container, Row, Col, Tabs, Tab, InputGroup,
    Form, FloatingLabel, Spinner, Image, Card,
    OverlayTrigger, Tooltip
  } from 'react-bootstrap';

import {
    default_tooltip_show, default_tooltip_hide, 
    tooltip_send_image_generation, label_send_image_generation, label_send_prompt_working
} from './../../Consts';

import './ImageCreation.css';

const ImageCreation = ({ response, string_headline, working,
    handleImageSubmit, prompt, setPrompt, imageURL, elapsedTime }) => {
 
    return (
        <>
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
        </>

    );
};

export default ImageCreation;
