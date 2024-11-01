import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function BackToAssistants () {
    return (
        <>
            <Link to="/assistants">Back to Assistants</Link>
        </>
    );
}

export default BackToAssistants;
