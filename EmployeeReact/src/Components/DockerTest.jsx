import { useState, useEffect } from "react";
import axios from "axios";

function DockerTest() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios
      .get("http://localhost:2025/api/employees/docker") // make sure port matches your backend
      .then((res) => {
        // If backend returns JSON object
        //adbfa
        if (typeof res.data === "object") {
          setMessage(JSON.stringify(res.data));
        } else {
          setMessage(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error fetching backend!");
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontSize: "18px", color: "green" }}>
      {message}
    </div>
  );
}

export default DockerTest;