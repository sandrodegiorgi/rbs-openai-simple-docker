import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';

import {
    label_reload_assistants, label_reload_assistants_confirm, label_reload_assistants_cancel,
    tooltip_reload_assistants, 
    text_reload_assistants_are_you_sure,
    default_tooltip_show, default_tooltip_hide
} from './../../Consts';


function AssistantsReloadPage({ reloadAssistants }) {
    const [confirmVisible, setConfirmVisible] = useState(false);

    const handleShowConfirmation = () => setConfirmVisible(true);
    const handleHideConfirmation = () => setConfirmVisible(false);

    return (
        <>
            <Row className="justify-content-md-center mt-3">
                <Col xs={12}>
                    {!confirmVisible && (
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: default_tooltip_show, hide: default_tooltip_hide }}
                            overlay={<Tooltip className="custom-tooltipper">{tooltip_reload_assistants}</Tooltip>}
                        ><Button variant="primary" onClick={handleShowConfirmation}>
                                {label_reload_assistants}
                            </Button>
                        </OverlayTrigger>
                    )}
                    {confirmVisible && (
                        <>
                            <span>{text_reload_assistants_are_you_sure}</span>
                            <Button variant="danger" onClick={reloadAssistants} className="mx-2">
                                {label_reload_assistants_confirm}
                            </Button>
                            <Button variant="secondary" onClick={handleHideConfirmation}>
                                {label_reload_assistants_cancel}
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
        </>
    );
}

export default AssistantsReloadPage;
