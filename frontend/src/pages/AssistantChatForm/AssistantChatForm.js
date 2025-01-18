import { useState, useEffect } from 'react';
import { FloatingLabel, Form, Button, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
    default_tooltip_show, default_tooltip_hide, tooltip_send_assistant, 
    label_send_assistant, label_send_prompt_working,
    label_default
} from './../../Consts';
import BackToAssistants from '../BackToAssistants/BackToAssistants';

const AssistantChatForm = ({ assistantId, handleAssistantSubmit,
    prompt, setPrompt, flLabel, working }) => {

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
        handleAssistantSubmit(e, assistantId);
    };

    return (
        <>
            <Form onSubmit={onSubmit}>
                <FloatingLabel
                    controlId={`floatingInput_${flLabel}`}
                    label={flLabel}
                    className="mb-3"
                >
                    <Form.Control
                        as="textarea"
                        type="text"
                        placeholder={label_default}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        style={{ height: '150px' }}
                        disabled={working}
                    />
                </FloatingLabel>
                <OverlayTrigger
                    placement="bottom-end"
                    delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                    overlay={<Tooltip className="custom-tooltipper">{tooltip_send_assistant}</Tooltip>}
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
                            label_send_assistant
                        )}
                    </Button>
                </OverlayTrigger>
            </Form>
            {/* <BackToAssistants /> */}
        </>
    );
};

export default AssistantChatForm;
