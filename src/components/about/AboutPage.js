import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

const AboutPage = () => {
    return <>
        <div className="homepage-header text-center flex-row p-4 mb-3">
            <h1>About / FAQ</h1>
            <Link to="/" className="w-100 center text-center">Go back</Link>
        </div>
        <div className="p-3 text-center">
            <Card className="bg-dark text-white w-100 mb-3">
                <Card.Body>
                    <Card.Title>CHANGE THE ****ING SAFE ITEM</Card.Title>
                    <Card.Text>
                    I (Mingle) do not control the release of safe items. Meredith Prince and Sam Goldstone do, and they run on their own schedule, not yours. Just remain patient.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card className="bg-dark text-white w-100 mb-3">
                <Card.Body>
                    <Card.Title>When do safe items switch?</Card.Title>
                    <Card.Text>
                    Completely random times. It could be at 4AM, 11PM, or never.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card className="bg-dark text-white w-100 mb-3">
                <Card.Body>
                    <Card.Title>Can't you just see who has who?</Card.Title>
                    <Card.Text>
                    I could, but it takes a lot of effort and I'm lazy. Targets are stored not as names (e.g. "Mingle Li") but as obscure IDs (e.g. "2lkdsx7jz98d"). This makes it more difficult to look up who is who, and plus, that's 100% unfair, so I don't do it.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card className="bg-dark text-white w-100 mb-3">
                <Card.Body>
                    <Card.Title>How do I submit an assassination report?</Card.Title>
                    <Card.Text>
                    On the home page, click the big red button on the bottom bar. It has an icon of a book with a skull on it. You <u>DO NOT</u> need to DM the Instagram account.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card className="bg-dark text-white w-100 mb-3">
                <Card.Body>
                    <Card.Title>How does target switching work?</Card.Title>
                    <Card.Text>
                    First off, all targets are randomly assigned. At the end of each round, all players who have not gotten their target out will be eliminated. The rest of the people will be reassigned to a new target – your old target does not carry over.
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    </>;
}
 
export default AboutPage;