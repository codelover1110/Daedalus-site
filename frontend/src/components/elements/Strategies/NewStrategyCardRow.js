
import React from 'react';
import {Row,Col, Image} from 'react-bootstrap';
import ActivityBlue from '../img/ActivityBlue.png';


const NewStrategyCardRow = (props) =>{
  return (
    <div style= {{color:"white"}}>
    <Row>
    <Col>
    <Image style={{marginTop:"30px",marginLeft:"30px"}} src={ActivityBlue}/>
    </Col>
    <Col style={{marginTop:"-30px", marginLeft:"80px"}}>
    {props.name}
    </Col>


    <Col style={{color:"blue", cursor:"pointer",marginTop:"-32px",marginLeft:"500px"}}>
    Copy
    </Col>

    </Row>
    </div>

  );

}
export default NewStrategyCardRow
