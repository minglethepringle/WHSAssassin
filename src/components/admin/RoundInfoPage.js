import moment from 'moment';
import React, { Component } from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import firebase from "../../services/Firebase";
import Loading from '../loading/Loading';
class RoundInfoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            safeitem: "",
            enddate: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        let db = firebase.firestore();
        let doc = await db.collection("roundinfo").doc("roundinfo").get();
        let safeitem = doc.data().safeitem, enddate = doc.data().enddate;
        this.setState({
            safeitem: safeitem,
            enddate: enddate.length > 0 ? moment(enddate).toDate() : "",
            loading: false
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    handleDateChange(value) {
        this.setState({
            enddate: value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        if(this.state.safeitem.length <= 0 || this.state.enddate.length <= 0) {
            toast.warn("You must complete the form!");
            return;
        }

        let formattedEndDate = moment(this.state.enddate).format("MM/DD/YYYY");

        let db = firebase.firestore();
        db.collection("roundinfo").doc("roundinfo").update({
            safeitem: this.state.safeitem,
            enddate: formattedEndDate
        }).then(() => {
            toast.success("Updated round details!");
        });
    }

    render() { 
        if(this.state.loading) return <Loading/>
        return (
        <>
            <div className="homepage-header text-center flex-row p-4 mb-3">
                <h1>Round Details Page</h1>
                <Link to="/admin" className="w-100 center text-center">Go back</Link>
            </div>
            <div className="p-3">
                <Form onSubmit={this.handleSubmit} className="w-75 text-center center">
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">
                        Safe Item
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" name="safeitem" value={this.state.safeitem} onChange={this.handleChange}/>
                        </Col>  
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm="2">
                        End Date
                        </Form.Label>
                        <Col sm="10">
                            <DatePicker className="form-control" minDate={new Date()} selected={this.state.enddate} onChange={this.handleDateChange} />
                        </Col>  
                    </Form.Group>

                    <div className="d-flex flex-center">
                        <Button variant="danger" className="ml-2" type="submit">Submit</Button>
                    </div>
                </Form>
            </div>

            
        </>
        );
    }
}
 
export default RoundInfoPage;