import React from 'react'
import {Link} from "react-router-dom";

const Success = () => {
  return (
    <div className="w-auto m-auto">
      <h1>Your subscription has been successfully processed!</h1>
      <Link to="/home" className="btn btn-primary">Go to home</Link>
    </div>
  )
}
export default Success
