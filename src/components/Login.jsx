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

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    <div className="container-fluid vh-100 d-flex flex-column flex-md-row p-0 login-page">
      {/* Hero Image Section */}
      <div className="w-100 w-md-50 hero-image position-relative">
        <div className="hero-overlay-text fw-bold church-name">
          General Conference Church
        </div>
      </div>

      {/* Form Section */}
      <div className="w-100 w-md-50 d-flex align-items-center justify-content-center bg-light form-section p-4">
        <div className="shadow rounded p-4">
          <h3 className="mb-4 text-primary fw-bold text-center">Login</h3>

          {generalError && (
            <div className="alert alert-danger fw-bold">{generalError}</div>
          )}
          {success && <div className="alert alert-success fw-bold">{success}</div>}

          {progressComplete && (
            <div
              className={`login-progress-bar ${
                progressComplete ? "complete" : ""
              } ${fadeOut ? "fade-out" : ""}`}
              aria-hidden="true"
            ></div>
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
              />
              {errors.username && (
                <div className="text-danger">{errors.username[0]}</div>
              )}
            </div>

            <div className="mb-3 password-input-wrapper">
              <label htmlFor="password" className="form-label fw-bold">
                Password:
              </label>
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
              {errors.password && (
                <div className="text-danger">{errors.password[0]}</div>
              )}
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

      {/* Styles */}
      <style jsx>{`
        .login-page {
          font-family: "Poppins", sans-serif;
          background: linear-gradient(135deg, #1e90ff 0%, #87cefa 100%);
          height: 100vh;
          overflow: hidden;
        }

        /* Hero Image Section */
        .hero-image {
          background: url("/Hero.jpg") center/cover no-repeat;
          filter: brightness(0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2.5rem;
          letter-spacing: 3px;
          user-select: none;
          position: relative;
        }

        .church-name {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 900;
          text-transform: uppercase;
          text-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
          padding: 0 1rem;
          text-align: center;
        }

        /* Form Section */
        .form-section {
          background: #f9fbff;
          border-radius: 16px 0 0 16px;
          box-shadow: 0 12px 28px rgba(30, 144, 255, 0.25);
          padding: 3rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shadow {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 12px 24px rgba(30, 144, 255, 0.3);
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          transition: box-shadow 0.3s ease-in-out;
        }

        .shadow:hover {
          box-shadow: 0 18px 36px rgba(30, 144, 255, 0.5);
        }

        /* Title */
        .text-primary {
          color: #1e90ff !important;
          font-weight: 900;
          font-size: 2.25rem;
          text-align: center;
          letter-spacing: 1.5px;
          margin-bottom: 1.75rem;
          user-select: none;
          text-shadow: 1px 1px 3px rgba(30, 144, 255, 0.6);
        }

        /* Inputs */
        .form-control {
          border: 2px solid #87cefa;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-control:focus {
          border-color: #1e90ff;
          outline: none;
          box-shadow: 0 0 8px #1e90ff;
          background-color: #e6f0ff;
        }

        /* Password Toggle */
        .password-input-wrapper {
          position: relative;
        }

        .password-toggle-btn {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.3rem;
          color: #1e90ff;
          user-select: none;
          transition: color 0.3s ease;
        }

        .password-toggle-btn:hover {
          color: #0c6cd9;
        }

        /* Buttons */
        .btn-primary {
          background: linear-gradient(90deg, #1e90ff, #87cefa);
          border: none;
          padding: 0.75rem;
          font-size: 1.2rem;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(30, 144, 255, 0.4);
          transition: all 0.3s ease-in-out;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(90deg, #00bfff, #1e90ff);
          box-shadow: 0 12px 26px rgba(30, 144, 255, 0.6);
          transform: translateY(-3px);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Alerts */
        .alert-danger,
        .alert-success {
          border-radius: 8px;
          font-weight: 700;
          text-align: center;
          user-select: none;
        }

        /* Progress bar */
        .login-progress-bar {
          height: 5px;
          background: #87cefa;
          border-radius: 5px;
          margin-bottom: 1rem;
          transform-origin: left center;
          animation: progressBar 1.8s linear forwards;
        }

        .login-progress-bar.complete {
          background: #1e90ff;
        }

        .login-progress-bar.fade-out {
          animation: fadeOut 0.4s ease forwards;
        }

        @keyframes progressBar {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
          }
        }

        /* Register Link */
        p.text-center a {
          color: #1e90ff;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        p.text-center a:hover {
          color: #0c6cd9;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .form-section {
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 2rem 1.5rem !important;
          }
          .hero-image {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
