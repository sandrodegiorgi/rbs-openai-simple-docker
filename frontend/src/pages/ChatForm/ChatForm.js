import { Form, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
// import {
//     default_tooltip_show, default_tooltip_hide, tooltip_send_assistant,
//     label_send_general_chat, label_send_prompt_working,
//     interaction_type_chat
// } from './../../Consts';
import InteractionsDisplay from '../InteractionsDisplay/InteractionsDisplay';
import "./ChatForm.css";
import ResponseDisplay from '../ResponseDisplay/ResponseDisplay';
import { FaArrowUp } from "react-icons/fa";

const ChatForm = ({ SystemMessage, handleSubmit, prompt, setPrompt,
    flLabel, working, handleCallBackFetchInteractions, interactions,
    response, string_headline }) => {

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
            setPrompt("");
        }
        return () => clearInterval(timer);
    }, [working]);

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e, SystemMessage);
    };

    return (
        <>
            <div className="chat-container">
                <div className="chat-history">
                    <InteractionsDisplay interactions={interactions} />
                    <ResponseDisplay
                        response={response}
                        string_headline={string_headline}
                        working={working}
                    />
                </div>
                <div className="chat-input">
                    <Form onSubmit={onSubmit} style={{ position: "relative" }}>
                        <Form.Control
                            className="ta-chat-input"
                            as="textarea"
                            type="text"
                            placeholder={flLabel}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            // style={{ height: '150px', paddingRight: '50px' }}
                            style={{ height: '50%', paddingRight: '50px' }}
                            disabled={working}
                        />

                        <Button
                            type="submit"
                            variant={working ? "secondary" : "dark"}
                            disabled={working}
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                                padding: "0",
                                borderRadius: "50%",
                                zIndex: 1,
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {working ? (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ width: "16px", height: "16px" }}
                                />
                            ) : (
                                <FaArrowUp size={10} color="white" /> // Icon size
                            )}
                        </Button>

                        {/* <Button
                            type="submit"
                            variant={working ? "secondary" : "dark"}
                            disabled={working}
                            style={{
                                position: "absolute",
                                bottom: "15px",
                                right: "15px",
                                paddingBottom: "8px",
                                borderRadius: "50%",
                                zIndex: 1,
                            }}
                        >
                            {working ? (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            ) : (
                                <FaArrowUp size={12} color='white' />
                            )}
                        </Button> */}
                    </Form>
                </div>
            </div>
        </>
    );
};

export default ChatForm;
