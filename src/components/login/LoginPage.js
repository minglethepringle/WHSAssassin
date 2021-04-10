import React, { Component } from 'react';
import { Form, Button } from "react-bootstrap";
import { Redirect } from 'react-router';
import logo from "../../images/WHSAssassin.png";
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
            <div className="text-center mb-5">
                <img src={logo} style={{"max-width": "300px"}}/>
                <h3><b>WHS SENIOR ASSASSIN</b></h3>
            </div>
            
            <div className="w-100 flex-center">
                <div className="login-form">
                    {this.state.showSignUp ? <SignUp/> : <SignIn/>}
                    <div className="text-center mt-3">
                        <Button variant="link" onClick={this.toggleSignUp}>{this.state.showSignUp ? "Go back to login" : "Create an account"}</Button>                        
                    </div>  

                </div>  

            </div>
            </>
        );
    }
}
export default LoginPage;