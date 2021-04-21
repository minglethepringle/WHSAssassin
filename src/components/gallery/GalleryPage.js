import React, { Component } from "react";
import Loading from "../loading/Loading";
import firebase from "../../services/Firebase";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserDetailService } from "../../services/UserDetailService";

class GalleryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            imgArr: []
        }
    }
    
    componentDidMount() {
        let imgArr = [];

        let _this = this;
        let db = firebase.firestore();
        db.collection("kills")
        .where("modConfirmed", "==", true)
        .orderBy("timestamp", "desc")
        .limit(20)
        .get()
        .then((querySnapshot) => {
            let photoData = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                photoData.push({
                    photo: data.photo,
                    assassin: data.assassin,
                    target: data.target 
                });
            });
            
            photoData.forEach((data) => {
                UserDetailService.getNameFromUid(data.assassin)
                .then(assassin => {
                    UserDetailService.getNameFromUid(data.target)
                    .then(target => {
                        imgArr.push(
                            <Col xs="12" sm="6" md="4">
                                <img src={data.photo} className="w-100 mb-1 border border-danger"/>
                                <p>{assassin} ☠️ {target}</p>
                            </Col>
                        );
                        _this.setState({
                            imgArr: imgArr
                        });
                    });
                });
            });
        }).then(() => {
            _this.setState({
                loading: false
            });
        });
    }

    render() {
        if(this.state.loading) return <Loading/>
        return <>
            <div className="homepage-header text-center flex-row p-4 mb-3">
                <h1>Kill Feed</h1>
                <Link to="/" className="w-100 center text-center">Go back</Link>
            </div>
            <div className="p-3 text-center">
                {this.state.imgArr}
            </div>
        </>
    }
}
 
export default GalleryPage;