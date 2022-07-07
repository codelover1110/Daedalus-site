import React from 'react';
import {Link }from 'react-router-dom';
import GenericSection from '../../../components/sections/GenericSection';
class NotFound extends React.Component {
  render() {
    return (
      <React.Fragment>
      <GenericSection topDivider>
<h1>The Page You Are Looking For Doesn't Exist</h1>
<Link to ="/">
<div> Click Here to Return Home</div>
</Link>
</GenericSection>
</React.Fragment>

    );
  }
}

export default NotFound;
