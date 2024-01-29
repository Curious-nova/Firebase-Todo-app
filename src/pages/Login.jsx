import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../Firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    const unsubscribe = onAuthStateChanged(Auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(Auth, email, password);
      console.log("Sign In successful");
      navigate("/home");
    } catch (error) {
      const errorMessage = error.message;
      setAlertMessage("Failed to login Invalid credentials");
      setShowAlert(true);
      console.error("Failed to login", errorMessage);
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(Auth, provider);
      console.log("Sign In with Google successful");
      navigate("/home");
    } catch (error) {
      const errorMessage = error.message;
      setAlertMessage(`Failed to login with Google: ${errorMessage}`);
      setShowAlert(true);
      console.error("Failed to login with Google", errorMessage);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSignIn}
        className="border p-4 rounded shadow formReg"
        style={{
          width: "500px",
          minWidth: "300px",
          height: "500px",
          minHeight: "400px",
        }}
      >
        <h1 className="d-flex justify-content-center align-items-center mb-5 text-success">
          Login Form
        </h1>
        <div className="mb-5">
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Email"
            required
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {showAlert && (
          <div className="alert alert-danger" role="alert">
            {alertMessage}
          </div>
        )}
        <div className="d-flex justify-content-evenly align-items-center flex-column">
          <button type="submit" className="btn btn-primary mb-3">
            Sign In
          </button>
          <button
            type="button"
            className="btn btn-danger mb-2"
            onClick={googleSignIn}
          >
            Sign In with Google
          </button>
          <p style={{ color: "white" }}>
            New User ? <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
