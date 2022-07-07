import React, {useEffect} from 'react'
import {useAuth} from "../../../contexts/auth_ctx";
import GenericSection from "../../../components/sections/GenericSection";
import { NotificationManager } from "react-notifications";
import {useNavigate} from "react-router-dom";

const EmailVerify = () => {
  const navigation = useNavigate()
  const {currentUser} = useAuth();
  useEffect(()=>{
    if(currentUser.emailVerified) {
      navigation('/Home')
    }else{
    }
  },[currentUser])

  const resend = () => {
    currentUser.sendEmailVerification()
      .then(()=>{
        NotificationManager.success('Verification email has been successfully sent.')
      })
      .catch(()=>{
        NotificationManager.error('Failed to send verification email.')
      })
  }
  return (
    <GenericSection topDivider>

      <div
        style={{
          color: "white",
          fontWeight: "bold",
          marginBottom: "40px",
        }}
      >
        <p className="text-center">Please verify your email address.</p>
        <p className="text-center">If you haven't receive the verification email, please click below to
          &nbsp;<a href="#" onClick={()=>resend()} className="text-primary">resend</a>
        </p>
      </div>
    </GenericSection>
  )
}
export default EmailVerify
