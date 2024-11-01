import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';

function AssistantsReloadPage({ reloadAssistants }) {
    const [confirmVisible, setConfirmVisible] = useState(false);

    const handleShowConfirmation = () => setConfirmVisible(true);
    const handleHideConfirmation = () => setConfirmVisible(false);

    return (
        <>
            <Row className="justify-content-md-center mt-3">
                <Col xs={12}>
                    {!confirmVisible && (
                        <Button variant="primary" onClick={handleShowConfirmation}>
                            Reload Assistants
                        </Button>
                    )}
                    {confirmVisible && (
                        <>
                            <span>Are you sure?</span>
                            <Button variant="danger" onClick={reloadAssistants} className="mx-2">
                                Yes, Reload
                            </Button>
                            <Button variant="secondary" onClick={handleHideConfirmation}>
                                Cancel
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
        </>
    );
}

export default AssistantsReloadPage;
