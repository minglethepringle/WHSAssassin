import { Link } from "react-router-dom";

const RulesPage = () => {
    return <>
        <Link to="/" className="w-100 center text-center mt-3 mb-3">Go back</Link>
        <iframe className="w-100 h-100" frameBorder="0" src="https://docs.google.com/document/d/e/2PACX-1vSPCQIrnXwjGGSwYgC7U-68DhbqGihkt1zY-NDDrLnsutq1gPy_RVTRRgF-YlyoVW31G16JqCUTQ2c3/pub?embedded=true"></iframe>
    </>;
}
 
export default RulesPage;