
import React from 'react';
import { NotificationManager } from 'react-notifications';
import { Row, Col, Image, Modal, Button} from 'react-bootstrap';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { encodeCrypto } from '../../../_services/encodeDecode'
import { callService } from '../../../_services/callableFunction';
import GenericSection from '../../../components/sections/GenericSection';
import OauthPopup from 'react-oauth-popup';
import { config } from '../../../config';
import RobinHoodLogo from '../img/robinhoodlogo.png';
import CoinbaseLogo from '../img/coinbaselogo.png';
import BinanceLogo from '../img/binancelogo.png';
import AlpacaLogo from '../img/alpacalogo.png';
// import { result } from 'lodash';
import {fb} from "../../utils/fb"

import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const initState = {
    api_key: '',
    secret_key: '',
    passphrase:""
}

const validationSchema = Yup.object().shape({
    api_key: Yup.string().trim().required(),
    secret_key: Yup.string().trim().required()
});

const CONNECT_OPTIONS = [
    // {
    //     name: 'Robinhood',
    //     client_id: config.coinbase_client_id,
    //     redirect_uri: config.coinbase_redirect_uri,
    //     state: config.coinbase_state,
    //     scope: config.coinbase_scope,
    //     oauthUrl: 'https://www.coinbase.com/oauth/authorize?',
    //     isActive: false,
    //     logo: RobinHoodLogo
    // },
    {
        name: 'Coinbase',
        client_id: config.coinbase_client_id,
        redirect_uri: config.coinbase_redirect_uri,
        state: config.coinbase_state,
        scope: config.coinbase_scope,
        oauthUrl: 'https://www.coinbase.com/oauth/authorize?',
        isActive: true,
        logo: CoinbaseLogo,
    },
    // {
    //     name: 'Binance',
    //     client_id: config.binance_client_id,
    //     redirect_uri: config.binance_redirect_uri,
    //     state: config.binance_state,
    //     scope: config.binance_scope,
    //     oauthUrl: 'https://accounts.binance.com/en/oauth/authorize?',
    //     isActive: true,
    //     logo: BinanceLogo,
    // },
    {
        name: 'Alpaca',
        client_id: config.alpaca_client_id,
        redirect_uri: config.alpaca_redirect_uri,
        state: config.alpaca_state,
        scope: config.alpaca_scope,
        oauthUrl: 'https://app.alpaca.markets/oauth/authorize?',
        isActive: true,
        logo: AlpacaLogo,
    }
]

class ConnectServices extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            client_id: "",
            redirect_uri: "",
            state: "",
            scope: "",
            modal: false,
            exchange:"Binance",
            api_key:"",
            secret_key:"",
            passphrase:"",
            is_connected_coinbase: false,
            is_connected_alpaca: false,
            is_connected_binance: false,
            is_connected_robinhood: false,
            email:"",
            uid:""
        };
    }

    componentDidMount = async () => {
        try {
            const result = await fb.isUser() //    callService("getUser");
            console.log(result.email);
            this.setState({email: result.email, uid: result.uid})
        } catch (err) {
            console.log(err);
        }
        console.log(this.props, "this.props.userthis.props.userthis.props.userthis.props.userthis.props.user")
        if(this.props.user.subscriptionTier=="free"){
          window.alert("Live Trading is only available to paid users. Please upgrade your account to continue")
          window.location.replace("/Upgrade");
          console.log("FREE USER")
        }
        let connectedAccounts = this.props.user.connectedAccounts;
        for( let i=0; i<connectedAccounts.length; i++){
            if(connectedAccounts[i].name=="Coinbase"){
                this.setState({is_connected_coinbase: true})
            }
            if(connectedAccounts[i].name=="Alpaca"){
                this.setState({is_connected_alpaca: true})
            }
            if(connectedAccounts[i].name=="Binance"){
                this.setState({is_connected_binance: true})
            }
            if(connectedAccounts[i].name=="Robinhood"){
                this.setState({is_connected_robinhood: true})
            }
        }
    }

    onCode = async (code, name) => {
        try {
            let payload = {
                "authData": "",
                "authType": "",
                "isPrimary": true,
                "defaultCrypto": {
                    "balance": 0,
                    "type": "crypto"
                },
                "defaultStocks": {
                    "balance": 0,
                    "type": "stocks"
                }
            }

            let tokenPayload = {
                code: code,
                apiType: name,
                redirect_uri: ""
            }

            let isSucces = false;

            switch (name) {
                case 'Coinbase': {
                    tokenPayload.redirect_uri = config.coinbase_redirect_uri;
                    const res = await callService("getApiAuthToken", tokenPayload);
                    if (!res.data.status) throw { message: res.data.message }
                    tokenPayload['code'] = res.data.data;
                    payload["authData"] = res.data.data;
                    payload["authType"] = "Coinbase";
                    payload["isPrimary"] = true;
                    isSucces = true;
                }
                    break;
                case 'Alpaca': {
                    tokenPayload.redirect_uri = config.alpaca_redirect_uri;
                    const res = await callService("getApiAuthToken", tokenPayload);
                    if (!res.data.status) throw { message: res.data.message };
                    tokenPayload['code'] = res.data.data;
                    payload["authData"] = res.data.data;
                    payload["authType"] = "Alpaca";
                    payload["isPrimary"] = true;
                    isSucces = true;
                }
                    break;
                case 'Binance': {
                    tokenPayload.redirect_uri = config.alpaca_redirect_uri;
                    tokenPayload.code = encodeCrypto(JSON.stringify(tokenPayload.code));
                    const reqPayload = { "router": "/getAccount", "authType": "Binance", ...tokenPayload, }
                    const res = await callService("apiRouter", reqPayload);
                    if (!res.data.status) throw { message: res.data.message }
                    payload["authData"] = tokenPayload.code;
                    payload["authType"] = "Binance";
                    payload["isPrimary"] = true;
                    isSucces = true;
                }
                default:
                    break;
            }
            if (isSucces) {
                await callService("connectAccount", payload);
                this.props.history.push("/");
            } else {
                NotificationManager.error('Connection Failed, Please try again.');
            }
        } catch (err) {
            console.log(err);
            NotificationManager.error('Connection Failed, Please try again.');
        }

    }

    onClose(e) {
        console.log(e);
    }

    handleFormChange(e){
        const {name, value} = e.target
        this.setState({[name]: value})
    }

    saveAuthToken = async () => {
        this.props.history.push("/");
    }

    toggle = (exchange) => {
        // debugger;
        this.setState({exchange: exchange})
        const { modal } = this.state;
        this.setState({ modal: !modal })
    }

    render() {
        const { user } = this.props;
        console.log(user)
        const { modal } = this.state;
        const that = this;
        const cryptoExchanges = ["Binance", "Coinbase", ]
        return (
            <React.Fragment>
                <GenericSection topDivider className="center-content">
                    <h1>Connect Your Account to Daedalus</h1>

                    <Modal show={modal} onHide={this.toggle}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.exchange}</Modal.Title>
                        </Modal.Header>
                        <Formik initialValues={initState}
                            validationSchema={validationSchema}
                            validateOnBlur
                            validateOnChange
                            onSubmit={ async (values) => {
                                let {api_key, secret_key, passphrase} =  values
                                let exchange = this.state.exchange

                                let update = {
                                    [exchange] :{
                                        api_key, 
                                        secret_key, 
                                        passphrase
                                    },
                                    type: cryptoExchanges.indexOf(exchange) > -1? "crypto": "stock",
                                    positions:[],
                                    name: exchange,
                                    balance: 0,
                                    paperAccount:false
                            }
                            
                                let newExchange = user.connectedAccounts
                                let currentExchanges = newExchange.map(ex=> ex.name)
                                console.log(currentExchanges)
                                if(currentExchanges.indexOf(exchange)>-1){
                                    let index = currentExchanges.indexOf(exchange)
                                    newExchange.splice(index, 1)

                                }
                                newExchange.push(update)
                                console.log(newExchange, update)

                                if (exchange == 'Alpaca') {
                                    let result = await callService("updateAlpacaUser", {connectedAccounts: newExchange});
                                    console.log(result)
                                    if(result.data.success){
                                        alert(`${exchange} added, you can now set up strategies and automate trades`)
                                        window.location.replace("/Home");
                                    } else {
                                        alert("Error occured, please try to put the correct API key.")
                                    }
                                } else {
                                    const res = await fb.updateUser(user.uid, {connectedAccounts: newExchange}) //  callService("updateUser", update);
                                    console.log(res)
                                    if(res){
                                        alert(`${exchange} added, you can now set up strategies and automate trades`)
                                        window.location.replace("/Home");
                                    } else {
                                        alert("Error occured, try again later")
                                    }
                                }

                               
                                // this.onCode(values, this.state.exchange)
                                // this.toggle();


                            }}>
                            {({ handleChange, handleBlur }) => (
                                <Form>
                                    <Modal.Body>
                                        <div className="form-group">
                                            <label class="form-label" for="api_key">api key</label>
                                            <input type="text" id="api_key" name="api_key" className="form-control" placeholder="enter api key" onChange={handleChange} onBlur={handleBlur} />
                                            <ErrorMessage component="small" name="api_key" className="text-danger" />
                                        </div>
                                        <div className="form-group">
                                            <label class="form-label" for="secret_key">secret key</label>
                                            <input type="text" id="secret_key" name="secret_key" className="form-control" placeholder="enter secret key" onChange={handleChange} onBlur={handleBlur} />
                                            <ErrorMessage component="small" name="secret_key" className="text-danger" />
                                        </div>
                                        {this.state.exchange === "Coinbase"?  <div className="form-group">
                                            <label class="form-label" for="passphrase">passphrase</label>
                                            <input type="text" id="secret_key" name="passphrase" className="form-control" placeholder="enter passphrase" onChange={handleChange} onBlur={handleBlur} />
                                            <ErrorMessage component="small" name="passphrase" className="text-danger" />
                                        </div> : null}
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button type="submit" class="btn btn-primary btn-sm">Save</button>
                                    </Modal.Footer>
                                </Form>
                            )}
                        </Formik>
                    </Modal>

                    <div className="tiles-wrap">
                        <div style={{ width: '572px', height: '500px', backgroundColor: '#212329', borderRadius: '30px', textAlign: 'center', margin: 'auto' }}>
                            <div className="tiles-item">
                                {CONNECT_OPTIONS.map((x, i) => {
                                    if (x.name === "Binance"&&!this.state.is_connected_binance) {
                                        return (
                                            <div className="mt-24 mb-10" key={i}>
                                                <button disabled={!x.isActive} className="button button-primary button-block" style={{ color: 'black', marginLeft: '50px', backgroundColor: 'white', width: '436px', height: '120px', borderRadius: '30px', fontSize: '20px', marginTop:"-420px",  }} onClick={()=> this.toggle(x.name)}><Image src={x.logo} width={250} height={3} /></button>
                                            </div>
                                        )
                                    } else {
                                        const url = `${x.oauthUrl}response_type=code&client_id=${x.client_id}&redirect_uri=${x.redirect_uri}&state=${x.state}&scope=${x.scope}`
                                        return (
                                            <div className="mt-24 mb-3" key={i}>
                                                {/* <OauthPopup
                                                    url={url}
                                                    onCode={(data) => this.onCode(data, x.name)}
                                                    onClose={this.onClose}> */}
                                                    <button disabled={!x.isActive} className="button button-primary button-block" style={{ color: 'black', marginLeft: '50px', backgroundColor: 'white', width: '436px', height: '120px', borderRadius: '30px', fontSize: '20px', marginTop:"-30px", }} onClick={()=> this.toggle(x.name)}><Image src={x.logo} width={250} height={4} /></button>
                                                {/* </OauthPopup> */}
                                            </div>
                                        )
                                    }

                                }
                                )}

                            </div>
                        </div>
                    </div>
                    <div style={{ display: "inline-block" }}>

                        <Link to="/home"> <Button style={{backgroundColor:"white", borderColor:"white"}}> <div style={{ color: "black", width:"70px", height:"30px" }}>Skip  </div> </Button></Link> 
                        <div style={{ color: "white" }}>
                            <a style={{}}> Privacy Policy  </a>
   
                            <a >   Terms of Service</a>
                        </div>
                    </div>
                </GenericSection>
            </React.Fragment>
        );

    }
}

function mapState(state) {
    const { user } = state.authentication;
    return { user };
}

export default connect(mapState, null)(ConnectServices);
