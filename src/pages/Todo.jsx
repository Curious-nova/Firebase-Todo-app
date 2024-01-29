import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const style = {
  text: { cursor: "pointer" },
  textComplete: { cursor: "pointer", textDecoration: "line-through" },
};

const Todo = ({ todo, toggleComplete, deleteTodo }) => {
  return (
    <div>
      <div className="container">
        <div
          className="row d-flex justify-content-between align-items-center pt-2 "
          style={{ maxWidth: "700px" }}
        >
          <div
            className="col-md-12 d-flex align-items-center justify-content-between p-2"
            style={{ backgroundColor: "#c9b1ff" }}
          >
            <input
              type="checkbox"
              checked={todo.completed ? "checked" : ""}
              onChange={() => toggleComplete(todo)}
            />
            <p
              className="m-0"
              style={todo.completed ? style.textComplete : style.text}
              onClick={() => toggleComplete(todo)}
            >
              {todo.text}
            </p>
            <button className="btn btn-danger">
              <FaRegTrashAlt
                style={style.text}
                onClick={() => deleteTodo(todo.id)}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;
