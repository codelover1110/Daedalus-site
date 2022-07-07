import React from 'react';
import  {db} from '../../firebase';
import classNames from 'classnames';
import { SectionProps } from '../../containers/utils/SectionProps';
import { Link, useNavigate} from 'react-router-dom';
import SectionHeader from './partials/SectionHeader';
import Input from '../elements/Input';
import Button from '../elements/Button';
import firebase from "firebase/app";
import "firebase/auth";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { writeUserData } from '../../store/utility';
import { connect } from 'react-redux';
import { userActions } from '../../store/_actions';
import {formatFireError} from "../../firebase";
import {emailInBetaList} from "../../_services/user.service";

class SignupForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      emailAllowedToSignUp:false,
      checkInList:false,
    };
  }

  signUps = async (e) => {
    e.preventDefault();
    const { register, navigate } = this.props;
    let formData = new FormData(e.target);
    this.setState({ loading: true })
    let email = formData.get('email');

//Check if in beta list 

  let result = await db.collection("beta_invites")
  .get()
  .then(querySnapshot => {
    const data = querySnapshot.docs.map(doc => doc.data());
    let x =0;
    let res =[]
    while (x<data.length){
     
      res.push(data[x].email);
      console.log(res[x]);
      x++;
    }
    if(res.length>0){
      let isInBetaList = res.indexOf(email) !== -1;
      console.log("IS IN BETA LIST", isInBetaList);
      this.setState({emailAllowedToSignUp:isInBetaList});
    }
   
  });
if(this.state.emailAllowedToSignUp){
  try {
    const resData = await register({
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstname"),
      lastName: formData.get("lastname")
    });
    if(resData){
      navigate("/Connect")
    }
  }catch (error){
    this.setState({ loading: false })
    NotificationManager.error(formatFireError(error.code));
  }
 

 
  this.setState({ loading: false })
}
else{
  NotificationManager.error("Hmmmm you don't seem to have beta access yet. If you are currently on the waitlist please be paitent! If you are not on the waitlist yet you can join it by visitng https://daedalustech.io");
}
  
          

         
      
      
  
  }


  render() {
    const {
      className,
      topOuterDivider,
      bottomOuterDivider,
      topDivider,
      bottomDivider,
      hasBgColor,
      invertColor,
      register,
      navigate,
      ...props
    } = this.props;

    const { loading } = this.state;

    const outerClasses = classNames(
      'signin section',
      topOuterDivider && 'has-top-divider',
      bottomOuterDivider && 'has-bottom-divider',
      hasBgColor && 'has-bg-color',
      invertColor && 'invert-color',
      className
    );

    const innerClasses = classNames(
      'signin-inner section-inner',
      topDivider && 'has-top-divider',
      bottomDivider && 'has-bottom-divider'
    );

    const sectionHeader = {
      title: 'Welcome. We exist to make trading easier.',
    };


    return (
      <section
        {...props}
        className={outerClasses}
      >
        <div className="container">
          <div className={innerClasses}>
            <SectionHeader tag="h1" data={sectionHeader} className="center-content" />
            <div className="tiles-wrap">
              <div className="tiles-item">
                <div className="tiles-item-inner">
                  <form onSubmit={(e) => {
                    this.signUps(e);
                  }}>
                    <fieldset>
                      <div className="mb-5">
                        <Input
                         style={{borderRadius:"15px"}}
                          label="First name"
                          placeholder="First name"
                          labelHidden
                          name="firstname"
                          defaultValue="John"
                          disabled={loading}
                          required />
                      </div>
                      <div className="mb-5">
                        <Input
                         style={{borderRadius:"15px"}}
                          label="Last name"
                          placeholder="Last name"
                          labelHidden
                          name="lastname"
                          defaultValue="Doe"
                          disabled={loading}
                          required />
                      </div>
                      <div className="mb-5">
                        <Input
                         style={{borderRadius:"15px"}}
                          type="email"
                          label="Email"
                          placeholder="Email"
                          defaultValue="john@doe.com"
                          name="email"
                          labelHidden
                          disabled={loading}
                          required />
                      </div>
                      <div className="mb-5">
                        <Input
                         style={{borderRadius:"15px"}}
                          type="password"
                          label="Password"
                          name="password"
                          defaultValue="niggapenis123"
                          placeholder="Password"
                          disabled={loading}
                          labelHidden
                          required />
                      </div>
                      <div className="mt-8 mb-5">
                        <Button color="primary" style={{borderRadius:"30px"}} loading={loading} disabled={loading} wide onClick={() => {

                        }}>Sign up</Button>
                      </div>
                    </fieldset>
                  </form>
                  <div className="signin-bottom">
                    <div className="pt-8 text-xs center-content text-color-low">
                     <div style={{color:"white", fontWeight:"bold"}}> Already have an account?</div> <Link to="/login/" className="func-link">Login</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

function WithNavigate(props) {
  let navigate = useNavigate();
  return <SignupForm {...props} navigate={navigate} />
}

const actionCreators = {
  register: userActions.register,
};

export default connect(null, actionCreators)(WithNavigate);
