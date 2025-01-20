import { FloatingLabel, Form, Button, Spinner, OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import {
    default_tooltip_show, default_tooltip_hide, tooltip_send_assistant,
    label_send_general_chat, label_send_prompt_working,
    interaction_type_chat
} from './../../Consts';
import InteractionsDisplay from '../InteractionsDisplay/InteractionsDisplay';
import "./ChatForm.css";


const ChatForm = ({ SystemMessage, handleSubmit, prompt, setPrompt,
    flLabel, working, handleCallBackFetchInteractions, interactions }) => {

    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (!working) {
            console.log("should call get all interactions")
            handleCallBackFetchInteractions();
            console.log(interactions);
        }
    }, [working]);

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
        handleSubmit(e, SystemMessage);
    };
    return (
        <>
            <InteractionsDisplay interactions={interactions} />

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
                            label_send_general_chat
                        )}
                    </Button>
                </OverlayTrigger>
            </Form>
        </>
    );

    // return (

    //     {interactions.map((interaction, index) => (
    //         <>
    //             <Card key={index} className="my-3">
    //                 <Card.Header as="h3">{interaction_type_chat}</Card.Header>
    //                 <Card.Body>

    //                     <ReactMarkdown
    //                         children={interaction.content}
    //                         remarkPlugins={[remarkGfm, remarkBreaks]}
    //                         rehypePlugins={[rehypeRaw]}
    //                         skipHtml={false}
    //                     />

    //     ))}
    //                 </Card.Body>
    //             </Card>
    //             <Form onSubmit={onSubmit}>
    //                 <FloatingLabel
    //                     controlId={`floatingInput_${flLabel}`}
    //                     label={flLabel}
    //                     className="mb-3"
    //                 >
    //                     <Form.Control
    //                         as="textarea"
    //                         type="text"
    //                         placeholder="Make a song about unicorns..."
    //                         value={prompt}
    //                         onChange={(e) => setPrompt(e.target.value)}
    //                         style={{ height: '150px' }}
    //                         disabled={working}
    //                     />
    //                 </FloatingLabel>
    //                 <OverlayTrigger
    //                     placement="bottom-end"
    //                     delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
    //                     overlay={<Tooltip className="custom-tooltipper">{tooltip_send_assistant}</Tooltip>}
    //                 ><Button
    //                     type="submit"
    //                     variant={working ? "secondary" : "primary"}
    //                     disabled={working}
    //                 >
    //                         {working ? (
    //                             <>
    //                                 <Spinner
    //                                     as="span"
    //                                     animation="border"
    //                                     size="sm"
    //                                     role="status"
    //                                     aria-hidden="true"
    //                                 />{' '}
    //                                 {label_send_prompt_working}
    //                             </>
    //                         ) : (
    //                             label_send_general_chat
    //                         )}
    //                     </Button>
    //                 </OverlayTrigger>
    //             </Form>
    //         </>
    //     );
};

export default ChatForm;
