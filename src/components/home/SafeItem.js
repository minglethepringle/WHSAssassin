import React, { Component } from 'react';
import firebase from "../../services/Firebase";
class SafeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            safeItem: ""
        }
    }

    componentDidMount() {
        let db = firebase.firestore();
        db.collection("safeitems").orderBy("timestamp", "desc").limit(1)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.setState({
                    safeItem: doc.data().itemName
                });
            });
        });
    }


    render() { 
        return <h1>{this.state.safeItem}</h1>;
    }
}
 
export default SafeItem;