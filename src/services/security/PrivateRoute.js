import React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
    Redirect,
  } from "react-router-dom";

export default function PrivateRoute({ component: Component, authenticated, ...rest }) {
    debugger;
    return (
        <Route
        {...rest}
        render={(props) => authenticated === true
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
            />
        )
}