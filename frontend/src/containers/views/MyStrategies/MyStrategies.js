import React , { useState, useRef, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getStrategies } from "../../../_services/strategy.service";
import { strategyActions } from "../../../store/_actions";
import Sidebar from "../../../components/elements/dashboard/sidebar";
import {
  saveStrategy,
} from "../../../_services/strategy.service";

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

const MyStrategies = ({ account, setActiveStrategy }) => {
const [strategiesList, setStrategiesList] = useState([]);
const getUserStrategies = async () => {
  const strategies = await getStrategies();
  console.log(strategies);
  const accountSpecificStrategies = strategies.data.strategies.filter(
    (strategy) => {
      return strategy.account === account.name;
    }
  );

  setStrategiesList(accountSpecificStrategies);
};
console.log(strategiesList);
const navigate = useNavigate();
const activeStrategy = (strategy) => {
  setActiveStrategy(strategy);
  navigate("/CreateStrategy");
};
  getUserStrategies();



  return (
    <section className="flex">
      <Sidebar />
      <div className="flex-1 p-8" style={{color:"white"}}>
      <h1 style={{color:"white"}}>  My {account.name} Strategies </h1>
      <table className="table-auto min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Performance</th>
          </tr>
        </thead>
        <tbody>
          {strategiesList.map((strategy) => {
            return (
              <tr
                onClick={() => activeStrategy(strategy)}
                className="cursor-pointer border-b transition duration-300 ease-in-out hover:bg-gray-300 hover:text-black"
              >
                <td className="px-6 py-4">{strategy.name}</td>
                <td className="px-6 py-4">
                  {strategy.isLive === true ? "live" : "not live"}
                </td>
                <td className="px-6 py-4">
                {performanceCalc(strategy)<0 ? "" : "+"} {performanceCalc(strategy)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      </div>
    </section>
  );
};
const actionCreators = {
    setActiveStrategy: strategyActions.setActiveStrategy,
  },
  mapStateToProps = (state) => {
    return {
      account: state.account,
    };
  };

export default connect(mapStateToProps, actionCreators)(MyStrategies);
