import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import { UserDetailService } from '../../../services/UserDetailService';
import firebase from "../../../services/Firebase";
import { toast } from 'react-toastify';
class PastKillCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assassinName: "",
            targetName: ""
        }
        this.confirmKill = this.confirmKill.bind(this);
    }

    componentDidMount() {
        UserDetailService.getNameFromUid(this.props.kill.assassin).then((assassinName) => {
            UserDetailService.getNameFromUid(this.props.kill.target).then((targetName) => {
                this.setState({
                    assassinName: assassinName,
                    targetName: targetName
                });
            });
        });
    }

    async confirmKill() {
        let docId = this.props.kill.docId;
        let db = firebase.firestore();

        db.collection("kills").doc(docId).update({
            modConfirmed: true
        });

        let target = await db.collection("users").doc(this.props.kill.target).get();
        let targetTarget = target.data().currentTarget;

        db.collection("users").doc(this.props.kill.assassin).update({
            kills: firebase.firestore.FieldValue.increment(1),
            currentTarget: targetTarget
        });

        db.collection("users").doc(this.props.kill.target).update({
            eliminated: true
        });

        toast.success("Assassination confirmed!");
        this.props.clear();
    }

    render() { 
        return (
            <>
                <Card >
                    <Card.Body>
                        <p>Assassin: {this.state.assassinName}</p>
                        <p>Target: {this.state.targetName}</p>
                        <p>Photo:</p>
                        <img src={this.props.kill.photo}/>

                        <Button variant="secondary">Do Nothing</Button>
                        <Button variant="primary" onClick={this.confirmKill}>Confirm Assassination</Button>
                    </Card.Body>
                </Card>
            </>
        );
    }
}
 
export default PastKillCard;