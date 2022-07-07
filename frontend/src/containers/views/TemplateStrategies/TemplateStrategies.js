import React , { useState, useRef, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getTemplateStrategies } from "../../../_services/strategy.service";
import { strategyActions } from "../../../store/_actions";
import Sidebar from "../../../components/elements/dashboard/sidebar";
import {useDispatch, useSelector} from "react-redux";
import {
  saveStrategy,
} from "../../../_services/strategy.service";
let displayPurposes = Math.random()/100;
displayPurposes =displayPurposes+1;
displayPurposes = displayPurposes.toFixed(2);
const TemplateStrategies = ({ account, setActiveStrategy }) => {
  const dispatch = useDispatch();
const [strategiesList, setStrategiesList] = useState([]);
useEffect(() => {
  getAllTemplateStrategies()
}, [account])
const getAllTemplateStrategies = async () => {
  const strategies = await getTemplateStrategies();
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
const activeStrategy = (template) => {
  let newStrat = template;
  newStrat.name = template.name + " Copy";
  console.log(newStrat);
  if(newStrat.uid){
    delete newStrat.uid;
  }
  console.log(newStrat);
  dispatch(strategyActions.setActiveStrategy(template))
  navigate("/CreateStrategy");
};

  // getAllTemplateStrategies();

 

  return (
    <section className="flex">
      <Sidebar />
      <div className="flex-1 p-8" style={{color:"white"}}>
      <h1 style={{color:"white"}}> {account.name} Strategy Templates </h1>
      <table className="table-auto min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">YTD Performance</th>
          
          </tr>
        </thead>
        <tbody>
          {strategiesList.map((strategy) => {
            return (
              <tr
               
                className="border-b"
              >
                <td className="px-6 py-4">{strategy.name}</td>
                <td className="px-6 py-4">
                {strategy.performance<0 ? "-" : "+"} {displayPurposes}%
                </td>
                <td  > <div onClick={() => activeStrategy(strategy)} style={{color:"blue", cursor:"pointer"}}> Copy</div></td>
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

export default connect(mapStateToProps, actionCreators)(TemplateStrategies);
