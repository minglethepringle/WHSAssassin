import React, { Component } from 'react';
import { Form, Button } from "react-bootstrap";
import firebase from "../../services/Firebase";
import { toast } from "react-toastify"; 
import { Redirect } from 'react-router';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;

                if(user != null) {
                    firebase.firestore().collection("users").add({
                        uid: user.uid,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        currentTarget: "",
                        eliminated: false,
                        kills: 0,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    error: error.message
                });
            });
    }
      
    render() { 
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" name="firstName" onChange={this.handleChange} value={this.state.firstName}/>
                </Form.Group>
                
                <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" name="lastName" onChange={this.handleChange} value={this.state.lastName}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={this.handleChange} value={this.state.email}/>
                </Form.Group>
                
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password}/>
                </Form.Group>

                {this.state.error.length > 0 ? <p className="text-danger">{this.state.error}</p> : <></>}

                <Button variant="primary" type="submit">
                Submit
                </Button>
            </Form>
        );
    }
}
 
export default SignUp;