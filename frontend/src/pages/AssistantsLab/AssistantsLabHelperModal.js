import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaRegClipboard, FaCheck } from 'react-icons/fa';

function AssistantsLabHelperModal({ show, handleClose,
    assistantName, promptExample,
    virtualUrl, assistantPassword, systemMessage
}) {
    const [copySuccess, setCopySuccess] = useState(false);


    const generateContent = () => `${assistantName}
${promptExample}
${virtualUrl}
${assistantPassword}
${systemMessage}`;

    const generateFileName = () => {
        const sanitizedAssistantName = assistantName
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '');
        return `ass_${sanitizedAssistantName}.txt`;
    };

    const handleDownload = () => {
        const filename = generateFileName();
        const content = generateContent();
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleCopyToClipboard = () => {
        const content = generateContent();
        navigator.clipboard.writeText(content).then(
            () => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            },
            (err) => console.error("Failed to copy to clipboard!", err)
        );
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header>
                <Modal.Title>Assistant Configuration</Modal.Title>
                {copySuccess ? (
                    <FaCheck
                        style={{
                            marginLeft: 'auto',
                            fontSize: '1.5rem',
                            color: 'green',
                        }}
                        title="Copied!"
                    />
                ) : (
                    <FaRegClipboard
                        style={{
                            cursor: 'pointer',
                            marginLeft: 'auto',
                            fontSize: '1.5rem',
                            color: '#007bff',
                        }}
                        title="Copy to Clipboard"
                        onClick={handleCopyToClipboard}
                    />
                )}
            </Modal.Header>
            <Modal.Body>
                {assistantName}<br />
                {promptExample}<br />
                {virtualUrl}<br />
                {assistantPassword}<br />
                {systemMessage}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleDownload}>
                    Assistent als Datei herunterladen ({generateFileName()})
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AssistantsLabHelperModal;
