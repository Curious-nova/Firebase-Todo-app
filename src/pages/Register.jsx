import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (user) => {
      if (user) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(Auth, email, password);
      console.log("Registered successfully");
      navigate("/login");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/email-already-in-use") {
        setAlertMessage(
          "Email address is already in use. Please use a different email."
        );
      } else {
        setAlertMessage(`Failed to register: ${errorMessage}`);
      }

      setShowAlert(true);
      console.error("Failed to register", errorMessage);
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(Auth, provider);
      console.log("Sign In with Google successful");
      navigate("/home");
    } catch (error) {
      setAlertMessage(`Failed to register with Google: ${error.message}`);
      setShowAlert(true);
      console.error("Failed to register with Google", error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 ">
      <form
        onSubmit={handleRegister}
        className="border p-4 rounded shadow formReg"
        style={{
          width: "500px",
          minWidth: "300px",
          height: "500px",
          minHeight: "400px",
        }}
      >
        <h1 className="d-flex justify-content-center align-items-center mb-5 text-success ">
          Register Form
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
            Register
          </button>
          <button
            type="button"
            className="btn btn-danger mb-2"
            onClick={googleSignIn}
          >
            Register with Google
          </button>
          <p style={{ color: "white" }}>
            already Registered ? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
