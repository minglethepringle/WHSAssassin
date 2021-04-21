import { Link } from "react-router-dom";

const AboutPage = () => {
    return <>
        <div className="homepage-header text-center flex-row p-4 mb-3">
            <h1>About WHSAssassin</h1>
            <Link to="/" className="w-100 center text-center">Go back</Link>
        </div>
        <div className="p-3 text-center">
            

            <h2>Created by Mingle Li</h2>
            <h4>Class of 2021</h4>
        </div>
    </>;
}
 
export default AboutPage;