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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Same body style to prevent scroll and margin/padding
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    const { name, email, password, confirmPassword, country } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword || !country.trim()) {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          padding: "40px",
          maxWidth: "400px",
          width: "100%",
          color: "#000",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "700",
            color: "white",
            textShadow: "0 0 5px rgba(145, 146, 148, 0.99)",
          }}
        >
          Register To:
        </h2>

        <h3
          style={{
            textAlign: "center",
            marginBottom: "15px",
            fontWeight: "bold",
            color: "blue",
            textShadow: "0 0 5px rgba(81, 145, 134, 0.99)",
          }}
        >
          General Conference
        </h3>

        <h4
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "bold",
            color: "rgb(38, 220, 226)",
            textShadow: "0 0 5px rgba(147, 148, 150, 0.99)",
          }}
        >
          Youth Hub
        </h4>

        {generalError && (
          <div
            style={{
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              color: "darkred",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {generalError}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: "rgb(19, 255, 19)",
              color: "green",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="name"
                style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}
              >
                Username:
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                autoComplete="username"
                placeholder="Enter your name..."
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "none",
                  outline: "none",
                  background: "rgba(255, 255, 255, 0.4)",
                  boxShadow: "inset 0 0 10px rgba(255,255,255,0.6)",
                  fontSize: "1rem",
                  color: "#000",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              />
              {errors.username && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errors.username[0]}
                </div>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="email"
                style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                autoComplete="email"
                placeholder="Enter your email..."
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "none",
                  outline: "none",
                  background: "rgba(255, 255, 255, 0.4)",
                  boxShadow: "inset 0 0 10px rgba(255,255,255,0.6)",
                  fontSize: "1rem",
                  color: "#000",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              />
              {errors.email && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errors.email[0]}
                </div>
              )}
            </div>

            {/* Country Dropdown */}
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="country"
                style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}
              >
                Country:
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "none",
                  outline: "none",
                  background: "rgba(255, 255, 255, 0.4)",
                  boxShadow: "inset 0 0 10px rgba(255,255,255,0.6)",
                  fontSize: "1rem",
                  color: formData.country ? "#000" : "#666",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
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
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errors.country[0]}
                </div>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
              <label
                htmlFor="password"
                style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}
              >
                Password:
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                autoComplete="new-password"
                placeholder="Enter your password..."
                style={{
                  width: "100%",
                  padding: "12px 45px 12px 15px",
                  borderRadius: "12px",
                  border: "none",
                  outline: "none",
                  background: "rgba(255, 255, 255, 0.4)",
                  boxShadow: "inset 0 0 10px rgba(255,255,255,0.6)",
                  fontSize: "1rem",
                  color: "#000",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
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
                  top: "70%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.2rem",
                  color: "#1a237e",
                  userSelect: "none",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
              {errors.password && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errors.password[0]}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "30px", position: "relative" }}>
              <label
                htmlFor="confirmPassword"
                style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}
              >
                Confirm Password:
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                placeholder="Confirm password..."
                style={{
                  width: "100%",
                  padding: "12px 45px 12px 15px",
                  borderRadius: "12px",
                  border: "none",
                  outline: "none",
                  background: "rgba(255, 255, 255, 0.4)",
                  boxShadow: "inset 0 0 10px rgba(255,255,255,0.6)",
                  fontSize: "1rem",
                  color: "#000",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                disabled={isSubmitting}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "70%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.2rem",
                  color: "#1a237e",
                  userSelect: "none",
                }}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
              {errors.confirmPassword && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errors.confirmPassword[0]}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: "15px",
                backgroundColor: "#1a237e",
                border: "none",
                color: "white",
                fontWeight: "600",
                fontSize: "1.1rem",
                cursor: isSubmitting ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "background-color 0.3s ease",
                boxShadow: "0 4px 8px rgb(25 25 112 / 0.5)",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.currentTarget.style.backgroundColor = "#141a55";
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.currentTarget.style.backgroundColor = "#1a237e";
              }}
            >
              {isSubmitting && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: "8px" }}
                ></span>
              )}
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        {success && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 20px",
                borderRadius: "15px",
                border: "none",
                backgroundColor: "green",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgb(0 128 0 / 0.6)",
              }}
            >
              Go to Dashboard
            </button>
          </div>
        )}

        <p
          style={{
            marginTop: "25px",
            textAlign: "center",
            fontWeight: "600",
            color: "white",
            textShadow: "0 0 4px rgba(0,0,0,0.7)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              color: "#e6e6e6",
              textDecoration: "underline",
              fontWeight: "700",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
