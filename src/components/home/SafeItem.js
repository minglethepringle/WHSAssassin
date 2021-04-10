import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import firebase from "../../services/Firebase";
class SafeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            safeItem: ""
        }
    }

    componentDidMount() {
        let db = firebase.firestore();
        db.collection("safeitems").orderBy("timestamp", "desc").limit(1)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.setState({
                    safeItem: doc.data().itemName
                });
            });
        });
    }


    render() { 
        return (
        <div className="mb-3">
            <Card bg="dark">
                <Card.Body className="text-center">
                    <Card.Title><u>SAFE ITEM</u></Card.Title>
                    <Card.Text>
                    <h2><b>{this.state.safeItem.length > 0 ? this.state.safeItem : "NONE"}</b></h2>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>   
        );
    }
}
 
export default SafeItem;