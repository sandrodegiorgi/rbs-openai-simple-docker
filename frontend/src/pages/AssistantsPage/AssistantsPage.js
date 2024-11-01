import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import { SERVER_URL, ASSISTANT_URL, INTERACT_EPILOGUE } from '../../Consts';
import AssistantChatForm from '../AssistantChatForm/AssistantChatForm';
import ResponseDisplay from '../ResponseDisplay/ResponseDisplay';
import BackToAssistants from '../BackToAssistants/BackToAssistants';
import AssistantsReloadPage from '../AssistantsReloadPage/AssistantsReloadPage';

function AssistantsPage({ handleAssistantSubmit, prompt, setPrompt, working, response,
    reloadAssistants, refresh
}) {
    const [assistants, setAssistants] = useState([]);
    const [specificAssistant, setSpecificAssistant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { assistantId } = useParams();

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
                    />
                    <ResponseDisplay response={response} />
                    <BackToAssistants />
                </Col>
            </Row>
        );
    }

    return (
        <Row className="justify-content-md-center mt-3">
            <Col xs={12}>

                <h2>Available Assistants:</h2>
                <ul>
                    {/* {console.log(assistants)} */}
                    {assistants.map((assistant, index) => (
                        <li key={index}>
                            <Link to={`/assistants/${assistant.url}`} className="fw-bold">{assistant.name}</Link>
                            <p>{assistant.prompt}</p>
                        </li>
                    ))}
                </ul>
                <AssistantsReloadPage
                    reloadAssistants={reloadAssistants}
                />
            </Col>
        </Row>
    );
}

export default AssistantsPage;
