import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Login = () => {
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    AuthService.login(username, password).then(
      (data) => {
        if (data.roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="text-center mb-4">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="rounded-circle shadow-sm"
            style={{ width: "90px", height: "90px" }}
          />
          <h3 className="mt-3 fw-bold text-primary">Login</h3>
          <p className="text-muted">Access your account to continue</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="username" className="fw-semibold">Username</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="d-grid">
            <button className="btn btn-primary btn-lg" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm me-2"></span>
              )}
              Login
            </button>
          </div>

          {message && (
            <div className="mt-3">
              <div className="alert alert-danger text-center" role="alert">
                {message}
              </div>
            </div>
          )}
        </form>

        <div className="text-center mt-4">
          <p className="mb-0 text-muted">
            Don’t have an account?{" "}
            <a href="/register" className="text-decoration-none fw-semibold text-primary">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
