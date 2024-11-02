import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function BackToAssistants() {
    return (
        <>
            <div className="mt-3">
                <Link className="my-3" to="/">Back to Assistants</Link>
            </div>
        </>
    );
}

export default BackToAssistants;
