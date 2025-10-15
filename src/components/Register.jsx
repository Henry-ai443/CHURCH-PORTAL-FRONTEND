import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getNames } from "country-list";

const Register = () => {
  const [countries] = useState(getNames());

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

  // Validation: name must have at least one special char and one digit
  const validateName = (name) => {
    const specialCharRegex = /[^A-Za-z0-9]/;
    const digitRegex = /\d/;
    return specialCharRegex.test(name) && digitRegex.test(name);
  };

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

    if (!validateName(name)) {
      setErrors({
        name: [
          "Name must include at least one special character and one digit.",
        ],
      });
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
          maxWidth: "650px",
          width: "100%",
          color: "#000",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontWeight: "700",
            color: "white",
            textShadow: "0 0 5px rgba(145, 146, 148, 0.99)",
          }}
        >
          Register To Join:
        </h2>

        <h3
          style={{
            textAlign: "center",
            marginBottom: "10px",
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
            marginBottom: "10px",
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              {/* Name */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  htmlFor="name"
                  style={{ marginBottom: "6px", fontWeight: "600" }}
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
                  placeholder="Your name"
                  autoComplete="username"
                  style={{
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
                {errors.name && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errors.name[0]}
                  </div>
                )}
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  htmlFor="email"
                  style={{ marginBottom: "6px", fontWeight: "600" }}
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
                  placeholder="Your email"
                  autoComplete="email"
                  style={{
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

              {/* Country */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  htmlFor="country"
                  style={{ marginBottom: "6px", fontWeight: "600" }}
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
                    padding: "12px 15px",
                    borderRadius: "12px",
                    border: "none",
                    outline: "none",
                    background: "rgba(255, 255, 255, 0.4)",
                    boxShadow: "inset 0 0 10px rgba(255,255,255,0.6)",
                    fontSize: "1rem",
                    color: formData.country ? "#000" : "#999",
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  htmlFor="password"
                  style={{ marginBottom: "6px", fontWeight: "600" }}
                >
                  Password:
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  placeholder="Enter password"
                  autoComplete="new-password"
                  style={{
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
                {errors.password && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errors.password[0]}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  htmlFor="confirmPassword"
                  style={{ marginBottom: "6px", fontWeight: "600" }}
                >
                  Confirm Password:
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  style={{
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
                {errors.confirmPassword && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errors.confirmPassword[0]}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: isSubmitting ? "#999" : "#1762e8",
                color: "white",
                fontWeight: "700",
                fontSize: "1.1rem",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(23, 98, 232, 0.5)",
                transition: "background-color 0.3s ease",
              }}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "white",
            fontWeight: "600",
            textShadow: "0 0 5px rgba(27, 28, 30, 0.99)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#1762e8", textDecoration: "underline" }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
