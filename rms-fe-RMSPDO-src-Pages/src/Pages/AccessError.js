import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React from 'react';
import image from '../Images/Error-404.png';

const AccessError = () => {
    let navigate = useNavigate();
    let select = useSelector((state) => state?.login?.tasks);
    let id = select[0].empRoleName;
    // console.log(id)
    const nav = () => {
        if (id === "Manager"){
            navigate('/resource')
        }
        else if(id ==="PMO Analyst"){
            navigate("/pmologinview")
        }
        else{
            navigate('/rmloginview')
        }
    }

    return (
        <div className="text-center">
            <img
                src={image}
                alt="error img"
                className="img-fluid"
                style={{width:'70vh',margin:'50px'}}
            />
            <div className="mt-3">
                <h3 className="text-uppercase">Sorry, Page not Found 😭</h3>
                <p className="text-muted mb-4">
                    The page you are looking for not available!
                </p>
                <div onClick={()=>{nav()}} className="btn btn-success">
                    <i className="mdi mdi-home me-1"></i>Back to home
                </div>
            </div>
        </div>
    );

}


export default AccessError;

