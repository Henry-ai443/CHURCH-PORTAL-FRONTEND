import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    // Disable scrolling globally
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.body.style.margin = "initial";
      document.body.style.padding = "initial";
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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors({});
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
        setGeneralError(data.detail || "Login failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      console.error("Login error:", error);
      setGeneralError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="vh-100 vw-100 d-flex flex-column flex-md-row p-0"
      style={{
        overflow: "hidden",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Hero Section */}
      <div
        className="hero-section position-relative w-100 w-md-50"
        style={{
          backgroundImage: `url('/Hero.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "40vh",
        }}
      >
        <div
          className="hero-overlay-text d-flex flex-column justify-content-center align-items-center text-center"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.65)",
            borderRadius: "30px",
            width: "85%",
            height: "80%", // dark patch covers 80% of hero
            color: "white",
            fontWeight: "700",
            letterSpacing: "1px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "1.8rem",
              lineHeight: "1.2",
            }}
          >
            GENERAL CONFERENCE YOUTH HUB
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "1.2rem",
              fontStyle: "italic",
              fontWeight: "600",
            }}
          >
            Uniting youths in Christ
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div
        className="form-section d-flex align-items-center justify-content-center bg-light w-100 w-md-50"
        style={{
          height: "60vh",
        }}
      >
        <div
          className="p-4 shadow rounded bg-white"
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <h3 className="mb-4 text-center fw-bold text-primary">Login</h3>

          {generalError && (
            <div className="alert alert-danger fw-bold" aria-live="assertive">
              {generalError}
            </div>
          )}
          {success && (
            <div className="alert alert-success fw-bold" aria-live="polite">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your username..."
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label fw-bold">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                placeholder="Enter your password..."
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                style={{
                  paddingRight: "3rem", // space for emoji
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isSubmitting}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "0.8rem",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "#555",
                  userSelect: "none",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Remember Me */}
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
              <label className="form-check-label" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center fw-bold mt-3">
            Don't have an account?{" "}
            <Link to="/register" style={{ textDecoration: "none" }}>
              Register here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
