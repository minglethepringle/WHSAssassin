import React, { Component } from 'react';
import firebase from "../../services/Firebase";
class CurrentTarget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetName: ""
        }
    }

    componentDidMount() {
        if(this.props.targetUid == null || this.props.targetUid.length <= 0) return;

        let db = firebase.firestore();
        db.collection("users").where("uid", "==", this.props.targetUid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.setState({
                    targetName: `${doc.data().firstName} ${doc.data().lastName}`,
                });
            });
        });
    }


    render() { 
        return <h1>{this.state.targetName}</h1>;
    }
}
 
export default CurrentTarget;