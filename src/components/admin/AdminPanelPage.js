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

    resetTargets() {
        if(window.confirm("Are you sure you want to reset all targets?") && window.confirm("Are you absolutely positive? This action is irreversible.")) {
            let db = firebase.firestore();
            db.collection("users").where("eliminated", "==", false).orderBy("timestamp", "desc").get().
            then((querySnapshot) => {
                debugger;
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
                        currentTarget: user.currentTarget
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
            <Link to="/" className="w-100 center text-center mb-3">Go back</Link>
            <div className="p-5">
                <Jumbotron fluid className="bg-dark text-center">
                    <Container> 
                        {this.state.numNewKills > 0 ? 
                            <h1>You have <Link to="/admin/killreview">{this.state.numNewKills} new assassinations</Link> to confirm!</h1>
                            :
                            <h1>You have no new assassinations.</h1>
                        }
                    </Container>
                </Jumbotron>
                
                <Row className="mb-3">
                    <Col>
                        <Link to="/admin/safeitem" className="w-100"><Button variant="secondary" size="lg" className="p-5 w-100">Change Safe Item</Button></Link>
                    </Col>
                    <Col>
                        <Link to="/admin/pastkills" className="w-100"><Button variant="secondary" size="lg" className="p-5 w-100">See Past Kills</Button></Link>
                    </Col>
                </Row>
                
                <br/>
                <br/>
                <br/>
                
                <Button variant="link" className="center" onClick={this.resetTargets}>Reset Targets For Everyone</Button>
            </div>
            
        </>);
    }
}
 
export default AdminPanelPage;