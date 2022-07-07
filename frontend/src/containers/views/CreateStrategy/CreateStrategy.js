import React from "react";
import GenericSection from "../../../components/sections/GenericSection";
import { Form, Button, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MainStrategyBuilderView from "../../../components/elements/MainStrategyBuilderView";
import ConfigFiles from "../../../components/blocklycontent/content";
import {
  saveStrategy,
  updateStrategy,
} from "../../../_services/strategy.service";
import { NotificationManager } from "react-notifications";
import SideBar from "../../../components/elements/dashboard/sidebar";
import Loader from "../../../components/elements/Loader";
import XMLParser from "react-xml-parser";
import {fb} from "../../utils/fb"
import { useAuth } from "../../../contexts/auth_ctx";
import {
  getAllCoinbaseAssets
} from "../../../_services/thirdparty/coinbase"

class CreateStrategy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelectedBlock: "buy",
      initXML: ConfigFiles.INITIAL_XML,
      assets:[],
      strategyUid: null,
      blocklyXML: "",
      blocklyJavascript: "",
      name: "",
      loading: false,
      timeframe:"1d",
      exchange:this.props.exchange || "Coinbase",
      key: "",
      secret:"",
      passphrase:"",
      type:this.props.paperAccount || this.props.paperAccount === undefined? "paper_trader": "live_trader",
      trade: true,
      isLive: false,
      asset: "",
      amount: 0,
      marketType: this.props.type
    };
    // this.blockColumnBuilderView = React.createRef();
  }

  async componentWillMount() {
    if (this.props.accountName == 'Alpaca') {
      this.setState({exchange: 'Alpaca'})
      let rawUser = await fb.isUser()
      let user = await fb.findUser(rawUser.uid)
      let key = ""
      let secret = ""
      user.connectedAccounts.forEach(account => {
        if (account['Alpaca']) {
          key = account.Alpaca.api_key
          secret = account.Alpaca.secret_key
        }
      });
      // let key = (user.connectedAccounts[2].Alpaca.api_key)
      // let secret = (user.connectedAccounts[2].Alpaca.secret_key)
      console.log("this.props.accountNamethis.props.accountNamethis.props.accountNamethis.props.accountName", this.props.accountName, key, secret)
      this.setState({key: key, secret: secret, passphrase: ""})
    }
  }

  async componentDidMount() {
    if (this.props.activeStrategy) {
      this.setActiveStrategyDetails();
    }
    let exchangeAssets = {}

    exchangeAssets.Coinbase = getAllCoinbaseAssets()
    let ex = this.props.exchange || "Coinbase" // default to coinbase, register paper trader account on register
    let assets = await exchangeAssets[ex]

    // if (this.props.accountName == 'Alpaca') {
    //   this.setState({exchange: 'Alpaca'})
    //   let rawUser = await fb.isUser()
    //   let user = await fb.findUser(rawUser.uid)
    //   let key = (user.connectedAccounts[2].Alpaca.api_key)
    //   let secret = (user.connectedAccounts[2].Alpaca.secret_key)
    //   console.log("this.props.accountNamethis.props.accountNamethis.props.accountNamethis.props.accountName", this.props.accountName, key, secret)
    //   this.setState({key: key, secret: secret, passphrase: ""})
    // }

    this.setState({ assets: assets.data})
  }
  saveDraft() {
    return console.log("draft saved");
  }
  goLive() {
    return console.log("Strategy Deployed");
  }

  backTest() {
    // this.generateCodeData();
    window.alert("Feature coming soon!");

  }

  generateCodeData = () => {
    this.blockColumnBuilderView.generateCode();
  };

  setBlockType = (currentBlock) => {
    this.setState(
      {
        currentSelectedBlock: currentBlock,
      },
      () => {
        console.log("Set block");
      }
    );
  };

  setActiveStrategyDetails = () => {
    const {
      activeStrategy: { name, xml, uid },
    } = this.props;
    this.setState({ name, initXML: xml, blocklyXML: xml, strategyUid: uid });
  };

  setBlocklyXMLChange = (xmlData) => {
    let xml = new XMLParser().parseFromString(xmlData)
    this.setState({ blocklyXML: xmlData });
  };

  setBlocklyJavascriptChange = (javascriptCode) => {
    this.setState({ blocklyJavascript: javascriptCode });
  };

  setStrategyName = (e) => {
    this.setState({ name: e.target.value });
  };

  saveBlocklyXML = async (e) => {
    e.preventDefault();
    const { 
            blocklyXML, 
            name, 
            strategyUid, 
            blocklyJavascript,
            exchange,
            key,
            secret,
            passphrase,
            type,
            trade,
            asset,
            amount,
            marketType
          } = this.state;
    const { accountName } = this.props;
    const strategy = { 
                        xml: blocklyXML, 
                        name:name , 
                        isLive: false, 
                        strategy:blocklyJavascript, 
                        accountName: accountName, 
                        timeframe:"1m",
                        exchange:exchange,
                        key:key,
                        secret:secret,
                        passphrase:passphrase,
                        type:type,
                        trade:trade,
                        asset:asset,
                        amount:amount,
                        paperTraderPerformance:[],
                        liveTraderPerformance:[],
                        created: Date.now(),
                        performance:0.0,
                        endsAt: 7 * 24 *3600 * 1000,
                        orderAtMarketPrice: true,
                        orderid: "",
                        sl: 0,
                        side: "",
                        paid: true,
                        marketType:marketType
                      };
                      console.log(strategy)
    try {
      this.setState({ loading: true }, async () => {
        if (Object.entries(this.props.activeStrategy).length > 0 && this.props.activeStrategy.strategyUid == '') {
          await saveStrategy({...strategy});
        } else if (strategyUid) {
          await updateStrategy({ ...strategy, strategyUid });
        } else {
          let saving  = await saveStrategy({...strategy});
          // let saving = await fb.saveStrategy(strategy)
          console.log(saving)
        }
        NotificationManager.success("Strategy saved successfully!");
        this.setState({ loading: false });
      });
    } catch (err) {
      NotificationManager.error("Error saving strategy data");
      this.setState({ loading: false });
    }
  };

  activateOrDeactivateStrategy = async (isLive = false) => {
    this.setState({ loading: true });
    const { strategyUid } = this.state;
    try {
      await updateStrategy({ isLive, strategyUid });
      NotificationManager.success("Strategy updated successfully!");

    } catch (error) {
      NotificationManager.error("Error updating strategy data");
      this.setState({ loading: false });
    }
  };

  async handleChange(e){
    const {name, value} = e.target
    if(value === "live_trader" && name === "type"){
      let exchange = this.state.exchange 
      let rawUser = await fb.isUser()
      console.log(rawUser)
      let user = await fb.findUser(rawUser.uid)
      console.log(user)
      if(user[exchange] === undefined || user[exchange] == null){
        alert("Kindly integrate your exchange key and secret before going live")
        this.setState({type: "paper_trader"})
        return
      }
      let key = user[exchange].api_key
      let secret = user[exchange].secret_key
      let passphrase = exchange === "Coinbase"? user[exchange].passphrase:""
      this.setState({key: key, secret: secret, passphrase: passphrase})
      
    } else if( value === "paper_trader" && name === "type"){
      this.setState({key: "", secret: "", passphrase: ""})

    }
    this.setState({[name]: value})
  }
  render() {
    const { currentSelectedBlock, initXML, blocklyXML, name, loading } =
      this.state;
    const { activeStrategy } = this.props;
    return (
      <React.Fragment>
        {this.state.loading ? (
          <Loader />
        ) : (
          <section className="Dashboard flex bg-surface" id="dashboard">
            <SideBar />

            <div className="flex flex-1 p-8">
              <div className="panel bg-surface flex-1">
                <div className="panel__container flex mt-5">
                  <div className="panel__item d-block flex-1 mr-4">
                    <div style={{ color: "white" }}>Create {this.props.accountName} Strategy</div> 
                    {/* <BlockColumnBuilderView setBlockType={this.setBlockType}  /> */}
                    {/* <div style={{ marginLeft: "500px", marginTop: "-770px" }}> */}
                    <MainStrategyBuilderView
                      currentSelectedBlock={currentSelectedBlock}
                      initXML={initXML}
                      blocklyXML={blocklyXML}
                      setBlocklyXMLChange={this.setBlocklyXMLChange}
                      setBlocklyJavascriptChange={
                        this.setBlocklyJavascriptChange
                      }
                      exchange={this.props.accountName}
                    />
                    <Form onSubmit={this.saveBlocklyXML}>
                      <Row style={{ marginTop: "100px" }}>
                        <Col md="4">
                          <Form.Label style={{ fontSize: "20px" }}>
                            Name
                          </Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            disabled={loading}
                            onChange={(e) => this.setStrategyName(e)}
                          />
                        </Col>
                        {/* <Col md="4">
                          <Form.Label style={{ fontSize: "20px" }}>
                            Exchange
                          </Form.Label>
                          <div>
                          <select name="exchange" onChange={(e)=> this.handleChange(e)}>
                           <option value="Coinbase">Coinbase</option>
                         </select>
                          </div>
                        </Col> */}
                        {/* <Col md="4">
                          <Form.Label style={{ fontSize: "20px" }}>
                            Assets
                          </Form.Label>
                          <div>
                          <select name="asset" onChange={(e)=> this.handleChange(e)}>
                          <option value="">Select Asset</option>
                     
                           {this.state.assets
                           .filter(asset=> asset.match(/USD$/))
                           .map(asset => <option value={asset} key={asset}>{asset.match(/.*(?=-)/)[0]}</option>)}
                         </select>
                          </div>
                        </Col> */}
                        {/* <Col md="4">
                          <Form.Label style={{ fontSize: "20px" }}>
                            Type
                          </Form.Label>
                          <div>
                          <select value={this.state.type} name="type" onChange={(e)=> this.handleChange(e)}>
                          <option value="">Select Type</option>
                           <option value="paper_trader">Paper Trader</option>
                           <option value="live_trader">Live Trader</option>
                         </select>
                          </div>
                        </Col> */}
                        {/* <Col md="4">
                          <Form.Label style={{ fontSize: "20px" }}>
                            Amount
                          </Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Enter Amount"
                            name="amount"
                            value={this.state.amount}
                            disabled={loading}
                            onChange={(e) => this.handleChange(e)}
                          />
                        </Col> */}
                      </Row>
                      <Row style={{ marginTop: "40px" }}>
                        <Col md="8">
                          <Button
                            type="submit"
                            style={{
                              width: "126px",
                              height: "66px",
                              backgroundColor: "#4170F0",
                              borderRadius: "15px",
                              color: "white",
                              border: "none",
                              boxShadow: "none",
                              cursor: "pointer",
                            }}
                            disabled={loading}
                            loading={loading}
                          >
                            Save
                          </Button>
                        </Col>
                        <Col md="4" style={{ textAlign: "center" }}>
                          {/* <Button
                            style={{
                              width: "226px",
                              height: "66px",
                              backgroundColor: "#4170F0",
                              borderRadius: "15px",
                              color: "white",
                              border: "none",
                              boxShadow: "none",
                              cursor: "pointer",
                              marginLeft: "-700px",
                            }}
                            disabled={loading}
                            onClick={() =>
                              this.activateOrDeactivateStrategy(
                                !activeStrategy.isLive
                              )
                            }
                          >
                            {activeStrategy.isLive ? "Deactivate" : "Go Live"}
                          </Button> */}
                        </Col>

                        <Col md="4" style={{ textAlign: "right" }}>

                            <Button
                              style={{
                                width: "226px",
                                height: "66px",
                                backgroundColor: "#4170F0",
                                borderRadius: "15px",
                                color: "white",
                                border: "none",
                                boxShadow: "none",
                                cursor: "pointer",
                                marginTop: "-100px",
                              }}
                              disabled={loading}
                              onClick={() => this.backTest()}
                            >
                              {" "}
                              Backtest
                            </Button>

                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { activeStrategy } = state.strategy;
  const { name: accountName, type: type, paperAccount: paperAccount, exchange: exchange, } = state.account;
  
  return { activeStrategy, accountName, type, paperAccount, exchange,   };
}

export default connect(mapStateToProps, null)(CreateStrategy);
