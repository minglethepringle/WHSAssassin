import React, { Component } from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";
import firebase from "../../services/Firebase";
import Loading from '../loading/Loading';
import { toast } from 'react-toastify';
import { UserDetailService } from '../../services/UserDetailService';
import { Link } from 'react-router-dom';

class ReportKillPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidTarget: false,
            assassinUid: this.props.userDetails.uid,
            targetName: "",
            targetUid: "",
            photoFile: null,
            photoDataUrl: null,
            error: "",
            disableSubmit: false,
            loading: true
        }
        this.setFile = this.setFile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let currentTarget = this.props.userDetails.currentTarget;
        if(currentTarget == null || currentTarget.length == 0) {
            this.setState({
                invalidTarget: true,
                loading: false
            });
            return;
        }

        this.setState({loading: true});

        UserDetailService.getNameFromUid(currentTarget).then((targetName) => {
            this.setState({
                loading: false,
                targetName: targetName,
                targetUid: currentTarget
            });
        });
    }

    setFile(file) {
        this.setState({
            photoFile: file,
            photoDataUrl: URL.createObjectURL(file)
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        if(this.state.photoFile == null || this.state.photoDataUrl == null) { 
            this.setState({
                error: "You must submit a selfie to go along with the assassination report!"
            });
            return;
        } else {
            this.setState({
                error: ""
            });
        }

        this.setState({
            disableSubmit: true
        });

        // Upload photo
        var photoRef = firebase.storage().ref().child(this.state.photoFile.name);
        photoRef.put(this.state.photoFile).then(() => {
            photoRef.getDownloadURL().then((url) => {
                firebase.firestore().collection("kills").add({
                    assassin: this.state.assassinUid,
                    target: this.state.targetUid,
                    photo: url,
                    modConfirmed: false,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    toast.success("Assassination submitted for confirmation.");
                    toast.info("Redirecting in 5 seconds...")
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 5000); 
                });
            });
        });
    }


    render() { 
        if(this.state.loading) return <Loading/>
        if(this.state.invalidTarget) {
            return (
                <div className="p-3 text-center center">
                    <h3>You have no target assigned to assassinate.</h3>
                    <Link to="/" className="w-100 center text-center mb-3">Go back</Link>
                </div>
            )
        }
        return <>
            <div className="homepage-header text-center flex-row p-4 mb-3">
                <h1>Report Assassination</h1>
            </div>

            <div className="p-3 w-75 center">
                <Link to="/" className="w-100 center text-center mb-3">Go back</Link>
                {this.state.error.length > 0 ? <p className="text-danger">{this.state.error}</p> : <></>}

                <Form onSubmit={this.handleSubmit}>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">
                        Assassin
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" readOnly value={this.props.userDetails.firstName + " " + this.props.userDetails.lastName} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm="2">
                        Target
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" readOnly value={this.state.targetName} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm="2">
                        Photo
                        </Form.Label>
                        <Col sm="10">
                            <Form.File accept="image/*" onChange={(e) => {this.setFile(e.target.files[0])}}/>
                        </Col>
                    </Form.Group>

                    <div className="d-flex flex-center mb-3">
                        <img src={this.state.photoDataUrl} className="kill-selfie"/>
                    </div>

                    <div className="d-flex flex-center mb-5">
                        <Button variant="secondary" className="mr-2" type="button" onClick={() => window.location.href = "/"}>Cancel</Button>
                        <Button variant="danger" className="ml-2" type="submit" disabled={this.state.disableSubmit}>Report Kill</Button>
                    </div>

                    <div className="text-center">
                        <small>Please click Report Kill and wait a couple seconds for submission!</small>
                    </div>
                    
                </Form>
            </div>
        </>;
    }
}
 
export default ReportKillPage;