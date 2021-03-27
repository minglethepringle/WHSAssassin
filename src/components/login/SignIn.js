import React, { Component } from 'react';
import { Form, Button } from "react-bootstrap";
import firebase from "../../services/Firebase";
import { toast } from "react-toastify"; 

class SignIn extends Component {
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
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch((error) => {
                this.setState({
                    error: error.message
                });
            });
    }

    render() { 
        return ( 
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={this.handleChange} value={this.state.email}/>
                </Form.Group>
                
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" name="password" onChange={this.handleChange} value={this.state.password}/>
                </Form.Group>

                {this.state.error.length > 0 ? <p className="text-danger">{this.state.error}</p> : <></>}

                <div className="text-center">
                    <Button variant="primary" type="submit">
                    Sign In
                    </Button>
                </div>  
            </Form>
        );
    }
}
 
export default SignIn;