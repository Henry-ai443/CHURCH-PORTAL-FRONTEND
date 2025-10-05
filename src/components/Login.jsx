import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setGeneralError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!formData.username || !formData.password) {
      setGeneralError("Username and password are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise((res) => setTimeout(res, 1500));
      setSuccess("Login successful!");
      setTimeout(() => navigate("/home"), 1500);
    } catch {
      setGeneralError("Login failed. Try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        /* Make sure root covers full viewport */
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          font-family: system-ui, sans-serif;
        }

        .container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
        }

        @media (min-width: 768px) {
          .container {
            flex-direction: row;
          }
        }

        /* Hero styles */
        .hero {
          width: 100vw;
          height: 50vh;
          background: url('/Hero.jpg') center/cover no-repeat;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .hero {
            width: 50vw;
            height: 100vh;
          }
        }

        .hero-text {
          background: rgba(0, 0, 0, 0.7);
          padding: 40px 60px;
          border-radius: 60px;
          color: white;
          text-align: center;
          max-width: 90vw;
          pointer-events: none;
          user-select: none;
        }

        .hero-text svg {
          width: 100%;
          height: 150px;
          margin-bottom: 10px;
        }

        .hero-text .slogan {
          font-size: 1.2rem;
          font-style: italic;
          margin-top: 0.5rem;
        }

        /* Form section */
        .form-section {
          width: 100vw;
          height: 50vh;
          background: #f8f9fa;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          overflow-y: auto;
        }

        @media (min-width: 768px) {
          .form-section {
            width: 50vw;
            height: 100vh;
          }
        }

        .form-box {
          width: 100%;
          max-width: 400px;
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 0 12px rgba(30, 144, 255, 0.4);
        }

        .form-box h3 {
          color: #1e90ff;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .form-box .btn-primary {
          background-color: #1e90ff;
          border: none;
          width: 100%;
          padding: 0.75rem;
          font-weight: bold;
          box-shadow:
            0 0 10px rgba(30, 144, 255, 0.7),
            0 0 20px rgba(135, 206, 250, 0.7);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          border-radius: 5px;
        }

        .form-box .btn-primary:hover:not(:disabled) {
          box-shadow:
            0 0 20px rgba(30, 144, 255, 0.9),
            0 0 40px rgba(135, 206, 250, 0.8);
          transform: translateY(-2px);
        }

        .form-box input[type="text"],
        .form-box input[type="password"] {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }

        .form-box label {
          font-weight: 600;
        }

        .form-check {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .form-check input {
          margin-right: 0.5rem;
        }

        .error-message {
          color: #dc3545;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }

        .success-message {
          color: #198754;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }

        .password-toggle-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 1.2rem;
          color: #555;
          user-select: none;
          padding: 0;
        }

        .password-wrapper {
          position: relative;
        }

        .register-link {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
        }

        .register-link a {
          color: #1e90ff;
          text-decoration: underline;
        }
      `}</style>

      <div className="container" role="main">
        <section className="hero" aria-label="Hero image">
          <div className="hero-text" aria-hidden="true">
            <svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
              <path
                id="curve"
                fill="transparent"
                d="M50,140 A200,200 0 0,1 450,140"
              />
              <text
                textAnchor="middle"
                fill="white"
                fontWeight="700"
                fontSize="34px"
                letterSpacing="1px"
              >
                <textPath href="#curve" startOffset="50%">
                  GENERAL CONFERENCE YOUTH HUB
                </textPath>
              </text>
            </svg>
            <div className="slogan">Uniting youths in Christ</div>
          </div>
        </section>

        <section className="form-section" aria-label="Login form">
          <div className="form-box">
            <h3>Login</h3>
            {generalError && (
              <div className="error-message" role="alert">
                {generalError}
              </div>
            )}
            {success && (
              <div className="success-message" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                disabled={isSubmitting}
                required
              />

              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  required
                  style={{ paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="password-toggle-btn"
                  disabled={isSubmitting}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div className="form-check">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="register-link">
              Don't have an account?{" "}
              <Link to="/register">Register here</Link>.
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Login;
