import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { ToastContainer, Slide } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import firebase from "./services/Firebase";
import PrivateRoute from "./services/security/PrivateRoute";
import HomePage from "./components/home/HomePage";
import LoginPage from "./components/login/LoginPage";
import LogOut from "./components/login/LogOut";
import ReportKillPage from "./components/report-kill/ReportKillPage";
import Loading from "./components/loading/Loading";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      user: null,
      userDetails: null,
      loading: true
    }
  }

  componentDidMount() {
    this.setState({loading: true});

    let _this = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let db = firebase.firestore();
        db.collection("users").where("uid", "==", user.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                _this.setState({
                  authenticated: true,
                  user: user,
                  userDetails: doc.data(),
                  loading: false
                });
            });
        });
      } else {
        _this.setState({
          authenticated: false,
          user: null,
          userDetails: null,
          loading: false
        });
      }
      
    });
  }

  render() {
    if(this.state.loading) return <Loading/>;
    return (
      <>
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => this.state.authenticated === true
              ? <HomePage userDetails={this.state.userDetails}/>
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
              />
          )
          <Route path="/login">
            <LoginPage authenticated={this.state.authenticated}/>
          </Route>

          <Route path="/logout">
            <LogOut/>
          </Route>

          <Route path="/report-kill" render={(props) => (this.state.authenticated === true)
              ? <ReportKillPage userDetails={this.state.userDetails}/>
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
              />
          )

        </Switch>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false} 
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        transition={Slide}
        style={{
          marginTop: "1em"
        }} />
      </>
    );
  }
}

export default App;
