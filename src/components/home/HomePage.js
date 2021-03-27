import React, { Component } from 'react';
import firebase from "../../services/Firebase";
import Loading from '../loading/Loading';
import CurrentTarget from './CurrentTarget';
import SafeItem from './SafeItem';
import { Button } from "react-bootstrap";
import { Link } from 'react-router-dom';


class HomePage extends Component {
    constructor(props) {
        super(props);
     
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <>
                <h1>Hello, {this.props.userDetails.firstName}</h1>

                <h2>Current Target: </h2>
                <CurrentTarget targetUid={this.props.currentTarget} />

                <h2>Safe item:</h2>
                <SafeItem/>

                <h3>Num kills: {this.props.userDetails.kills}</h3>
                <h3>Time left until next round: </h3>

                <hr/>
                <Link to="/report-kill">
                    <Button variant="primary">Report Kill</Button>
                </Link>
            </>
        );
    }
}
export default HomePage;