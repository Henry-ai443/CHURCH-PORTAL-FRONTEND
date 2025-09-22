import { form } from "framer-motion/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


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
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if(!formData.email || !formData.password || !formData.name || !formData.confirmPassword){
            setError("All fields are required");
            return;
        }
        if(formData.password !== formData.confirmPassword){
            setError("Passwords do not match");
            return;
        }
        console.log(formData.name, formData.email, formData.password);

        try{
            const response = await fetch("http://10.111.8.15:8000/api/register/", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    username:formData.name,
                    email:formData.email,
                    password:formData.password
                })
            });

            const data = await response.json();
            if(response.ok){
                setSuccess("Registration successful! You can now log in.");
                setFormData({
                    name:"",
                    email:"",
                    password:"",
                    confirmPassword:""
                });
                setTimeout(() => {
                    navigate("/home");
                }, 3000);
            }else{
                if(data.username){
                    console.log("Error", data);
                    setError(data.username[0]);
                }
            }
        }catch(error){
            setError("Registration failed. Please try again.");
        }
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
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form action=""
                    onSubmit={handleSubmit}
                    >
                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Name:</label>
                            <input type="text" className="form-control"  placeholder="Enter your name.." onChange={handleChange} name="name"/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Email:</label>
                            <input type="email"className="form-control"  placeholder="Enter your email.." onChange={handleChange} name="email"/>
                        </div>

                         <div className="mb-3">
                            <label htmlFor="" className="form-label">Password:</label>
                            <input type="password"className="form-control"  placeholder="Enter your password.." onChange={handleChange} name="password"/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Confirm Password:</label>
                            <input type="password" className="form-control" placeholder="Confirm password" onChange={handleChange} name="confirmPassword"/>
                        </div>

                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary px-5 fw-bold">Register</button>
                        </div>
                        <p className="text-center fw-bold" style={{margin:"10px"}}>Already have an account ?
                            <a  
                            style={{textDecoration:"none"}}
                            href="/login">Login</a></p>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Register