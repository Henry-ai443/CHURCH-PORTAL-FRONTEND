import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    // Disable body scroll on desktop, allow scroll on phones
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };

    handleResize(); // Set on mount
    window.addEventListener("resize", handleResize);

    // Remove margin and padding always
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.margin = "initial";
      document.body.style.padding = "initial";
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressComplete, setProgressComplete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors({ ...errors, [name]: "" });
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
                User does not exist.
                <br />
                <small>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{ color: "#1E90FF", textDecoration: "underline" }}
                  >
                    Register here
                  </Link>
                  .
                </small>
              </>
            );
            break;

          case "Incorrect password.":
            setGeneralError("Incorrect password. Please try again.");
            break;

          case "Username and password are required.":
            setGeneralError("Both username and password are required.");
            break;

          default:
            setGeneralError("Login failed. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      localStorage.setItem("token", data.token);
      setSuccess("Login successful!");
      setProgressComplete(true);
      setFormData({ username: "", password: "", rememberMe: false });

      setTimeout(() => setFadeOut(true), 2000);
      setTimeout(() => navigate("/home"), 2200);
    } catch (error) {
      console.error("Login error:", error);
      setGeneralError("Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        .container-fluid {
          height: 100vh;
          padding: 0 !important;
          margin: 0 !important;
          display: flex;
          flex-direction: row;
          overflow: hidden;
        }
        @media (max-width: 767px) {
          .container-fluid {
            flex-direction: column;
            height: 100vh; /* Fixed 100vh for half-half split */
            overflow: hidden;
          }
        }

        .hero-image {
          position: relative;
          background: url("/Hero.jpg") center/cover no-repeat;
          width: 50%;
          height: 100vh;
          min-height: 400px;
          overflow: visible;
          flex-shrink: 0;
        }
        @media (max-width: 767px) {
          .hero-image {
            width: 100%;
            height: 50vh; /* Exactly half screen height */
            min-height: auto;
          }
        }

        .hero-overlay-text-wrapper {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.5);
          padding: 10px 25px;
          border-radius: 30px 30px 0 0;
          filter: drop-shadow(0 0 8px #1E90FF);
          user-select: none;
          max-width: 90vw;
          overflow: visible;
          pointer-events: none;
          z-index: 2;
        }

        .semi-circular-text {
          width: 100%;
          height: 100px;
          display: block;
          overflow: visible;
        }

        .semi-circular-text text {
          fill: #1E90FF;
          font-weight: 700;
          font-size: 28px;
          filter:
            drop-shadow(0 0 5px #1E90FF)
            drop-shadow(0 0 10px #1E90FF)
            drop-shadow(0 0 15px #1E90FF);
        }

        .form-section {
          width: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 3rem;
          overflow-y: auto;
        }
        @media (max-width: 767px) {
          .form-section {
            width: 100%;
            height: 50vh; /* Exactly half screen height */
            padding: 2rem 1.5rem 3rem;
            order: 2;
            overflow-y: auto; /* allow scroll if needed */
            min-height: auto;
          }
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          background: white;
          padding: 2rem 2.5rem;
          border-radius: 8px;
          box-shadow:
            0 0 10px rgba(30, 144, 255, 0.3),
            0 0 30px rgba(135, 206, 250, 0.4);
          overflow-y: auto;
        }

        h3 {
          margin-bottom: 1.5rem;
          color: #1E90FF;
          font-weight: 700;
          text-align: center;
        }

        .btn-primary.glow-btn {
          box-shadow: 0 0 10px rgba(30, 144, 255, 0.7), 0 0 20px rgba(135, 206, 250, 0.7);
          transition: all 0.3s ease-in-out;
          font-weight: 700;
        }
        .btn-primary.glow-btn:hover {
          box-shadow: 0 0 20px rgba(30, 144, 255,0.9), 0 0 40px rgba(135, 206, 250, 0.8);
          transform: translateY(-2px);
        }

        .login-progress-bar {
          height: 5px;
          background: #1E90FF;
          border-radius: 3px;
          margin-bottom: 1rem;
          width: 0;
          transition: width 1.5s ease-in-out;
        }
        .login-progress-bar.complete {
          width: 100%;
        }
        .login-progress-bar.fade-out {
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }

        /* Password toggle button styles */
        .password-toggle-btn {
          position: absolute;
          top: 50%;
          right: 0.75rem;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          font-size: 1.2rem;
          color: #555;
          user-select: none;
          height: 1.5em;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Checkbox + label */
        .form-check-label {
          user-select: none;
          cursor: pointer;
        }

        /* Forgot password link */
        .forgot-password {
          font-size: 0.9rem;
          color: #1E90FF;
          text-decoration: underline;
          cursor: pointer;
        }
        .forgot-password:hover {
          color: #104E8B;
        }
      `}</style>

      <div className="container-fluid" role="main" aria-label="Login page">
        {/* Hero Image Section */}
        <div className="hero-image" aria-hidden="true">
          <div className="hero-overlay-text-wrapper" aria-hidden="true">
            <svg
              viewBox="0 0 500 150"
              className="semi-circular-text"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="General Conference Youth Hub"
            >
              <path
                id="curve"
                fill="transparent"
                d="M50,140 A200,200 0 0,1 450,140"
              />
              <text textAnchor="middle">
                <textPath href="#curve" startOffset="50%">
                  GENERAL CONFERENCE YOUTH HUB
                </textPath>
              </text>
            </svg>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <div className="form-container" aria-label="Login form">
            <h3>Login</h3>

            {generalError && (
              <div
                className="alert alert-danger fw-bold"
                role="alert"
                tabIndex={-1}
              >
                {generalError}
              </div>
            )}
            {success && (
              <div
                className="alert alert-success fw-bold"
                role="alert"
                tabIndex={-1}
              >
                {success}
              </div>
            )}

            {/* Progress Bar */}
            {progressComplete && (
              <div
                className={`login-progress-bar ${
                  progressComplete ? "complete" : ""
                } ${fadeOut ? "fade-out" : ""}`}
                aria-hidden="true"
              ></div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-bold">
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  placeholder="Username...(e.g., john_doe)"
                  onChange={handleChange}
                  name="username"
                  value={formData.username}
                  autoComplete="username"
                  aria-invalid={errors.username ? "true" : "false"}
                  disabled={isSubmitting}
                />
                {errors.username && (
                  <div className="text-danger">{errors.username[0]}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">
                  Password:
                </label>

                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    placeholder="Enter your password..."
                    onChange={handleChange}
                    name="password"
                    value={formData.password}
                    autoComplete="current-password"
                    aria-invalid={errors.password ? "true" : "false"}
                    disabled={isSubmitting}
                    style={{ paddingRight: "2.5rem" }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                    className="password-toggle-btn"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {errors.password && (
                  <div className="text-danger">{errors.password[0]}</div>
                )}
              </div>

              <div className="mb-3 form-check d-flex justify-content-between align-items-center">
                <div>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    className="form-check-input"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="form-check-label ms-2"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="forgot-password"
                  tabIndex={isSubmitting ? -1 : 0}
                >
                  Forgot password?
                </Link>
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary glow-btn"
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

