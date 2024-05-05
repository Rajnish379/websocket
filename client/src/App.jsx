import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";
import Input from "./components/Input";

function App() {
  const [score, setScore] = useState({});
  const [scores, setAllScores] = useState([]);
  const socket = io("localhost:3000");

  function connectSocket() {
    socket.on("connection", (socket) => {
      console.log(socket);
    });
  }

  function handleInput(event) {
    let { name, value } = event.target;
    let currentObj = { [name]: value };

    setScore((prev) => ({ ...prev, ...currentObj }));
  }

  function sendScores() {
    socket.emit("scores", score); // Using this socket, the name and score object data is being sent to the backend on clicking the Publish Now Button

    socket.on("playerScores", (playerScores) => {
      console.log(playerScores);
      setAllScores(playerScores);
    });
  }

  useEffect(() => {
    connectSocket();
  }, []);
  return (
    <>
      <h1>React Multiplayer Dashboard</h1>

      <Input
        name="name"
        placeholder="Enter your Name"
        handleInput={handleInput}
      />
      <Input
        name="score"
        placeholder="Enter your Score"
        handleInput={handleInput}
      />

      <button className="send-scores" onClick={sendScores}>
        Publish Score
      </button>

      {scores.length > 0 ? (
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>

            {scores.map((score) => ( // Please don't do mistake like me. Put () instead of {}
              <tr>
                <td>{score?.name}</td>
                <td>{score?.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
