import { FloatingLabel, Form, Button, Spinner } from 'react-bootstrap';

const ChatForm = ({ SystemMessage, handleSubmit, prompt, setPrompt, flLabel, working }) => {
    // console.log("SystemMessage:", SystemMessage);

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
            {/* <Button type="submit" variant="primary">Send</Button> */}
            <Button
                type="submit"
                variant={working ? "secondary" : "primary"}  // Change color when working
                disabled={working}  // Disable button when working
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
    );
};

export default ChatForm;
