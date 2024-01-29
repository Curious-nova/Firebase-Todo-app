import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import Todo from "./Todo";
import { Auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
const Home = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const navigate = useNavigate();
  //create todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (text === "") {
      alert("Please Enter Task ");
      return;
    }
    await addDoc(collection(db, "todos"), {
      text: text,
      completed: false,
    });
    setText("");
  };

  //read todo
  useEffect(() => {
    const queryy = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(queryy, (querySnapshot) => {
      let todoArr = [];
      querySnapshot.forEach((doc) => {
        todoArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todoArr);
    });

    return () => unsubscribe();
  }, []);

  //update todo
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };

  //delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };
  const handleSignOut = async () => {
    try {
      await signOut(Auth); // Using the 'auth' object from Firebase
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };
  return (
    <div
      className="container shadow d-flex flex-column rounded main-home "
      style={{
        maxWidth: "700px",
        marginTop: "100px",
        backgroundColor: "aliceblue",
        padding: "20px",
      }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <h1
          className="text-success"
          style={{ marginLeft: "10px", marginRight: "auto" }}
        >
          Easy-Todo
        </h1>
        <button
          className="btn btn-danger"
          style={{ marginLeft: "auto", marginRight: "10px" }}
          onClick={handleSignOut}
        >
          Logout
        </button>
      </div>
      <div
        className="container"
        style={{ maxWidth: "700px", marginTop: "50px" }}
      >
        <form
          onSubmit={createTodo}
          className="d-flex align-items-center justify-content-center"
        >
          <input
            className="form-control mr-sm-2 mb-2 mb-md-0"
            type="search"
            placeholder="Add Task"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-outline-success m-2">
            <FaPlus />
          </button>
        </form>
        <ul style={{ maxWidth: "700px", marginRight: "60px" }}>
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
        <div className="container d-flex justify-content-center align-items-center">
          {todos.length < 1 ? null : (
            <p>
              You have <span className="text-danger">{todos.length} </span>Task
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
