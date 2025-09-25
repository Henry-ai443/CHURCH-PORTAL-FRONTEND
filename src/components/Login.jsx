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
  const [showPassword, setShowPassword] = useState(false); // <-- password toggle state

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear field-specific error when typing
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
    <div className="container-fluid vh-100 d-flex flex-column flex-md-row p-0 register-page">
      {/* Hero Image Section */}
      <div className="w-100 w-md-50 hero-image position-relative">
        <div className="hero-overlay-text fw-bold church-name">
          General Conference Church
        </div>
      </div>

      {/* Form Section */}
      <div className="w-100 w-md-50 d-flex align-items-center justify-content-center bg-light form-section p-4">
        <div
          className="shadow rounded p-4"
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <h3 className="mb-4 text-center fw-bold text-primary">Login</h3>

          {generalError && (
            <div className="alert alert-danger fw-bold">{generalError}</div>
          )}
          {success && <div className="alert alert-success fw-bold">{success}</div>}

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

  {/* Wrapper div with relative position */}
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
      style={{ paddingRight: "2.5rem" }} // space for the button
    />

    {/* Password toggle button */}
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      tabIndex={-1}
      style={{
        position: "absolute",
        top: "50%",
        right: "0.75rem",
        transform: "translateY(-50%)",
        border: "none",
        background: "transparent",
        padding: "0",
        cursor: "pointer",
        fontSize: "1.2rem",
        color: "#555",
        userSelect: "none",
        height: "1.5em",
        lineHeight: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showPassword ? "🙈" : "👁️"}
    </button>
  </div>

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
    </div>
  );
};

export default Login;
