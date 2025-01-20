import { Card } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import './InteractionsDisplay.css';

function InteractionsDisplay({ interactions }) {
    return (
        <>
            {interactions
                .filter((interaction) => interaction.role !== "system")
                .map((interaction, index) => (
                    <Card
                        key={index}
                        className="my-3"
                        style={{
                            width: "90%",
                            marginLeft: interaction.role === "assistant" ? "0" : "auto",
                            marginRight: interaction.role === "assistant" ? "auto" : "0",
                            border: interaction.role === "user" ? "1px solid black" : "1px solid #e0e0e0",
                        }}
                    >
                        <Card.Body style={{ position: "relative" }}>
                            <div
                                style={{
                                    position: "absolute",
                                    top: "0",
                                    right: "0",
                                    fontSize: "0.7rem",
                                    color: "grey",
                                    padding: "5px",
                                }}
                            >
                                {interaction.created_at} - {interaction.model} - {interaction.role}
                            </div>

                            {/* Content */}
                            <ReactMarkdown
                                children={interaction.content.replace(/\[NEWLINE\]/g, '\n')}
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                                skipHtml={false}
                            />
                        </Card.Body>
                    </Card>
                ))}
        </>
    );
}

export default InteractionsDisplay;
