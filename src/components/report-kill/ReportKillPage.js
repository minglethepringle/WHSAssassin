import React, { Component } from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";
import firebase from "../../services/Firebase";
import Loading from '../loading/Loading';
import { toast } from 'react-toastify';

class ReportKillPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assassinUid: this.props.userDetails.uid,
            targetUid: "",
            photoFile: null,
            photoDataUrl: null,
            loading: true
        }
        this.handleTargetChange = this.handleTargetChange.bind(this);
        this.setFile = this.setFile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true});
        let db = firebase.firestore();
        db.collection("users").where("eliminated", "==", false).where("uid", "!=", this.props.userDetails.uid)
        .get()
        .then((querySnapshot) => {
            let dropdownOptions = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                dropdownOptions.push({
                    name: data.firstName + " " + data.lastName,
                    value: data.uid
                });
            });
            this.setState({
                allTargets: dropdownOptions,
                loading: false
            });
        });
    }

    handleTargetChange(value) {
        this.setState({
            targetUid: value
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
        return <>
            <div className="homepage-header text-center flex-row p-4 mb-3">
                <h1>Report Assassination</h1>
            </div>

            <div className="p-5 w-75 center">
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
                            <Form.Control type="text" readOnly value={this.props.userDetails.firstName + " " + this.props.userDetails.lastName} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm="2">
                        Photo
                        </Form.Label>
                        <Col sm="10">
                            <Form.File accept="image/*" capture onChange={(e) => {this.setFile(e.target.files[0])}}/>
                        </Col>
                    </Form.Group>

                    <div className="d-flex flex-center mb-3">
                        <img src={this.state.photoDataUrl} className="kill-selfie"/>
                    </div>
                    

                    <div className="d-flex flex-center">
                        <Button variant="secondary" className="mr-2" type="button" onClick={() => window.location.href = "/"}>Cancel</Button>
                        <Button variant="primary" className="ml-2" type="submit">Submit</Button>
                    </div>
                </Form>
            </div>
        </>;
    }
}
 
export default ReportKillPage;