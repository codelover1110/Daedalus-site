import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NewStrategyCardRow from "./NewStrategyCardRow";
import MyStrategiesCardRow from "./MyStrategiesCardRow";
import AssetsIcon from "../img/AssetsIcon.png";
import { connect } from "react-redux";
import { strategyActions } from "../../../store/_actions";
const StrategyCard = ({
  data,
  name,
  type,
  title,
  strategiesList,
  setActiveStrategy,
  activeStrategyAction,
  color,
  buttonText,
}) => {
  const navigate = useNavigate();
  let bgColor = "#6FCF97";
  bgColor = color;
  let linkURL = "/";
  let header;
  let content;
  let HeaderIcon;

  if (title == "Current Portfolio") {
    linkURL = "/MyPortfolio";
    HeaderIcon = AssetsIcon;

    header = (
      <div style={{ marginTop: "10px" }}>
        <Row
          style={{
            color: "white",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 15px",
            textAlign: "center",
          }}
        >
          <Col style={{ width: "20%" }}> Symbol</Col>
          <Col style={{ width: "40%" }}> Quantity </Col>
          <Col style={{ width: "15%" }}>&nbsp;</Col>
          <Col style={{ width: "15%" }}>&nbsp;</Col>
        </Row>
      </div>
    );
  }
  if (title == "My Strategies") {
    linkURL = "/MyStrategies";

  
    content = (
      <div>
        <MyStrategiesCardRow
          quantity={"5"}
          strategiesList={strategiesList}
          template={false}
          setActiveStrategy={setActiveStrategy}
        />
      </div>
    );
  }
  if (title == "New Strategy") {
    linkURL = "/CreateStrategy";

  
    content = (
      <div>
        <MyStrategiesCardRow
          quantity={"5"}
          template={true}
          strategiesList={strategiesList}
          setActiveStrategy={setActiveStrategy}
        />
      </div>
    );
  }

  
  const showButton = strategiesList?.length > 4 || title === "New Strategy";
  return (
    <div
      style={{
        backgroundColor: "#212329",
        width: "600px",
        height: "566px",
        borderRadius: "15px",
        paddingTop: "20px",
        borderRadius: "15px",
      }}
    >
      <div
        style={{
          width: "600px",
          height: "100px",
          backgroundColor: bgColor,
          borderRadius: "15px",
          marginTop: "-20px",

        }}
      ></div>
      <div
        style={{
          width: "600px",
          height: "100px",
          backgroundColor: bgColor,
          marginTop: "-60px",

        }}
      >
        <div
          style={{
            fontSize: "30px",
            color: "white",
            marginTop: "20px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {title}
        </div>
      </div>
      

      {content}
   
      <Row>
        
      {showButton && (
        <div
          onClick={() => {
            if (title === "New Strategy") {
              activeStrategyAction({});
              navigate("/CreateStrategy");
            } else {
              navigate("/MyStrategies");
            
            }
          }}
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          <div
            style={{
              backgroundColor: "#4170F0",
              width: "250px",
              height: "66px",
              borderRadius: "15px",
              color: "white",
              textAlign: "center",
              padding: "15px",
              marginTop: "15%",
              marginLeft: "305px",
            }}
          >
            <div style={{ textAlign: "center" }}>{buttonText}</div>
          </div>
        </div>
      )}
    
       {title === "New Strategy" && (
        <div
          onClick={() => {
              navigate("/TemplateStrategies");
          }}
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          <div
            style={{
              backgroundColor: "#4170F0",
              width: "250px",
              height: "66px",
              borderRadius: "15px",
              color: "white",
              textAlign: "center",
              padding: "15px",
              marginTop: "-11%",
              marginLeft: "50px",
            }}
          >
            <div style={{ textAlign: "center" }}>View All Templates</div>
          </div>
        </div>
      )}
     </Row>
    </div>
  );
};
const actionCreators = {
  activeStrategyAction: strategyActions.setActiveStrategy,
};
export default connect(null, actionCreators)(StrategyCard);
