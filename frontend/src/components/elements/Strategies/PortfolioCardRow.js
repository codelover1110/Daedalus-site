import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import TradeIcon from '../img/tradeicon.png';


const PortfolioCardRow = (props) => {
  return (

    <Row style={{ color: "white", display: 'flex', justifyContent: 'space-between', padding: '0 15px' }}>
      <Col style={{ width: '20%' }}>
        {props.symbol}
      </Col>
      <Col style={{ width: '40%' }}>
        {props.quantity}
      </Col>
      <Col style={{ width: '15%' }}>
        <Image alt="tradIcon" src={TradeIcon} />
      </Col>
      <Col style={{ color: "blue", cursor: "pointer", width: '15%' }}>
        Trade
      </Col>
    </Row>


  );

}
export default PortfolioCardRow
