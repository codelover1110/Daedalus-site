import React, {useState, useEffect}  from "react";
import { Row, Col, Image, Button } from "react-bootstrap";
import TradeIcon from "../img/tradeicon.png";
import ActivityBlue from "../img/ActivityBlue.png";
import Toggle from 'react-toggle'
import Loader from "../Loader";
import "react-toggle/style.css" ;
import EditIcon from '@mui/icons-material/Edit';
import {
  saveStrategy,
  updateStrategy,
} from "../../../_services/strategy.service";
import { connect } from "react-redux";
import { strategyActions } from "../../../store/_actions";
import { NotificationManager } from "react-notifications";



function performanceCalc(strat){
  if(strat.type === "paper_trader"){
    let p = strat.paperTraderPerformance.map(a=> a.performance).reduce((a, b)=> Number(a) + Number(b), 0)
    return p.toFixed(2)
  } 
  if(strat.type === "live_trader"){
    let p = strat.liveTraderPerformance.map(a=> a.performance).reduce((a, b)=> Number(a) + Number(b), 0)
    return p.toFixed(2)
  } 
} 

//Need to modify setActiveStartegy function to be a copy for the tmeplate not use the sam estrategy. Also need to add loading indicatiors tothese boxes as well as fix the CSS. Also Possibly change live/notive to a toggle. 
//Also need to make not the row clicable but some type of button on the row 

//Works as a tbale actually not a row.  A better name would be MyStrategiesCardTable lol
const MyStrategiesCardRow = (props) => {
  const [loading, setLoading] = useState(true);

   const handleLiveNotLive = async (strategy) =>{
    // props.activeStrategyAction(strategy);
    console.log("strategy", strategy.uid);
    console.log("strategy", strategy.isLive);
    // setLoading(true);
    let isLive = !strategy.isLive;
    let strategyUid = strategy.uid;
  
    try {
      await updateStrategy({ isLive, strategyUid });
      NotificationManager.success("Strategy status updated successfully!");
      window.location.replace("/Dashboard");
      
    } catch (error) {
      NotificationManager.error("Error updating strategy data");
   
    }
  
  }

  if(loading){
    setTimeout(() => {setLoading(false)}, 2000);
    console.log("loading")
    return (<div style={{color:"white"}}>Loading...</div>);
   
  }


  const { strategiesList, name, setActiveStrategy } = props;
  let displayPurposes = Math.random()/100;
  displayPurposes =displayPurposes+1;
  displayPurposes = displayPurposes.toFixed(2);
  if(props.template){
    return (
      <table style={{marginLeft:"10px", color:"white", width:"600px"}}>

<tr style={{border:"none"}}>
       <th>Name</th>
       <th>YTD Performance</th>
        <th></th>
        </tr>
       
            {strategiesList.length
              ? strategiesList.slice(0, 4).map((strategy) => (
                  <tr style={{border:"none"}}>
                    <td style={{ textAlign: "left" }}>{strategy.name}</td>

                    <td
                      style={{ }}
                    >
                    {performanceCalc(strategy)<0 ? "" : "+"} {displayPurposes}%
                    </td>
                    <td> <div  onClick={() => setActiveStrategy(strategy)} style={{cursor: "pointer", color:"blue" }}>Copy </div></td>
                  </tr>
                ))
              : null}
      
      </table>
    );

  }
  return (


    <table style={{marginLeft:"10px", color:"white", width:"600px"}}>
           <tr style={{border:"none"}}>
       <th>Name</th>
       <th>Performance</th>
        <th>Live Status</th>
        <th>Edit</th>
        </tr>
          {strategiesList.length
            ? strategiesList.slice(0, 4).map((strategy) => (

                <tr style={{marginBottom:"20px", width:"600px", border:"none"}}>
                  <td style={{  }}>{strategy.name}</td>
                
                  <td style={{ }}>
                  {performanceCalc(strategy)<0 ? "" : "+"} {performanceCalc(strategy)}%
                  </td>
                  <td style={{ }}>
                  <Toggle
                    defaultChecked={strategy.isLive}
                   aria-label='No label tag'
                    onChange={() => handleLiveNotLive(strategy)} />
                    
                  </td>
                  <td  style={{ }}>
                  <EditIcon style={{cursor:"pointer", color:"blue"}} onClick={() => setActiveStrategy(strategy)}/>
                  </td>
                </tr>
              ))
            : null}
        </table>

 
  );
};

const actionCreators = {
  activeStrategyAction: strategyActions.setActiveStrategy,
};
export default connect(null, actionCreators)(MyStrategiesCardRow);

