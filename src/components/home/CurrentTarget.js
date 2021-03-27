import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
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
        return (
            <div className="mb-3">
                <Card bg="dark">
                    <Card.Body className="text-center">
                        <Card.Title><u>CURRENT TARGET</u></Card.Title>
                        <Card.Text>
                        <h1>{this.state.targetName.length > 0 ? this.state.targetName : "NONE"}</h1>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>    
        );
    }
}
 
export default CurrentTarget;