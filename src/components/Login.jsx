import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://church-portal-backend.onrender.com/api/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.detail || "Invalid credentials. Please try again.");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column flex-md-row p-0 login-page">
      {/* Hero Section */}
      <div
        className="w-100 w-md-50 hero-image position-relative"
        style={{
          backgroundImage: `url('/Hero.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="hero-overlay-text d-flex flex-column justify-content-center align-items-center text-center text-white fw-bold px-3"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "80%", // Dark patch covers 80% of hero section
            background: "rgba(0, 0, 0, 0.6)",
            fontSize: "1.5rem",
          }}
        >
          <h2 className="fw-bold mb-2">General Conference</h2>
          <p className="mb-0">Church Youth Hub</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-100 w-md-50 d-flex align-items-center justify-content-center bg-light p-4 form-section">
        <div
          className="p-4 shadow rounded bg-white"
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <h3 className="text-center fw-bold text-primary mb-4">Login</h3>

          {error && <div className="alert alert-danger fw-bold">{error}</div>}
          {success && (
            <div className="alert alert-success fw-bold">{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email..."
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <label className="form-label">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                placeholder="Enter your password..."
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "72%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
                role="button"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
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

            <p className="text-center fw-bold mt-3">
              Don’t have an account?{" "}
              <Link to="/register" style={{ textDecoration: "none" }}>
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Inline Styles for Responsive Behavior */}
      <style>{`
        body, html {
          height: 100%;
          margin: 0;
          overflow: hidden;
        }
        .login-page {
          height: 100vh;
          overflow: hidden;
        }
        @media (max-width: 767px) {
          .hero-image {
            height: 40vh !important;
          }
          .form-section {
            height: 60vh !important;
          }
        }
        @media (min-width: 768px) {
          .hero-image {
            height: 100vh;
            width: 50%;
          }
          .form-section {
            height: 100vh;
            width: 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
