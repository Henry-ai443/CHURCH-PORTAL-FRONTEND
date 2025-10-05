import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Disable scrolling only on mobile
    if (isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.margin = "initial";
      document.body.style.padding = "initial";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.margin = "initial";
      document.body.style.padding = "initial";
    };
  }, [isMobile]);

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
      setTimeout(() => navigate("/home"), 2500);
    } catch (error) {
      console.error("Login error:", error);
      setGeneralError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`container-fluid vh-100 d-flex p-0 ${
        isMobile ? "flex-column" : "flex-md-row"
      } register-page`}
    >
      {/* Hero Section */}
      <div
        className="hero-image position-relative d-flex align-items-center justify-content-center text-center"
        style={{
          backgroundImage: `url('/Hero.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: isMobile ? "50vh" : "100vh",
          width: isMobile ? "100%" : "50%",
        }}
        aria-label="Hero image with General Conference Church"
      >
        <div
          className="hero-overlay-text"
          style={{
            background: "rgba(0, 0, 0, 0.65)",
            padding: isMobile ? "20px 30px" : "40px 60px",
            borderRadius: "60px",
            color: "white",
            maxWidth: "90vw",
            fontWeight: "700",
            letterSpacing: "1px",
            lineHeight: "1.2",
            fontSize: isMobile ? "1.5rem" : "2rem",
          }}
        >
          GENERAL CONFERENCE YOUTH HUB
          <div
            style={{
              marginTop: "10px",
              fontSize: isMobile ? "1rem" : "1.25rem",
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
        className="d-flex align-items-center justify-content-center bg-light form-section p-4"
        style={{
          height: isMobile ? "50vh" : "100vh",
          width: isMobile ? "100%" : "50%",
          overflowY: isMobile ? "auto" : "visible",
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
                autoComplete="username"
                disabled={isSubmitting}
                required
              />
              {errors.username && (
                <div className="text-danger">{errors.username[0]}</div>
              )}
            </div>

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
                autoComplete="current-password"
                disabled={isSubmitting}
                required
                style={{ paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
                disabled={isSubmitting}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "0.75rem",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  color: "#555",
                  userSelect: "none",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
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
              <label className="form-check-label" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>

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
