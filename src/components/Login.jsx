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
    // Prevent scrolling on body for full-page background effect
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
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')", // praying person background
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
          Login
        </h2>

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
              backgroundColor: "rgba(0, 128, 0, 0.1)",
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
                htmlFor="username"
                style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}
              >
                Username:
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                autoComplete="username"
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

            {/* Password */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
              <label
                htmlFor="password"
                style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                autoComplete="current-password"
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
                  top: "100%",
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

            {/* Remember Me */}
            <div
              style={{
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <label
                htmlFor="rememberMe"
                style={{
                  cursor: "pointer",
                  fontWeight: "600",
                  color: "black",
                  userSelect: "none",
                }}
              >
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#1a237e",
                color: "white",
                fontWeight: "700",
                fontSize: "1.1rem",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(26,35,126,0.6)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = "#283593";
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = "#1a237e";
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
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontWeight: "600",
                color: "#1a237e",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "#283593" }}
              >
                Register here
              </Link>
            </p>
          </form>
        )}

        {success && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => navigate("/home")}
              style={{
                padding: "12px 30px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#1a237e",
                color: "white",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(26,35,126,0.6)",
              }}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
