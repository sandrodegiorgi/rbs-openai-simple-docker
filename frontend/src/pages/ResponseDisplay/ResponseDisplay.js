import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import './ResponseDisplay.css';

const ResponseDisplay = ({ response }) => {
    return (
        response && (
            <>
                <Card className="my-3">
                    <Card.Header as="h3">Assistant's Response</Card.Header>
                    <Card.Body>
                        <Card.Text className="response-container">
                            <ReactMarkdown
                                children={response}
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                            />
                        </Card.Text>
                    </Card.Body>
                </Card>
            </>
        )
    );
};

export default ResponseDisplay;
