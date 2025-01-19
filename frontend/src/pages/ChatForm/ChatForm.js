import { FloatingLabel, Form, Button, Spinner, OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import {
    default_tooltip_show, default_tooltip_hide, tooltip_send_assistant,
    label_send_general_chat, label_send_prompt_working,
    interaction_type_chat
} from './../../Consts';

const ChatForm = ({ SystemMessage, handleSubmit, prompt, setPrompt,
    flLabel, working, handleCallBackFetchInteractions, interactions }) => {

    useEffect(() => {
        if (!working) {
            console.log("should call get all interactions")
            handleCallBackFetchInteractions();
            console.log(interactions);
        }
    }, [working]);

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e, SystemMessage);
    };
    return (
        <>
            {interactions
                .filter((interaction) => interaction.role !== "system") // Omit "system" role
                .map((interaction, index) => (
                    <Card
                        key={index}
                        className="my-3"
                        style={{
                            width: "80%",
                            marginLeft: interaction.role === "assistant" ? "0" : "auto",
                            marginRight: interaction.role === "assistant" ? "auto" : "0",
                            border: interaction.role === "user" ? "1px solid black" : "1px solid #e0e0e0",
                        }}
                    >
                        <Card.Body style={{ position: "relative" }}>
                            <div
                                style={{
                                    position: "absolute",
                                    top: "0",
                                    right: "0",
                                    fontSize: "0.7rem",
                                    color: "grey",
                                    padding: "5px",
                                }}
                            >
                                {interaction.created_at} - {interaction.model} - {interaction.role}
                            </div>

                            {/* Content */}
                            <ReactMarkdown
                                children={interaction.content}
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                                skipHtml={false}
                            />
                        </Card.Body>
                    </Card>
                ))}



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
                                {label_send_prompt_working}
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
