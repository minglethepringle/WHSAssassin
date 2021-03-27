import React, { Component } from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";
import firebase from "../../services/Firebase";
import SelectSearch, { fuzzySearch } from 'react-select-search';
import Loading from '../loading/Loading';
import { toast } from 'react-toastify';

class ReportKillPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTargets: [],
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
                });
            });
        });
    }


    render() { 
        if(this.state.loading) return <Loading/>
        return <>
            <h1>Report Assassination</h1>
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
                    <SelectSearch
                        options={this.state.allTargets}
                        search
                        filterOptions={fuzzySearch}
                        placeholder="Select your target"
                        onChange={this.handleTargetChange}
                    />
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

                <img src={this.state.photoDataUrl}/>

                <Button variant="secondary" type="button" onClick={() => window.location.href = "/"}>Cancel</Button>
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </>;
    }
}
 
export default ReportKillPage;