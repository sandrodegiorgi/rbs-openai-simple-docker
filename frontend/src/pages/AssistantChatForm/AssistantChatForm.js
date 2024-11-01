import { FloatingLabel, Form, Button, Spinner } from 'react-bootstrap';
import BackToAssistants from '../BackToAssistants/BackToAssistants';

const AssistantChatForm = ({ assistantId, handleAssistantSubmit,
    prompt, setPrompt, flLabel, working }) => {

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
                        placeholder="Make a song about unicorns..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        style={{ height: '150px' }}
                        disabled={working}
                    />
                </FloatingLabel>
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
            </Form>
            {/* <BackToAssistants /> */}
        </>
    );
};

export default AssistantChatForm;
