import React, {useState, useEffect} from "react";
import "firebase/firestore";
import {useNavigate} from "react-router-dom";
import {FaChartArea} from "react-icons/fa";
import SideBar from "../elements/dashboard/sidebar";
import {useAuth} from "../../contexts/auth_ctx";
import StrategyCard from "../../components/elements/Strategies/strategycard.js";
import {useDispatch, useSelector} from "react-redux";
import {Row, Col} from "react-bootstrap";
import {getStrategies, getTemplateStrategies} from "../../_services/strategy.service";
import {strategyActions} from "../../store/_actions";
import MyStrategies from "../../containers/views/MyStrategies/MyStrategies";
import StockChartGroup from "./StockChartGroup";
import AccountPortfolio from "./AccountPortfolio";

// To do:
/**
 1. Use the name in the URL to customize th page based on stocks or crypto
 2. Update the chart to show portfolio balnace
 3. Use functions as guides for writing buying and selling funcitons for papertrading in portolfio
 4. Remove unneseacry code

 **/

const Dashboard = () => {
  const dispatch = useDispatch();
  const account = useSelector(state => state.account);
  const lightBlue = "#56CCF2";
  const lightPurple = "#BB6BD9";
  /** user authentification  */
  const {currentUser} = useAuth();

  const [strategiesList, setStrategiesList] = useState([]);
  const [showStrategiesList, setShowStrategiesList] = useState(false);
  const [templateStrategiesList, setTemplateStrategiesList] = useState([]);
  

  /** account value */

  const navigate = useNavigate();
  //Load users strategies into list
  useEffect(() => {
    // For Live Production Deploy ONLY
    // if(account.name!="Crypto Paper Trading"){
    //   window.alert("Your account is only approved for crypto paper trading testing. Please contact wenitte@daedalustech.io if you are interested in testing additional accounts") 
    //   window.location.replace("/Home");
    // }
    (async () => {
      if (currentUser) {
        const strategies = await getStrategies();
        
        const accountSpecificStrategies = strategies.data.strategies.filter(
          (strategy) => {
            return strategy.account === account.name;
          }
        );
        setStrategiesList(accountSpecificStrategies);
      }
    })()
  }, [currentUser])
  //load template strategies into list
  useEffect(() => {
    (async () => {
      if (currentUser) {
        const strategies = await getTemplateStrategies();
        console.log("stratsss:", strategies)
        const accountSpecificStrategies = strategies.data.strategies.filter(
          (strategy) => {
            return strategy.account === account.name;
          }
        );
        setTemplateStrategiesList(accountSpecificStrategies);
      }
    })()
  }, [currentUser])

  console.log(templateStrategiesList);

  const activeStrategy = (strategy) => {
    dispatch(strategyActions.setActiveStrategy(strategy))
    navigate("/CreateStrategy");
  }
  const activeTemplateStrategy = (template) => {
    //Create new strategy using template xml
    let newStrat = template;
    newStrat.name = template.name + " Copy";
    console.log(newStrat);
    if(newStrat.uid){
      delete newStrat.uid;
    }
    console.log(newStrat);
    dispatch(strategyActions.setActiveStrategy(template))
    navigate("/CreateStrategy");
  }
  return (
    <section className="Dashboard flex bg-surface" id="dashboard">
      <SideBar/>
      {showStrategiesList ? (
        <MyStrategies
          setActiveStrategy={activeStrategy}
          strategiesList={strategiesList}
        />
      ) : (
        <div className="flex flex-1 p-8">
          <div className="panel bg-surface flex-1">
            <div className="panel__container flex mt-5">
              <div className="panel__item d-block flex-1 mr-4">
                <div className="flex items-center">
                  <FaChartArea className="text-primary mr-2"/>
                  <h3 className="text-lg">Gainers</h3>
                </div>
                <StockChartGroup/>
              </div>
              <div className="panel__item d-block flex-1">
                <div className="flex items-center">
                  <FaChartArea className="text-primary mr-2"/>
                  <h3 className="text-lg">{account.name} Portfolio</h3>
                </div>
                <AccountPortfolio account_name={account.name}/>
              </div>
            </div>
            <div className="panel__low">
              <div className="panel__bottom-title">
                <h3>Trade</h3>
              </div>
              <div>
                <Row style={{marginTop: "10px"}}>
                  <Col>
                    <div>
                      <StrategyCard
                        color={lightBlue}
                        data={[]}
                        name={account.name}
                        type={account.type}
                        title="My Strategies"
                        buttonText="View All"
                        strategiesList={strategiesList}
                        showStrategiesList={setShowStrategiesList}
                        setActiveStrategy={activeStrategy}
                      />
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <StrategyCard
                        color={lightPurple}
                        data={[]}
                        name={account.name}
                        type={account.type}
                        title="New Strategy"
                        buttonText="Create New"
                        strategiesList={templateStrategiesList}
                        showStrategiesList={setShowStrategiesList}
                        setActiveStrategy={activeTemplateStrategy }
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default Dashboard;
