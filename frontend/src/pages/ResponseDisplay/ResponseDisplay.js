import React, { useState } from 'react';
import { FaRegClipboard, FaCheck } from 'react-icons/fa';
import Card from 'react-bootstrap/Card';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import {
    default_tooltip_show, default_tooltip_hide, tooltip_send_assistant, tooltip_copy_raw_response_to_clipboard
} from './../../Consts';

import './ResponseDisplay.css';

const ResponseDisplay = ({ response, string_headline }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const [rawCopySuccess, setRawCopySuccess] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(response)
            .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000);
            })
            .catch(() => setCopySuccess('Failed to copy!'));
    };

    const copyRawToClipboard = () => {
        navigator.clipboard.writeText(response).then(
            () => {
                setRawCopySuccess(true);
                setTimeout(() => setRawCopySuccess(false), 2000);
            },
            (err) => console.error("Failed to copy raw response!", err)
        );
    };

    return (
        response && (
            <>
                <Card className="my-3">
                    <Card.Header as="h3">{string_headline}</Card.Header>
                    <Card.Body>
                        <Card.Text className="response-container">
                            <OverlayTrigger
                                placement="bottom-end"
                                delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                                overlay={<Tooltip className="custom-tooltipper">{tooltip_copy_raw_response_to_clipboard}</Tooltip>}
                            ><button
                                onClick={copyRawToClipboard}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            // title="Copy HTML Markup to Clipboard"
                            >
                                    {rawCopySuccess ? (
                                        <FaCheck color="green" size={20} />
                                    ) : (
                                        <FaRegClipboard size={20} />
                                    )}
                                </button>
                            </OverlayTrigger>
                            {/* <button
                                onClick={copyRawToClipboard}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '30px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                                title="Copy Raw Response"
                            >
                                {rawCopySuccess ? (
                                    <FaCheck color="blue" size={20} />
                                ) : (
                                    <FaFileCode size={20} />
                                )}
                            </button> */}
                            <ReactMarkdown
                                children={response}
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                                skipHtml={false}
                            />
                            {/* <code>{response}</code> */}
                            {/* <ReactMarkdown
                                children={response}
                                // remarkPlugins={[remarkGfm, remarkBreaks]}
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                skipHtml={false}
                            />
                            <button onClick={copyToClipboard} style={{ marginTop: '10px' }}>
                                Copy to Clipboard
                            </button>
                            {copySuccess && <span style={{ marginLeft: '10px', color: 'green' }}>{copySuccess}</span>} */}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </>
        )
    );
};

export default ResponseDisplay;
