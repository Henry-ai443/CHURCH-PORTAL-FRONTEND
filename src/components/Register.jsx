import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getNames } from "country-list";

const Register = () => {
  const [countries] = useState(getNames());

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const country = formData.country.trim();

    if (!name || !email || !password || !confirmPassword || !country) {
      setGeneralError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ["Passwords do not match."] });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        "https://church-portal-backend.onrender.com/api/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: name,
            email: email,
            password: password,
            country: country,
          }),
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
          setGeneralError("Registration failed. Please try again.");
        }
        return;
      }

      localStorage.setItem("token", data.token);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);
      setGeneralError("Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // UseEffect to lock scrolling via CSS classes on body and html, 
  // but here we'll rely on global CSS below.

  return (
    <>
      {/* Global Styles to fix height, disable scrolling, and remove spacing */}
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .register-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .register-page {
            flex-direction: row;
          }
        }

        .hero-image, .form-section {
          flex: 1 1 auto;
          height: 100%;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        form {
          margin-bottom: 0;
          width: 100%;
        }

        .form-section form {
          overflow-y: auto;
          max-height: 100%;
        }
      `}</style>

      <div className="container-fluid register-page p-0">
        {/* Hero Image Section */}
        <div
          className="hero-image position-relative"
          style={{
            backgroundImage: `url('/Hero.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="hero-overlay-text text-center text-white fw-bold">
            GENERAL CONFERENCE YOUTH HUB
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section bg-light p-4">
          <div
            className="p-4 shadow rounded"
            style={{
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <h3 className="mb-4 text-center fw-bold text-primary">
              Create an Account
            </h3>

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
                  onClick={() => navigate("/")}
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
                    placeholder="Enter your name..."
                    onChange={handleChange}
                    name="name"
                    value={formData.name}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.username && (
                    <div className="text-danger">{errors.username[0]}</div>
                  )}
                </div>

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
                    required
                  />
                  {errors.email && (
                    <div className="text-danger fw-bold">{errors.email[0]}</div>
                  )}
                </div>

                {/* Country Dropdown */}
                <div className="mb-3">
                  <label className="form-label">Country:</label>
                  <select
                    name="country"
                    className="form-select"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="" disabled>
                      Select your country
                    </option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <div className="text-danger fw-bold">{errors.country[0]}</div>
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
                    required
                  />
                  {errors.password && (
                    <div className="text-danger fw-bold">{errors.password[0]}</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label">Confirm Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm password..."
                    onChange={handleChange}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.confirmPassword && (
                    <div className="text-danger fw-bold">
                      {errors.confirmPassword[0]}
                    </div>
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
                    {isSubmitting ? "Registering..." : "Register"}
                  </button>
                </div>

                <p className="text-center fw-bold mt-3">
                  Already have an account?{" "}
                  <Link to="/" style={{ textDecoration: "none" }}>
                    Login
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
