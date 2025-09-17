import { div } from "framer-motion/client";
import React, { useEffect, useState } from "react";


const Register = () => {

    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.margin = "0";
        document.body.style.padding ="0";
    })

    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:""
    });

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    return(
        <div className="d-flex vh-100 register-page">
            <div className="col-6 d-none d-md-block position relative"
            style={{
                backgroundImage:`url(${'/Hero.jpg'})`,
                backgroundSize:"cover",
                backgroundPosition:"center"
            }}
            >

            </div>

            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-light form-section">
                <div className="p-4 shadow rounded"
                style={{
                    width:"100%",
                    maxWidth:"400px",
                }}
                >
                    <h3 className="mb-4 text-center fw-bold text-primary">Create an Account</h3>
                    <form action="">
                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Name:</label>
                            <input type="text" className="form-control"  placeholder="Enter your name.."/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Email:</label>
                            <input type="email"className="form-control"  placeholder="Enter your email.."/>
                        </div>

                         <div className="mb-3">
                            <label htmlFor="" className="form-label">Password:</label>
                            <input type="password"className="form-control"  placeholder="Enter your password.."/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Confirm Password:</label>
                            <input type="password" className="form-control" placeholder="Confirm password"/>
                        </div>

                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary px-5 fw-bold">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Register