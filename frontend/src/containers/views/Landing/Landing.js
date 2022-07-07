import React from 'react';
import HeroSplit from '../../../components/sections/HeroSplit';

import Cta from '../../../components/sections/Cta';
import Firebase from 'firebase';

class Home extends React.Component {
  writeData = () => {
    Firebase.database().ref('/').set(this.state);
    console.log('DATA SAVED');
  }

  getData = () => {
    let ref = Firebase.database().ref('/');
    ref.on('value', snapshot => {
      const state = snapshot.val();
      this.setState(state);
    });
    console.log('DATA RETRIEVED');
  }
  state = {
    videoModalActive: false
  }
  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.writeData();
    }
  }
  render() {
    return (
      <React.Fragment>
        <HeroSplit className="illustration-section-01" />
        <Cta split />
      </React.Fragment>
    );
  }
}

export default Home;
