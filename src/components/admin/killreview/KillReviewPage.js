import React, { Component } from 'react';
import Loading from '../../loading/Loading';
import firebase from "../../../services/Firebase";
import KillReviewCard from './KillReviewCard';
import { Link } from 'react-router-dom';
class KillReviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            killCards: []
        }
    }

    componentDidMount() {
        this.setState({loading: true});

        let killCards = [];

        let db = firebase.firestore();
        db.collection("kills").where("modConfirmed", "==", false)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                data["docId"] = doc.id;
                killCards.push(data);
            });
            this.setState({
                killCards: killCards,
                loading: false
            }); 
        });
    }

    displayKillCards() {
        let obj = [];
        this.state.killCards.forEach((kill) => {
            obj.push(<KillReviewCard kill={kill}/>)
        });
        return obj;
    }

    render() { 
        if(this.state.loading) return <Loading/>;
        return (
            <>
            <div className="p-5">
                <div className="homepage-header text-center flex-row p-4 mb-3">
                    <h1>Kill Review</h1>
                </div>
                <Link to="/admin" className="w-100 center text-center mb-3">Go Back</Link>
                <div className="">
                {this.displayKillCards()}
                </div>
            </div>
            </>
        );
    }
}
 
export default KillReviewPage;