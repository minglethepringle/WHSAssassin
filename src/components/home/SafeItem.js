import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import firebase from "../../services/Firebase";
class SafeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            safeitem: ""
        }
    }

    async componentDidMount() {
        let db = firebase.firestore();
        let doc = await db.collection("roundinfo").doc("roundinfo").get();
        let safeitem = doc.data().safeitem;
        this.setState({
            safeitem: safeitem
        });
    }


    render() { 
        return (
        <div className="mb-3">
            <Card bg="dark">
                <Card.Body className="text-center">
                    <Card.Title><u>SAFE ITEM</u></Card.Title>
                    <Card.Text>
                    <h2><b>{this.state.safeitem.length > 0 ? this.state.safeitem : "NONE"}</b></h2>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>   
        );
    }
}
 
export default SafeItem;