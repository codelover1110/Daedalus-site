import React from 'react';
import GenericSection from '../../../components/sections/GenericSection';

class Backtest extends React.Component {
  render() {
    return (
      <React.Fragment>
        <GenericSection topDivider>

          <div style={{ color: "white" }}>We Are Backtesting</div>
        </GenericSection>
      </React.Fragment>
    );
  }
}

export default Backtest;
