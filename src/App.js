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
import KillReviewPage from "./components/admin/killreview/KillReviewPage";
import SafeItemPage from "./components/admin/SafeItemPage";
import PastKillsPage from "./components/admin/pastkills/PastKillsPage";
import AdminPanelPage from "./components/admin/AdminPanelPage";
import LeaderboardPage from "./components/leaderboard/LeaderboardPage";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      user: null,
      userDetails: null,
      loading: true
    }

    this.isAdmin = this.isAdmin.bind(this);
  }

  componentDidMount() {
    this.setState({loading: true});

    let _this = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let db = firebase.firestore();
        db.collection("users").doc(user.uid)
        .get()
        .then((doc) => {
          _this.setState({
            authenticated: true,
            user: user,
            userDetails: doc.data(),
            loading: false
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

  isAdmin() {
    let adminArr = process.env.REACT_APP_ADMINS.split(",");
    return this.state.authenticated === true && adminArr.includes(this.state.user.email)
  }

  render() {
    if(this.state.loading) return <Loading/>;
    return (
      <>
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => this.state.authenticated === true
              ? <HomePage userDetails={this.state.userDetails} isAdmin={this.isAdmin()}/>
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
              />
          )
          <Route path="/login">
            <LoginPage authenticated={this.state.authenticated}/>
          </Route>

          <Route path="/logout">
            <LogOut/>
          </Route>

          <Route path="/reportkill" render={(props) => (this.state.authenticated === true)
              ? <ReportKillPage userDetails={this.state.userDetails}/>
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
              />

          <Route path="/leaderboard" render={(props) => (this.state.authenticated === true)
              ? <LeaderboardPage currentUid={this.state.userDetails.uid}/>
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
              />

          <Route path="/admin" render={(props) => this.isAdmin()
              ? (
                <>
                <Route exact path="/admin" component={AdminPanelPage} />
                <Route path="/admin/killreview" component={KillReviewPage} />
                <Route path="/admin/safeitem" component={SafeItemPage} />
                <Route path="/admin/pastkills" component={PastKillsPage} />
                </>
              )
              : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
              />

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
