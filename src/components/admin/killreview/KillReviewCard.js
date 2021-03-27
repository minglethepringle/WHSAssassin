import React, { Component } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { UserDetailService } from '../../../services/UserDetailService';
import firebase from "../../../services/Firebase";
import { toast } from 'react-toastify';
class KillReviewCard extends Component {
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
        if(!window.confirm("Are you positive you want to confirm this assassination?")) return;
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
    
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    render() { 
        return (
            <>
                <Card className="bg-dark mb-3">
                    <Card.Body>
                        <div className="mb-3">
                            <div className="text-center w-100">
                                <p>Assassin: <b>{this.state.assassinName}</b></p>
                                <p>Target: <b>{this.state.targetName}</b></p>
                            </div>
                            <div className="center text-center">
                                <img src={this.props.kill.photo} style={{"width": "50%"}}/>
                            </div>
                        </div>

                        <Button className="w-100" size="lg" variant="secondary">Do Nothing</Button>
                        <Button className="w-100 mt-3" variant="danger" onClick={this.confirmKill}>Confirm Assassination</Button>
                    </Card.Body>
                </Card>
            </>
        );
    }
}
 
export default KillReviewCard;