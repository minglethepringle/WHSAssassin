import React, { Component } from 'react';
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import firebase from "../../services/Firebase";
import Loading from '../loading/Loading';
class AdminPanelPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            numNewKills: -1,
            loading: true
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        let db = firebase.firestore();
        db.collection("kills").where("modConfirmed", "==", false)
        .get()
        .then((querySnapshot) => {
            this.setState({
                numNewKills: querySnapshot.size,
                loading: false
            });
        });
    }

    resetEverything() {
        if(window.confirm("Are you sure you want to reset everything?") && window.confirm("Are you absolutely positive? This action is irreversible.")) {
            let db = firebase.firestore();
            db.collection("users").get().
            then((querySnapshot) => {
                let userArr = [];
                querySnapshot.forEach((doc) => {
                    userArr.push(doc.data());
                });

                userArr.forEach(user => {
                    db.collection("users").doc(user.uid).update({
                        currentTarget: "",
                        eliminated: false,
                        kills: 0
                    });
                });

                toast.success("Reset everything!");
            });
        }
    }

    noKillEliminate() {
        if(window.confirm("Are you sure you want to eliminate people with no kills?") && window.confirm("Are you absolutely positive? This action is irreversible.")) {
            let db = firebase.firestore();
            db.collection("users").where("eliminated", "==", false).get().
            then((querySnapshot) => {
                let userArr = [];
                querySnapshot.forEach((doc) => {
                    userArr.push(doc.data());
                });

                userArr.forEach(user => {
                    if(user.roundStartTarget == user.currentTarget) {
                        db.collection("users").doc(user.uid).update({
                            currentTarget: "",
                            eliminated: true
                        });
                    }
                });

                toast.success("Eliminated all with no change in kills!");
            });
        }
    }

    resetTargets() {
        if(window.confirm("Are you sure you want to reset all targets?") && window.confirm("Are you absolutely positive? This action is irreversible.")) {
            let db = firebase.firestore();
            db.collection("users").where("eliminated", "==", false).orderBy("timestamp", "desc").get().
            then((querySnapshot) => {
                let size = querySnapshot.size;
                let userArr = [];
                querySnapshot.forEach((doc) => {
                    userArr.push(doc.data());
                });
                let randomOffset = Math.floor(Math.random() * (size - 1)) + 1; // if 10 users, random offset is [1, 9]
                
                // Create new arr for editing
                let updatedArr = JSON.parse(JSON.stringify(userArr));
                for(let killerIndex = 0; killerIndex < userArr.length; killerIndex++) {
                    let targetIndex;
                    if(killerIndex + randomOffset >= size) {
                        targetIndex = (killerIndex + randomOffset) % size;
                    } else {
                        targetIndex = killerIndex + randomOffset;
                    }
                    let killerObj = JSON.parse(JSON.stringify(userArr[killerIndex]));
                    killerObj.currentTarget = userArr[targetIndex].uid;

                    updatedArr[killerIndex] = killerObj;
                }

                // Update database
                updatedArr.forEach(user => {
                    db.collection("users").doc(user.uid).update({
                        currentTarget: user.currentTarget,
                        roundStartTarget: user.currentTarget
                    });
                });
            });

            db.collection("users").where("eliminated", "==", true).get()
            .then((querySnapshot) => {
                let userArr = [];
                querySnapshot.forEach((doc) => {
                    userArr.push(doc.data());
                });
                // Update database
                userArr.forEach(user => {
                    db.collection("users").doc(user.uid).update({
                        currentTarget: ""
                    });
                });
                toast.success("Reset all targets and reassigned!");
            });
        }
    }

    render() { 
        if(this.state.loading) return <Loading />;
        return (<>
            <div className="homepage-header text-center flex-row p-4 mb-3">
                <h1>Moderator Panel</h1>
            </div>
            <div className="p-3">
                <Link to="/" className="w-100 center text-center mb-3">Go back</Link>

                <Jumbotron fluid className="bg-dark text-center">
                    <Container> 
                        {this.state.numNewKills > 0 ? 
                            <h3>There are <Link to="/admin/killreview">{this.state.numNewKills} new assassinations</Link> to confirm!</h3>
                            :
                            <h3>There are no new assassinations.</h3>
                        }
                    </Container>
                </Jumbotron>
                
                <Row className="mb-3">
                    <Col className="mb-3">
                        <Link to="/admin/roundinfo" className="w-100"><Button variant="secondary" size="lg" className="p-5 w-100">Edit Round Details</Button></Link>
                    </Col>
                    <Col className="mb-3">
                        <Link to="/admin/pastkills" className="w-100"><Button variant="secondary" size="lg" className="p-5 w-100">See Past Kills</Button></Link>
                    </Col>
                </Row>
                
                <br/>
                <br/>
                <br/>
                
                <div className="center text-center w-75">
                    <p><b>ROUND ENDS CHECKLIST:</b></p>
                    <ol>
                        <li><Button variant="link" className="p-0 mb-3" onClick={this.noKillEliminate}>Eliminate No-Kill Players</Button></li>
                        <li><Button variant="link" className="p-0 mb-3" onClick={this.resetTargets}>Reassign Targets For Everyone</Button></li>
                        <li><Link to="/admin/roundinfo">Edit Round Details</Link></li>
                    </ol>
                </div>
                
                <Button variant="link" className="center text-danger" onClick={this.resetEverything}>Clear Targets, Eliminations, Kills from Everyone</Button>
            </div>
            
        </>);
    }
}
 
export default AdminPanelPage;