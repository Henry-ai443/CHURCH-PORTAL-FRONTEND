import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    // Reset margin/padding and hide overflow to prevent scroll
    document.documentElement.style.height = "100%";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.height = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
      document.body.style.height = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
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

    const { username, password, rememberMe } = formData;

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

      if (rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

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
        /* Reset all margins and paddings */
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .register-page {
          display: flex;
          flex-direction: column;
          height: 100vh; /* Full viewport height */
          margin: 0;
          padding: 0;
        }

        @media (min-width: 768px) {
          .register-page {
            flex-direction: row;
          }
        }

        .hero-image {
          flex: 1 1 0;
          height: 100%;
          background-image: url('/Hero.jpg');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-overlay-text-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.55);
          padding: 25px 40px 50px 40px;
          border-radius: 50px;
          max-width: 90vw;
          text-align: center;
          user-select: none;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .semi-circular-text {
          width: 100%;
          height: 160px;
          overflow: visible;
          margin-bottom: 12px;
        }

        .semi-circular-text text {
          fill: white;
          font-weight: 700;
          font-size: 36px;
        }

        .slogan-text {
          font-size: 18px;
          font-weight: 600;
          font-style: italic;
          color: white;
          user-select: none;
          margin-top: 4px;
        }

        .form-section {
          flex: 1 1 0;
          height: 100%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0; /* No padding to avoid extra height */
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          box-shadow: 0 0 12px rgba(30, 144, 255, 0.4);
          border-radius: 8px;
          background: white;
          padding: 2rem;
          box-sizing: border-box;
          overflow-y: auto; /* Scroll inside form if needed */
          max-height: 90vh;
        }

        .btn-primary {
          box-shadow: 0 0 10px rgba(30, 144, 255, 0.7), 0 0 20px rgba(135, 206, 250, 0.7);
          transition: all 0.3s ease-in-out;
        }
        .btn-primary:hover {
          box-shadow: 0 0 20px rgba(30, 144, 255, 0.9), 0 0 40px rgba(135, 206, 250, 0.8);
          transform: translateY(-2px);
        }

        .login-progress-bar {
          height: 4px;
          background: #1e90ff;
          width: 0%;
          border-radius: 2px;
          transition: width 2s ease;
          margin-bottom: 12px;
        }
        .login-progress-bar.complete {
          width: 100%;
        }
        .login-progress-bar.fade-out {
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        /* Password toggle button */
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

        .form-check-label {
          user-select: none;
        }
      `}</style>

      <div className="container-fluid p-0 register-page">
        <div className="hero-image" aria-hidden="true">
          <div className="hero-overlay-text-wrapper">
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
            <div className="slogan-text">Uniting youths in Christ</div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-container">
            <h3 className="mb-4 text-center fw-bold text-primary">Login</h3>

            {generalError && (
              <div
                className="alert alert-danger fw-bold"
                aria-live="assertive"
                role="alert"
              >
                {generalError}
              </div>
            )}
            {success && (
              <div
                className="alert alert-success fw-bold"
                aria-live="polite"
                role="status"
              >
                {success}
              </div>
            )}

            {progressComplete && (
              <div
                className={`login-progress-bar ${
                  progressComplete ? "complete" : ""
                } ${fadeOut ? "fade-out" : ""}`}
                aria-hidden="true"
              />
            )}

            <form onSubmit={handleSubmit} noValidate>
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
                  required
                  autoFocus
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
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="password-toggle-btn"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {errors.password && (
                  <div className="text-danger">{errors.password[0]}</div>
                )}
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label
                  className="form-check-label fw-bold"
                  htmlFor="rememberMe"
                >
                  Remember me
                </label>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Link
                  to="/forgot-password"
                  style={{ fontWeight: "600", textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary px-5 fw-bold d-flex align-items-center justify-content-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>

              <p className="text-center fw-bold mt-3">
                Don't have an account?{" "}
                <Link to="/register" style={{ textDecoration: "none" }}>
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
