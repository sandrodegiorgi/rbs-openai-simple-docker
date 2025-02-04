import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, OverlayTrigger, Tooltip, Table, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaRegClipboard, FaCheck, FaTimes } from 'react-icons/fa';

import {
    SERVER_URL, ASSISTANT_URL,
    headline_available_assistants, tooltip_copy_assistant_link_to_clipboard,
    default_tooltip_show, default_tooltip_hide
} from '../../Consts';

import AssistantChatForm from '../AssistantChatForm/AssistantChatForm';
import ResponseDisplay from '../ResponseDisplay/ResponseDisplay';
import BackToAssistants from '../BackToAssistants/BackToAssistants';
import AssistantsReloadPage from '../AssistantsReloadPage/AssistantsReloadPage';

function AssistantsPage({ handleAssistantSubmit, prompt, setPrompt, working, response,
    reloadAssistants, refresh, interactions, handleCallBackFetchInteractions
}) {
    const [assistants, setAssistants] = useState([]);
    const [specificAssistant, setSpecificAssistant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { assistantId } = useParams();
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredAssistants = assistants.filter((assistant) =>
        assistant.name.toLowerCase().includes(searchTerm)
    );

    const copyToClipboard = (url, index) => {
        const deeplink = `${window.location.origin}/assistants/${url}`;
        navigator.clipboard.writeText(deeplink).then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        });
    };

    useEffect(() => {
        if (assistantId) {
            setLoading(true);
            fetch(`${SERVER_URL}${ASSISTANT_URL}/${assistantId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Assistant not found.');
                    }
                    return response.json();
                })
                .then((data) => {
                    setSpecificAssistant(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching specific assistant:', error);
                    setError(error.message);
                    setLoading(false);
                });
        } else {
            fetch(`${SERVER_URL}${ASSISTANT_URL}`)
                .then((response) => response.json())
                .then((data) => {
                    setAssistants(data);
                    // console.log(data);
                })
                .catch((error) => {
                    console.error('Error fetching assistants:', error);
                });
        }
    }, [assistantId, refresh]);

    if (loading && assistantId) {
        return <p>Loading assistant details...</p>;
    }

    if (error && assistantId) {
        return <>
            <h3>Sorry! Can't comply!</h3>
            <p>Error fetching assistant details: {error}</p>
        </>;
    }

    if (assistantId && specificAssistant) {
        return (
            <Row className="justify-content-md-center">
                <Col xs={12}>
                    <h2>Assistant: {specificAssistant.name}</h2>
                    <AssistantChatForm
                        SystemMessage={assistantId}
                        handleAssistantSubmit={handleAssistantSubmit}
                        prompt={prompt}
                        setPrompt={setPrompt}
                        flLabel={specificAssistant.prompt}
                        working={working}
                        assistantId={assistantId}
                        interactions={interactions}
                        handleCallBackFetchInteractions={handleCallBackFetchInteractions}
                    />
                    <ResponseDisplay
                        response={response}
                        string_headline={"Assistant reply: " + specificAssistant.name}
                        working={working}
                    />
                    {/* <BackToAssistants /> */}
                </Col>
            </Row>
        );
    }

    return (
        <Row className="justify-content-md-center mt-3">
            <Col xs={12}>

                {/* <h2>{headline_available_assistants}:</h2>
                <ul>
                    {assistants.map((assistant, index) => (
                        <li key={index}>
                            <Link to={`/assistants/${assistant.url}`} className="fw-bold">{assistant.name}</Link>
                            <OverlayTrigger
                                placement="bottom-end"
                                delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                                overlay={<Tooltip className="custom-tooltipper">'{assistant.name} {tooltip_copy_assistant_link_to_clipboard}</Tooltip>}
                            >
                                <button
                                    onClick={() => copyToClipboard(assistant.url, index)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        marginLeft: '10px',
                                    }}
                                >
                                    {copiedIndex === index ? (
                                        <FaCheck color="green" size={16} />
                                    ) : (
                                        <FaRegClipboard size={16} />
                                    )}
                                </button>
                            </OverlayTrigger>
                            <p>{assistant.prompt}</p>
                        </li>
                    ))}
                </ul> */}

                <div>
                    <h2>{headline_available_assistants}</h2>
                    {/* <input
                        type="text"
                        placeholder="Search assistants..."
                        onChange={handleSearchChange}
                        value={searchTerm}
                        style={{
                            marginBottom: "15px",
                            padding: "8px",
                            width: "100%",
                            maxWidth: "400px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    /> */}

                    <InputGroup style={{ marginBottom: "15px", maxWidth: "400px" }}>
                        <FormControl
                            type="text"
                            placeholder="Search assistants..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {searchTerm && (
                            <Button
                                variant="outline-secondary"
                                onClick={() => setSearchTerm("")}
                                aria-label="Clear search"
                            >
                                <FaTimes size={16} color="#6c757d" /> {/* FontAwesome Icon */}
                            </Button>
                        )}
                    </InputGroup>

                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Beschreibung</th>
                                <th className='text-center'>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssistants.map((assistant, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link to={`/assistants/${assistant.url}`} className="fw-bold">
                                            {assistant.name}
                                        </Link>
                                    </td>
                                    <td>{assistant.prompt}</td>
                                    <td className="text-center">
                                        <OverlayTrigger
                                            placement="bottom-end"
                                            delay={{ show: 500, hide: 200 }}
                                            overlay={
                                                <Tooltip className="custom-tooltipper">
                                                    {`Link zu '${assistant.name}' ${tooltip_copy_assistant_link_to_clipboard}`}
                                                </Tooltip>
                                            }
                                        >
                                            <button
                                                onClick={() => copyToClipboard(assistant.url, index)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {copiedIndex === index ? (
                                                    <FaCheck color="green" size={16} />
                                                ) : (
                                                    <FaRegClipboard size={16} />
                                                )}
                                            </button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>


                    {/* <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>Name</th>
                                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>Beschreibung</th>
                                <th style={{ textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" }}>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssistants.map((assistant, index) => (
                                <tr key={index}>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                        <Link to={`/assistants/${assistant.url}`} className="fw-bold">
                                            {assistant.name}
                                        </Link>
                                    </td>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                        {assistant.prompt}
                                    </td>
                                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                        <OverlayTrigger
                                            placement="bottom-end"
                                            delay={{ show: 500, hide: 200 }}
                                            overlay={
                                                <Tooltip className="custom-tooltipper">
                                                    {`${assistant.name} ${tooltip_copy_assistant_link_to_clipboard}`}
                                                </Tooltip>
                                            }
                                        >
                                            <button
                                                onClick={() => copyToClipboard(assistant.url, index)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {copiedIndex === index ? (
                                                    <FaCheck color="green" size={16} />
                                                ) : (
                                                    <FaRegClipboard size={16} />
                                                )}
                                            </button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */}
                </div>




                <AssistantsReloadPage
                    reloadAssistants={reloadAssistants}
                />
            </Col>
        </Row>
    );
}

export default AssistantsPage;
