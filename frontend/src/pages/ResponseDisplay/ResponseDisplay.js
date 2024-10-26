import Card from 'react-bootstrap/Card';

const ResponseDisplay = ({ response }) => {
    return (
        response && (
            <Card className="my-3">
                <Card.Header as="h3">Assistant's Response</Card.Header>
                <Card.Body>
                    <Card.Text>{response}</Card.Text>
                </Card.Body>
            </Card>
        )
    );
};

export default ResponseDisplay;
