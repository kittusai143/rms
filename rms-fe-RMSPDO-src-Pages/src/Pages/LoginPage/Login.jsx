
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { googleLogout, useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import TextCarousel from "./TextCarousel";
import "./Login.css";
import axios from "axios";
import { addUser } from "../../Store/reducers/loginReducer";
import EyeIcon from "./Images/EyeIcon";
import EyeCloseIcon from "./Images/EyeCloseIcon";
import EnvelopeIcon from "./Images/EnvelopeIcon";
import ArrowRIghtIcon from "./Images/ArrowRIghtIcon";
import image from './Images/Logo.png';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getReq , getLogin, postReq} from "../../Api/api";

import encode from "jwt-encode";
import Toast,{handleErrorToast,handleSuccessToast} from "../Toast";


let md5 = require('md5');
// const sign = require('jwt-encode');

const Login = () => {
  let Url = process.env.REACT_APP_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();

const handleTogglePassword = () => {
  setShowPassword(!showPassword);
};

const handleForgotPassword = () => {
  // console.log("Forgot Password clicked");
};

const handleLogin = async () => {
  let uname=username.toLowerCase();
  if(uname==="" || !uname.endsWith('@sagarsoft.in')){
    
    handleErrorToast("Please Enter valid Sagarsoft Email")
    return;
  }

  else if(password==="" ){
    handleErrorToast("Please Enter Password")
    return;
  }
  const hash = md5(password); // Hash the password using MD5
  const data = await getLogin(`${Url}loginByPassword/${username}/${hash}`); // Pass hashed password to the login endpoint
  if (data?.data?.message==="incorrect-password")
  handleErrorToast("Please enter a valid Credentials")
// console.log(data?.data);
// console.log(data?.data?.empRoleName);
  if (data?.data && data?.data?.empRoleName) {
    dispatch(addUser(data.data));
    if (data?.data?.empRoleName === "PMO Analyst") {
      navigate("/pmologinview");
    }  else if(data?.data?.empRoleName === "Resource Manager"||data?.data?.empRoleName === "Management"||data?.data?.empRoleName === "Higher Management"){
      console.log("hi")
      navigate("/rmloginview");
      console.log("hello")
    }
    else if(data?.data?.empRoleName=="Manager")
    {
      navigate("/resource")
    }
    else
    {
      // console.log("error");
      handleErrorToast("You have no access to this site")
    }
  } else {
    navigate("/");
  }
};

const handleSuccess =async (credential) => {
  const decoded = jwtDecode(credential.credential);
  // dispatch(addUser(decoded))
  if(decoded){
   let Url = process.env.REACT_APP_URL;

    //// console.log(Url,"---->",decoded) //verify?email=john.doe@example.com
    let routeUrl = Url+ `login/verify?email=${decoded.email}`
    let data = await getLogin(routeUrl);
    
    //// console.log("hello world", data?.data)
   if( data?.data && data?.data?.empRoleName ){
    //// console.log("hello world")
    data.data.imageUrl = decoded.picture
    dispatch(addUser(data.data))
    
    if(data?.data?.empRoleName=="HR Manager"){
      navigate("/dashboard")
    }
    else {
      navigate("/dashboard")
    }
    }
   else{
    navigate("/")
   }
    
  }
  //// console.log("Logged in as", credential, "with role",decoded);
};



return (
  <main id="loginScreen">
    <Toast></Toast>
    <Container fluid className="g-0">
      <Row className="g-0 h-100vh">
        <Col lg={6} className="d-lg-block d-none">
          <div className="login-left">
            <div className="login-content">
              <h1>Welcome Folks! </h1>
              <h3 className="mb-4">Resource Management System</h3>
            </div>
            <div>
            <TextCarousel/>
            </div>
            <div className="login-navigation">
              <ul>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms &amp; Conditions</a>
                </li>
                <li>
                  <a href="#">About Us</a>
                </li>
              </ul>
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="login-right">
            <div className="auth-screen h-100vh login-form">
            <img
                src={image}
                alt="error img"
                className="img-fluid"
                style={{width:'150px'}}
            />
              <p>Resource Management System</p>
              <Form>
                <InputGroup className="mb-4">
                  <Input
                    type="email"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                      // console.log(e);
                      if (e.key === "Enter") {
                        handleLogin(); 
                      }
                    }
                  }   
                  />
                  <InputGroupText className="input-icon">
                    <EnvelopeIcon />
                  </InputGroupText>
                </InputGroup>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                          handleLogin(); 
                      }
                  }}
                  />
                  <InputGroupText
                    className="input-icon"
                    onClick={handleTogglePassword}
                  >
                    {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
                  </InputGroupText>
                </InputGroup>
                <div className="d-flex justify-content-between align-items-center my-4">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      Remember Me
                    </Label>
                  </FormGroup>
                  <div
                    className="forgot-password"
                    onClick={handleForgotPassword}
                  >
                  </div>
                </div>
                <button
                  className="btn button-primary button-icon w-100 w-lg-50 mx-auto py-2"
                  type="button"
                  onClick={handleLogin}
                >
                  Login 
                  {/* /<ArrowRightIcon /> */}
                </button>
              
              </Form>
              <br></br>
              <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => {
                    //// console.log("Login Failed");
                  }}
                />
              <p className="signup-text mt-5">
                Don't have an account? <a href="#">SignUp</a>
              </p>
            </div>
            <p className="need-help">Need Help?</p>
          </div>
        </Col>
      </Row>
    </Container>
  </main>
);
};

export default Login;