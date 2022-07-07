import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SectionProps } from '../../containers/utils/SectionProps';
import Firebase from 'firebase';
import Input from '../elements/Input';
import Button from '../elements/Button';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database"


const propTypes = {
  ...SectionProps.types,
  split: PropTypes.bool
}

const defaultProps = {
  ...SectionProps.defaults,
  split: false
}

    var db = Firebase.database()
class Cta extends React.Component {

    	state = {
    		email: '',
    		errorMessage: null,
    		isSubscribe: true,
    	};
    constructor(props){
      super(props);



}
  	validateEmail(elementValue) {
  		var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  		return emailPattern.test(elementValue);
  	}

  	subscribeClick = () => {
  		var email = this.state.email
  		var mailRef = db.ref('Emails').push()

  		mailRef.set({
  			'email': email
  		})

  		var countRef = db.ref('NumCurrentSubs/currentCount')
  		countRef.transaction(function (current_value) {
  			return (current_value || 0) + 1;
  		})
  		 alert('Thank you! You have been added to Daedalus\'s waiting list.');
  	}
    inputChange = event => {
  		const name = event.target.name;

  			this.setState({ [name]: event.target.value, errorMessage: null });

  	};
    onKeyDown = event => {
    		if (event.key === 'Enter') {
    			this.subscribeClick();
    		}
    	};
  render() {
    const {
      className,
      topOuterDivider,
      bottomOuterDivider,
      topDivider,
      bottomDivider,
      hasBgColor,
      invertColor,
      split,
      ...props
    } = this.props;

    const outerClasses = classNames(
      'cta section center-content-mobile reveal-from-bottom',
      topOuterDivider && 'has-top-divider',
      bottomOuterDivider && 'has-bottom-divider',
      hasBgColor && 'has-bg-color',
      invertColor && 'invert-color',
      className
    );

    const innerClasses = classNames(
      'cta-inner section-inner',
      topDivider && 'has-top-divider',
      bottomDivider && 'has-bottom-divider',
      split && 'cta-split'
    );

    return (
      <section
        {...props}
        className={outerClasses}
      >
        <div className="container">
          <div style={{borderRadius:'50px'}}
            className={innerClasses}
          >
            <div className="cta-slogan">
              <h3 className="m-0">
                Join the Waitlist
              </h3>
            </div>
            <div className="cta-action">
              <Input id="newsletter" type="email" label="Subscribe" labelHidden hasIcon="right" placeholder="Your best email" onKeyDown={this.onKeyDown} name="email"
							onChange={this.inputChange} style={{borderRadius:'50px'}}>
              <Button onClick={this.subscribeClick} style={{backgroundColor:'blue', color:'white', borderRadius:'20px', marginTop:'20px'}}>Submit</Button>
              </Input>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Cta.propTypes = propTypes;
Cta.defaultProps = defaultProps;

export default Cta;
