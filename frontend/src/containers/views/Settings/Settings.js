import React from 'react';
import GenericSection from '../../../components/sections/GenericSection';
import { connect } from 'react-redux';
import {Row, Col, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
class Settings extends React.Component {
  render() {
    return (
      <React.Fragment>
      <GenericSection topDivider>

<div style={{color:"white", fontSize:"60px"}}><h1>Settings</h1></div>
<Col style={{marginLeft:"15px", marginTop:"20px"}}>
<Row style={{color:"white", marginTop:"20px"}}>
Name: {this.props.user.firstname+" "+this.props.user.lastname}
</Row>
<Row style={{color:"white", marginTop:"20px"}}>
Email: {this.props.user.email}
</Row>
<Row style={{color:"white", marginTop:"20px"}}>
Subscription: {this.props.user.subscriptionTier}
<Link to="/Upgrade"> <Button> Upgrade </Button> </Link>
</Row>
</Col>
</GenericSection>
</React.Fragment>
    );
  }
}

function mapState(state) {
    const { user } = state.authentication;
    return { user };
}

export default connect(mapState, null)(Settings);
