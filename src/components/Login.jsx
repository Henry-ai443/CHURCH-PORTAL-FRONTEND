import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.margin = "initial";
      document.body.style.padding = "initial";
      document.documentElement.style.margin = "initial";
      document.documentElement.style.padding = "initial";
    };
  }, []);

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
        if (data.username || data.password) {
          setErrors(data);
        } else {
          setGeneralError(data.detail || "Login failed. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setGeneralError("Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column flex-md-row p-0 login-page">
      {/* Hero Image Section */}
      <div
        className="w-100 w-md-50 hero-image position-relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1677849358049-0b0e9d8b6b0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG1hbiUyMHByYXlpbmd8ZW58MHx8fHwxNjc4NzQ4NjY5&ixlib=rb-1.2.1&q=80&w=1080')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.75)",
        }}
      >
        <div
          className="hero-overlay-text"
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.5rem",
            textShadow: "0 0 8px rgba(0,0,0,0.7)",
          }}
        >
          GENERAL CONFERENCE YOUTH HUB
        </div>
      </div>

      {/* Form Section */}
      <div
        className="w-100 w-md-50 d-flex flex-column align-items-center justify-content-center p-4"
        style={{
          background: "rgba(255, 255, 255, 0.1)", // subtle transparent layer behind glass
          backdropFilter: "blur(12px)", // Glass blur effect
          WebkitBackdropFilter: "blur(12px)", // Safari support
        }}
      >
        {/* Hub Title Above Form */}
        <h2
          className="mb-4 fw-bold text-primary"
          style={{ textAlign: "center", userSelect: "none" }}
        >
          General Conference Youth Hub
        </h2>

        <div
          className="p-4 shadow rounded"
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "rgba(255, 255, 255, 0.2)", // glass background
            boxShadow:
              "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // soft shadow
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            color: "#000",
          }}
        >
          <h3 className="mb-4 text-center fw-bold text-primary">Login</h3>

          {generalError && (
            <div className="alert alert-danger fw-bold">{generalError}</div>
          )}
          {success && (
            <div className="alert alert-success fw-bold">{success}</div>
          )}

          {success && (
            <div className="text-center mb-3">
              <button
                className="btn btn-success"
                onClick={() => navigate("/home")}
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username..."
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  autoComplete="username"
                  style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    border: "none",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    color: "#000",
                  }}
                />
                {errors.username && (
                  <div className="text-danger">{errors.username[0]}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <label className="form-label">Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password..."
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  autoComplete="current-password"
                  style={{
                    paddingRight: "3.5rem",
                    background: "rgba(255, 255, 255, 0.3)",
                    border: "none",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    color: "#000",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isSubmitting}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "1.3rem",
                    border: "none",
                    background: "transparent",
                    color: "#000",
                    padding: 0,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                {errors.password && (
                  <div className="text-danger">{errors.password[0]}</div>
                )}
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
                  style={{
                    cursor: "pointer",
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="rememberMe"
                  style={{ cursor: "pointer" }}
                >
                  Remember Me
                </label>
              </div>

              {/* Submit Button */}
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

              <p className="text-center fw-bold mt-3" style={{ color: "#000" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ textDecoration: "none" }}>
                  Register here
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
