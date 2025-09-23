import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear field-specific error when typing
    setErrors({ ...errors, [e.target.name]: "" });
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setGeneralError("");
    setSuccess("");

    const { name, email, password, confirmPassword } = formData;

    // Frontend validations
    if (!name || !email || !password || !confirmPassword) {
      setGeneralError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setGeneralError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Display backend validation errors
        if (typeof data === "object") {
          setErrors(data);
        } else {
          setGeneralError("Registration failed. Please try again.");
        }
      } else {
        localStorage.setItem("token", data.token);
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    } catch (error) {
      setGeneralError("Registration failed. Please try again.");
    }
  };

  return (
  <div className="container-fluid vh-100 d-flex flex-column flex-md-row p-0 register-page">
    {/* Hero Image Section */}
    <div
      className="w-100 w-md-50 hero-image position-relative"
      style={{
        backgroundImage: `url('/Hero.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-overlay-text">
        General Conference Church
      </div>
    </div>

    {/* Form Section */}
    <div className="w-100 w-md-50 d-flex align-items-center justify-content-center bg-light form-section p-4">
      <div
        className="p-4 shadow rounded"
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h3 className="mb-4 text-center fw-bold text-primary">
          Create an Account
        </h3>

        {generalError && <div className="alert alert-danger fw-bold">{generalError}</div>}
        {success && <div className="alert alert-success fw-bold">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name..."
              onChange={handleChange}
              name="name"
            />
            {errors.username && <div className="text-danger">{errors.username[0]}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email..."
              onChange={handleChange}
              name="email"
            />
            {errors.email && <div className="text-danger">{errors.email[0]}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password..."
              onChange={handleChange}
              name="password"
            />
            {errors.password && <div className="text-danger">{errors.password[0]}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password..."
              onChange={handleChange}
              name="confirmPassword"
            />
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary px-5 fw-bold">
              Register
            </button>
          </div>

          <p className="text-center fw-bold mt-3">
            Already have an account?{" "}
            <Link to="/" style={{ textDecoration: "none" }}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
);

};

export default Register;
