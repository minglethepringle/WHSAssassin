import moment from 'moment';
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import firebase from "../../../services/Firebase";
import { UserDetailService } from '../../../services/UserDetailService';
class PastKillsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            killCards: [],
            loading: true
        }
    }

    componentDidMount() {
        this.setState({loading: true});

        let killCards = [];

        let db = firebase.firestore();
        db.collection("kills")
        .where("modConfirmed", "==", true)
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                killCards.push(data);
            });
            this.setState({
                killCards: killCards,
                loading: false
            });
            
            this.renderKills();
        });
    }

    formatTimestamp(timestamp) {
        let seconds = timestamp.seconds;
        return moment.unix(seconds).format("YYYY-MM-DD HH:mm A");
    }

    renderKills = async() => {
        let obj = [];
        let _this = this;
        this.state.killCards.forEach(async (kill) => {
            let assassinName = await UserDetailService.getNameFromUid(kill.assassin);
            let targetName = await UserDetailService.getNameFromUid(kill.target);
            obj.push(
                <tr>
                    <td>{assassinName}</td>
                    <td>{targetName}</td>
                    <td>{_this.formatTimestamp(kill.timestamp)}</td>
                    <td width="1"><img src={kill.photo} width="100px"/></td>
                    <td><a href={kill.photo} target="_blank" download>Download Photo</a></td>
                </tr>
            );
            this.setState({
                killsList: obj
            });
        });
    }

    render() { 
        return (
            <>
            <div className="homepage-header text-center flex-row p-4 mb-3">
                <h1>Past Assassinations</h1>
                <Link to="/admin" className="w-100 center text-center">Go Back</Link>
            </div>
            <div className="p-1">
                <Table bordered responsive className="text-white">
                    <thead>
                        <tr>
                            <th>Assassin</th>
                            <th>Target</th>
                            <th>Date/Time</th>
                            <th>Photo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.killsList}
                    </tbody>
                </Table>
            </div>
            </>
        );
    }
}
 
export default PastKillsPage;