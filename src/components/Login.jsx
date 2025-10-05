import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    // Prevent scrolling and page gaps
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
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setIsSubmitting(true);

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setGeneralError("Both fields are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        "https://church-portal-backend.onrender.com/api/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setIsSubmitting(false);
        if (data?.detail) {
          setGeneralError(data.detail);
        } else if (data?.non_field_errors) {
          setGeneralError(data.non_field_errors[0]);
        } else if (typeof data === "object") {
          setErrors(data);
        } else {
          setGeneralError("Login failed. Please try again.");
        }
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
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
          backgroundImage: `url('/Hero.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay-text">General Conference Church</div>
      </div>

      {/* Form Section */}
      <div className="w-100 w-md-50 d-flex align-items-center justify-content-center bg-light form-section p-4">
        <div
          className="p-4 shadow rounded"
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <h3 className="mb-4 text-center fw-bold text-primary">Login</h3>

          {generalError && (
            <div className="alert alert-danger fw-bold">{generalError}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email..."
                onChange={handleChange}
                name="email"
                value={formData.email}
                disabled={isSubmitting}
              />
              {errors.email && (
                <div className="text-danger fw-bold">{errors.email[0]}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password..."
                onChange={handleChange}
                name="password"
                value={formData.password}
                disabled={isSubmitting}
              />
              {errors.password && (
                <div className="text-danger fw-bold">{errors.password[0]}</div>
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
              Don’t have an account?{" "}
              <Link to="/register" style={{ textDecoration: "none" }}>
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ✅ Responsive layout fix for mobile */}
      <style>{`
        .login-page {
          height: 100vh;
          overflow: hidden;
        }

        @media (max-width: 767px) {
          .login-page {
            flex-direction: column;
          }
          .hero-image {
            height: 40vh;
          }
          .form-section {
            height: 60vh;
            overflow-y: auto;
          }
        }

        @media (min-width: 768px) {
          .hero-image,
          .form-section {
            height: 100vh;
          }
        }

        .hero-overlay-text {
          position: absolute;
          bottom: 20px;
          left: 20px;
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.7);
        }
      `}</style>
    </div>
  );
};

export default Login;
