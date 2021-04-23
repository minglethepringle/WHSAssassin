import React, { Component } from 'react';
import firebase from "../../services/Firebase";
import Loading from '../loading/Loading';
import CurrentTarget from './CurrentTarget';
import SafeItem from './SafeItem';
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import logo from "../../images/WHSAssassin.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBook, faBookDead, faImages, faInfo, faListOl} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            showIntro: false,
            showBody: false,
            roundDetails: {
                safeitem: "",
                enddate: ""
            }
        }
    }

    async componentDidMount() {
        let _this = this;
        setTimeout(() => {
            _this.setState({showIntro: true, showBody: false});
        }, 500);

        setTimeout(() => {
            _this.setState({showIntro: false, showBody: true});
        }, 3500);

        let db = firebase.firestore();
        let doc = await db.collection("roundinfo").doc("roundinfo").get();
        this.setState({
            roundDetails: {
                safeitem: doc.data().safeitem,
                enddate: doc.data().enddate
            }
        });
        // const script = document.createElement("script");

        // script.src = "https://widget.tagembed.com/embed.min.js";
        // document.body.appendChild(script);
    }

    setShowBody(val) {
        this.setState({
            showIntro: false,
            showBody: val
        });
    }

    render() {
        return (
            <>
                <CSSTransition
                    in={this.state.showIntro}
                    timeout={1500}
                    classNames="homepage-intro"
                    unmountOnExit
                >
                    <div className="intro-div flex-center text-center">
                        <img src={logo} className="homepage-intro-img" />
                        <h3>Welcome to Senior Assassin,</h3>
                        <h1><b>{this.props.userDetails.firstName}</b>.</h1>
                    </div>
                </CSSTransition>

                <CSSTransition
                    in={this.state.showBody}
                    timeout={1500}
                    classNames="homepage-intro" // not sure why this works but i'll keep it
                    unmountOnExit
                >
                    <>
                    <div>
                        <div className="homepage-header text-center flex-row p-4">
                            <h2>Greetings, <b>{this.props.userDetails.firstName}.</b></h2>
                            <Link to="/logout"><Button variant="link"><small>Log Out</small></Button></Link>
                        </div>
                        <div className="p-3 homepage-body">
                            <div className="mb-3">
                                <Link to="/admin" className="w-100">
                                    {this.props.isAdmin ? <Button variant="danger" className="center float-center">Mod Panel</Button> : <></>}
                                </Link>
                            </div>

                            {!this.props.userDetails.eliminated ? 
                                <CurrentTarget targetUid={this.props.userDetails.currentTarget} />
                            : <></> 
                            }
                            
                            <div className="mb-3">
                                <Card bg="dark">
                                    <Card.Body className="text-center">
                                        <Card.Title><u>SAFE ITEM</u></Card.Title>
                                        <Card.Text>
                                        <h2><b>{this.state.roundDetails.safeitem.length > 0 ? this.state.roundDetails.safeitem : "NONE"}</b></h2>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>  

                            <Row>
                                <Col>
                                    <div className="mb-3 w-100">
                                        <Card bg="dark">
                                            <Card.Body className="text-center">
                                                <Card.Title><u>ASSASSINATIONS</u></Card.Title>
                                                <Card.Text>
                                                <h2><b>{this.props.userDetails.kills}</b></h2>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </div>   
                                </Col>
                                <Col>
                                    <div className="mb-3 w-100">
                                        <Card bg="dark">
                                            <Card.Body className="text-center">
                                                <Card.Title><u>ROUND END</u></Card.Title>
                                                <Card.Text>
                                                <h2><b>{this.state.roundDetails.enddate.length > 0 ? moment(this.state.roundDetails.enddate).format("MM/DD") : "N/A"}</b></h2>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </div>   
                                </Col>
                            </Row>
                        </div>

                        <div className="homepage-navbar d-flex flex-row">
                            <Col><Link to="/rules"><FontAwesomeIcon icon={faBook} /></Link></Col>
                            <Col><Link to="/gallery"><FontAwesomeIcon icon={faImages}/></Link></Col>
                            {!this.props.userDetails.eliminated ? 
                                <Col className="navbar-report-kill">
                                    <Link to="/reportkill"><FontAwesomeIcon icon={faBookDead}/></Link>
                                </Col>
                            : <></> 
                            }
                            <Col><Link to="/leaderboard"><FontAwesomeIcon icon={faListOl}/></Link></Col>
                            <Col><Link to="/about"><FontAwesomeIcon icon={faInfo}/></Link></Col>
                        </div>
                    </div>
                    </>
                </CSSTransition>
                
            </>
        );
    }
}
export default HomePage;