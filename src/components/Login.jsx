import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Add your login logic here
    try {
      // Simulate login
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/dashboard");
      }, 1000);
    } catch {
      setError("Login failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Styles for emoji inside password input */}
      <style>{`
        .password-wrapper {
          position: relative;
          width: 100%;
        }
        .password-input {
          padding-right: 2.5rem; /* space for emoji */
        }
        .toggle-password {
          position: absolute;
          top: 50%;
          right: 0.75rem;
          transform: translateY(-50%);
          cursor: pointer;
          user-select: none;
          font-size: 1.2rem;
        }
      `}</style>

      <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="mb-4 text-center">Login</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Password with emoji toggle */}
            <div className="mb-3 password-wrapper">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-control password-input"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              <span
                className="toggle-password"
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={toggleShowPassword}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleShowPassword();
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <Link to="/register" style={{ textDecoration: "none" }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
