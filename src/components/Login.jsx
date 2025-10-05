import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.margin = "initial";
      document.body.style.padding = "initial";
    };
  }, []);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressComplete, setProgressComplete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setSuccess("");
    setIsSubmitting(true);

    const { username, password } = formData;

    if (!username || !password) {
      setGeneralError("Both username and password are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        "https://church-portal-backend.onrender.com/api/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        switch (data.detail) {
          case "User does not exist.":
            setGeneralError(
              <>
                User does not exist. <br />
                <small>
                  Don’t have an account?{" "}
                  <Link to="/register" className="text-info">
                    Register here
                  </Link>
                </small>
              </>
            );
            break;
          case "Incorrect password.":
            setGeneralError("Incorrect password. Please try again.");
            break;
          default:
            setGeneralError("Login failed. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setSuccess("Login successful!");
      setProgressComplete(true);
      setFormData({ username: "", password: "" });

      setTimeout(() => setFadeOut(true), 2000);
      setTimeout(() => navigate("/home"), 2200);
    } catch (error) {
      console.error("Login error:", error);
      setGeneralError("Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container d-flex flex-column flex-md-row vh-100">
      {/* Hero image section */}
      <div className="hero-image-section w-100 w-md-50 d-flex align-items-center justify-content-center">
        <div className="text-overlay text-center text-white">
          <h1 className="fw-bold display-6">Welcome Back</h1>
          <p className="lead mb-0">General Conference Youth Hub</p>
        </div>
      </div>

      {/* Form section */}
      <div className="form-section w-100 w-md-50 d-flex align-items-center justify-content-center p-4 bg-light">
        <div className="form-wrapper shadow rounded p-4 w-100" style={{ maxWidth: "400px" }}>
          <h3 className="mb-4 text-center fw-bold text-primary">Login</h3>

          {generalError && <div className="alert alert-danger">{generalError}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="e.g. john_doe"
                value={formData.username}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control pe-5"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-primary fw-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <p className="text-center fw-bold">
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none text-info">Register</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Styles */}
      <style jsx="true">{`
        .login-container {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .hero-image-section {
          background: url("/Hero.jpg") center/cover no-repeat;
          height: 50vh;
        }

        @media (min-width: 768px) {
          .hero-image-section {
            height: 100vh;
          }
        }

        .text-overlay {
          background: rgba(0, 0, 0, 0.4);
          padding: 2rem;
          border-radius: 10px;
        }

        .form-section {
          height: 50vh;
        }

        @media (min-width: 768px) {
          .form-section {
            height: 100vh;
          }
        }

        .form-wrapper {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 0 25px rgba(30, 144, 255, 0.2);
        }

        .form-control:focus {
          border-color: #1e90ff;
          box-shadow: 0 0 5px #1e90ff;
        }

        .password-toggle-btn {
          position: absolute;
          top: 50%;
          right: 1rem;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #888;
          cursor: pointer;
        }

        .password-toggle-btn:hover {
          color: #1e90ff;
        }
      `}</style>
    </div>
  );
};

export default Login;
