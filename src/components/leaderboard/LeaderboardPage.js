import React, { Component } from 'react';
import Loading from '../loading/Loading';
import firebase from "../../services/Firebase";
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class LeaderboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            leaderboard: []
        }
    }

    componentDidMount() {
        let leaderboard = [];

        let db = firebase.firestore();
        db.collection("users").orderBy("kills", "desc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                leaderboard.push(data);
            });
            this.setState({
                leaderboard: leaderboard,
                loading: false
            }); 
        });
    }

    renderLeaderboard() {
        let obj = [];
        this.state.leaderboard.forEach(user => {
            obj.push(
                <tr className={(this.props.currentUid == user.uid ? "highlighted" : "")}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.kills}</td>
                    <td>{user.eliminated ? "Yes" : "No"}</td>
                </tr>
            )
        });
        return obj;
    }

    render() {
        if(this.state.loading) return <Loading/>
        return (
        <>
            <div className="homepage-header text-center flex-row p-4 mb-3">
                <h1>Leaderboard</h1>
            </div>
            <div className="p-3">
                <Link to="/" className="w-100 center text-center mb-3">Go back</Link>

                <Table bordered className="text-white">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th># Kills</th>
                            <th>Eliminated?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderLeaderboard()}
                    </tbody>
                </Table>
            </div>

            
        </>
        );
    }
}
 
export default LeaderboardPage;