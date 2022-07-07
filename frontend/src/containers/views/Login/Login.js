import React from 'react';
import LoginForm from '../../../components/sections/LoginForm';

class Login extends React.Component {
  render() {
    return (
      <div className="container mx-auto ">
        <LoginForm className="m-auto" />
      </div>
    );
  }
}

export default Login;
