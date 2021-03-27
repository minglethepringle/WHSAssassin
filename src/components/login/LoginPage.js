import React, { Component } from 'react';
import { Form, Button } from "react-bootstrap";
import { Redirect } from 'react-router';
import SignIn from './SignIn';
import SignUp from './SignUp';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSignUp: false
        }
        this.toggleSignUp = this.toggleSignUp.bind(this);
    }

    toggleSignUp() {
        this.setState({
            showSignUp: !this.state.showSignUp
        });
    }

    render() {
        if(this.props.authenticated) {
            return (
                <Redirect to={{ pathname: '/' }} />    
            );
        }
        return (
            <>
            {this.state.showSignUp ? <SignUp/> : <SignIn/>}
            <Button variant="link" onClick={this.toggleSignUp}>{this.state.showSignUp ? "Go back to login" : "Create an account"}</Button>
            </>
        );
    }
}
export default LoginPage;