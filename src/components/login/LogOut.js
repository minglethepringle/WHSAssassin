import { Redirect } from "react-router";
import firebase from "../../services/Firebase";

export default function LogOut() {
    firebase.auth().signOut()
    return (
        <Redirect to="/"/>
    );
}