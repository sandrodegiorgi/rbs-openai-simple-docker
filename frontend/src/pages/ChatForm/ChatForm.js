import { FloatingLabel, Form, Button, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
    default_tooltip_show, default_tooltip_hide, tooltip_send_assistant, 
    label_send_general_chat, label_send_prompt_working
} from './../../Consts';

const ChatForm = ({ SystemMessage, handleSubmit, prompt, setPrompt, flLabel, working }) => {

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e, SystemMessage);
    };

    return (
        <Form onSubmit={onSubmit}>
            <FloatingLabel
                controlId={`floatingInput_${flLabel}`}
                label={flLabel}
                className="mb-3"
            >
                <Form.Control
                    as="textarea"
                    type="text"
                    placeholder="Make a song about unicorns..."
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
            ><Button
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
                            {label_send_prompt_working}
                        </>
                    ) : (
                        label_send_general_chat
                    )}
                </Button>
            </OverlayTrigger>
        </Form>
    );
};

export default ChatForm;
