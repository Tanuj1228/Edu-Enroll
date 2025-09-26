import React, { useState } from "react";
import AuthService from "../services/auth.service";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    AuthService.register(username, email, password).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="text-center mb-4">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="rounded-circle shadow-sm"
            style={{ width: "90px", height: "90px" }}
          />
          <h3 className="mt-3 fw-bold text-primary">Create Account</h3>
          <p className="text-muted">Join our learning platform today</p>
        </div>

        <form onSubmit={handleRegister}>
          {!successful && (
            <div>
              <div className="form-group mb-3">
                <label htmlFor="username" className="fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a username"
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="email" className="fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
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
                  placeholder="Enter a strong password"
                />
              </div>

              <div className="d-grid">
                <button className="btn btn-success btn-lg">Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-4">
              <div
                className={
                  successful
                    ? "alert alert-success text-center shadow-sm"
                    : "alert alert-danger text-center shadow-sm"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
        </form>

        <div className="text-center mt-4">
          <p className="mb-0 text-muted">
            Already have an account?{" "}
            <a href="/login" className="text-decoration-none fw-semibold text-primary">
              Login here
            </a>
          </p>
        </div>
      </div>

      {/* Extra CSS for hover/animation */}
      <style>{`
        .card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.15);
        }
        input:focus {
          border-color: #198754 !important;
          box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25) !important;
        }
      `}</style>
    </div>
  );
};

export default Register;
