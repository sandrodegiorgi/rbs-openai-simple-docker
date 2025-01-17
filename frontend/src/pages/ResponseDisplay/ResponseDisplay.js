import React, { useState } from 'react';
import { FaRegClipboard, FaCheck } from 'react-icons/fa';
import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import './ResponseDisplay.css';

const ResponseDisplay = ({ response }) => {
    const [copySuccess, setCopySuccess] = useState('');

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(response)
            .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000);
            })
            .catch(() => setCopySuccess('Failed to copy!'));
    };

    return (
        response && (
            <>
                <Card className="my-3">
                    <Card.Header as="h3">Assistant's Response</Card.Header>
                    <Card.Body>
                        <Card.Text className="response-container">
                            <button
                                onClick={copyToClipboard}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                                title="Copy to Clipboard"
                            >
                                {copySuccess ? (
                                    <FaCheck color="green" size={20} />
                                ) : (
                                    <FaRegClipboard size={20} />
                                )}
                            </button>

                            <ReactMarkdown
                                children={response}
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                skipHtml={false}
                            />

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
