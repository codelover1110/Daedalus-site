import React, {useEffect, useState} from 'react';
import GenericSection from '../../../components/sections/GenericSection';
import Pricing from '../../../components/sections/GenericSection';
import {Row, Col, Button} from 'react-bootstrap';
import {
  getStripeConfig,
  stripeCancelSubscription,
  stripeCreateCheckoutSession
} from "../../../_services/stripe.service";
import {useSelector} from "react-redux";
import {getUserDetails} from "../../../store/_selectors/user.selectors";

const Upgrade = () => {

  const user = useSelector(state => getUserDetails(state));

  const [loading, setLoading] = useState(true)
  const [freePrice, setFreePrice] = useState(null)
  const [goldPrice, setGoldPrice] = useState(null)
  const [silverPrice, setSilverPrice] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState(null)

  useEffect(() => {
    window.alert("Your account does not have permission to access this functionality. Please contact wenitte@daedalustech.io if you are interested in accessing it") 
      window.location.replace("/Home");
    (async () => {
      const {data: {freePrice, goldPrice, silverPrice}} = await getStripeConfig();
      setFreePrice(freePrice)
      setGoldPrice(goldPrice)
      setSilverPrice(silverPrice)
      setLoading(false)
    })()
  }, [])

  useEffect(()=>{
    if(user.subscription){
      setCurrentSubscription(user.subscription)
    }else{
      setCurrentSubscription(null)
    }
  },[])

  const processCheckout = async (priceId) => {
    setIsProcessing(true)
    const { data } = await stripeCreateCheckoutSession({priceId})
    setIsProcessing(false)
    if(data.sessionUrl){
      window.location.href = data.sessionUrl
    }else{
      console.log(data,'data')
    }
  }

  const cancelSubscription = async() => {
    setIsProcessing(true)
    if(currentSubscription?.subscriptionId) {
      const response = await stripeCancelSubscription()
      setIsProcessing(false)
      if(response.data.success){
        window.location.href = '/SubscriptionCanceled'
      }
    }
  }

  if(loading) return <h1 className="text-center m-auto">Loading</h1>
  return (
    <React.Fragment>
      <GenericSection topDivider>
        <Row style={{color: "white"}}>
          <Col>
            <div style={{
              backgroundColor: "grey",
              width: "400px",
              height: "500px",
              borderRadius: "30px",
              margin: "auto",
              listStyle: "circle"
            }}>
              <Row style={{marginLeft: "20px"}}><h1>Free Plan</h1></Row>
              <Row>
                <ul style={{marginLeft: "35px"}}>
                  <li>
                    Paper Trading
                  </li>
                </ul>
              </Row>
              <div style={{fontSize: "50px", marginTop: "250px", marginLeft: "100px", fontWeight: "bold"}}>
                $0/M
              </div>
              {
                (!currentSubscription || currentSubscription.priceId !== freePrice) ?
                  (<Button disabled={isProcessing} onClick={() => processCheckout(freePrice)} style={{marginTop: "-2px", marginLeft: "150px"}}>
                    Select
                  </Button>)
                :
                (
                <Button className="btn-danger" disabled={isProcessing} onClick={() => cancelSubscription()}
                style={{marginTop: "-2px", marginLeft: "150px"}}>
                Cancel
                </Button>
                )
              }
            </div>

          </Col>

          <Col>
            <div style={{
              backgroundColor: "grey",
              width: "400px",
              height: "500px",
              borderRadius: "30px",
              margin: "auto"
            }}>
              <Row style={{marginLeft: "20px"}}><h1>Daedalus Silver</h1></Row>
              <Row>
                <ul style={{marginLeft: "35px"}}>
                  <li>
                    Paper Trading
                  </li>
                  <li>
                    Live Trading
                  </li>
                </ul>
              </Row>
              <div style={{fontSize: "50px", marginTop: "200px", marginLeft: "100px", fontWeight: "bold"}}>
                $50/M
              </div>
              {
                (!currentSubscription || currentSubscription.priceId !== silverPrice) ?
                  (<Button disabled={isProcessing} onClick={() => processCheckout(silverPrice)}
                           style={{marginTop: "-2px", marginLeft: "150px"}}>
                    Select
                  </Button>)
                  :
                  (
                    <Button className="btn-danger" disabled={isProcessing} onClick={() => cancelSubscription()}
                            style={{marginTop: "-2px", marginLeft: "150px"}}>
                      Cancel
                    </Button>
                  )
              }
            </div>

          </Col>

          <Col>
            <div style={{
              backgroundColor: "grey",
              width: "400px",
              height: "500px",
              borderRadius: "30px",
              margin: "auto"
            }}>
              <Row style={{marginLeft: "20px"}}><h1>Daedalus Gold</h1></Row>
              <Row>
                <ul style={{marginLeft: "35px"}}>
                  <li>
                    Paper Trading
                  </li>
                  <li>
                    Live Trading
                  </li>
                  <li>
                    Backtesting
                  </li>
                  <li>
                    Trade History
                  </li>
                </ul>
              </Row>
              <div style={{fontSize: "50px", marginTop: "100px", marginLeft: "70px", fontWeight: "bold"}}>
                $75/M
              </div>
              {
                (!currentSubscription || currentSubscription.priceId !== goldPrice) ?
                  (<Button disabled={isProcessing} onClick={() => processCheckout(goldPrice)}
                           style={{marginTop: "-2px", marginLeft: "150px"}}>
                    Select
                  </Button>)
                  :
                  (
                    <Button className="btn-danger" disabled={isProcessing} onClick={() => cancelSubscription()}
                            style={{marginTop: "-2px", marginLeft: "150px"}}>
                      Cancel
                    </Button>
                  )
              }
            </div>

          </Col>
        </Row>
        <Pricing/>

      </GenericSection>
    </React.Fragment>
  );
}

export default Upgrade
