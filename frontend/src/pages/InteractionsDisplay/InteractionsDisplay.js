import React, { useState } from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaRegClipboard, FaCheck } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';



import {
    default_tooltip_show, default_tooltip_hide, tooltip_copy_raw_response_to_clipboard
} from './../../Consts';

import './InteractionsDisplay.css';

function InteractionsDisplay({ interactions }) {

    const [rawCopySuccess, setRawCopySuccess] = useState(false);

    const copyRawToClipboard = (blob) => {
        // console.log(blob);
        navigator.clipboard.writeText(blob).then(
            () => {
                setRawCopySuccess(true);
                setTimeout(() => setRawCopySuccess(false), 2000);
            },
            (err) => console.error("Failed to copy raw response!", err)
        );
    };

    return (
        <>
            {interactions
                .filter((interaction) => interaction.role !== "system")
                .map((interaction, index) => (
                    <Card
                        key={index}
                        className="my-3"
                        style={{
                            width: interaction.role === "assistant" ? "100%" : "80%",
                            backgroundColor: interaction.role === "assistant" ? "#ffffff" : "#f3f3f3",
                            marginLeft: interaction.role === "assistant" ? "0" : "auto",
                            marginRight: interaction.role === "assistant" ? "auto" : "0",
                            border: interaction.role === "user" ? "1px solid #aaaaaa" : "1px solid #e0e0e0",
                        }}
                    >
                        <Card.Body style={{ position: "relative" }}>
                            {(interaction.role === "assistant") && (
                                <>
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "36px",
                                            fontSize: "0.7rem",
                                            color: "grey",
                                            padding: "5px",
                                        }}
                                    >
                                        {interaction.created_at} - {interaction.model} - {interaction.role}
                                    </div>

                                    <OverlayTrigger
                                        placement="bottom-end"
                                        delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                                        overlay={<Tooltip className="custom-tooltipper">{tooltip_copy_raw_response_to_clipboard}</Tooltip>}
                                    ><button
                                        onClick={(e) => copyRawToClipboard(interaction.content)}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                            {rawCopySuccess ? (
                                                <FaCheck color="green" size={20} />
                                            ) : (
                                                <FaRegClipboard size={20} />
                                            )}
                                        </button>
                                    </OverlayTrigger>
                                </>
                            )}

                            <ReactMarkdown
                                className={interaction.role === "assistant" ? "pt-3" : ""}
                                // children={interaction.content.replace(/\[NEWLINE\]/g, '\n')}
                                children={interaction.content.replace(/\[NEWLINE\]/g, '\n')
                                    .replace(/\\\[/g, '$$')
                                    .replace(/\\\]/g, '$$')
                                    .replace(/\\\(/g, '$')
                                    .replace(/\\\)/g, '$')}
                                remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                                rehypePlugins={[rehypeRaw, rehypeKatex]}
                                skipHtml={false}
                            />
                        </Card.Body>
                    </Card>
                ))}
        </>
    );
}

export default InteractionsDisplay;
