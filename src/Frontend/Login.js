import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import users from './config.json';
import "./Front.css";

const Login = () => {
  const navigate = useNavigate();
  const { setAccessRights } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [updatedPasswords, setUpdatedPasswords] = useState({});
  const lockTimer = useRef(null);



  const currentUser = users.find((user) => user.username === username);

  const handleLogin = () => {
    if (isLocked) {
      alert("You have been temporarily locked out. Please try again later.");
      return;
    }

    const userPassword =
      updatedPasswords[username] || (currentUser && currentUser.password);
    const isValidUser = userPassword === password;

    if (isValidUser) {
      alert("Login successful!");
      const userRights = getUserAccessRights(currentUser);
      setAccessRights(userRights);
      navigateToTables(userRights);
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      setFailedAttempts((prevAttempts) => prevAttempts + 1);

      if (failedAttempts === 2) {
        setIsLocked(true);
      } else {
        alert("Login failed. Please check your credentials.");
      }

      setUsername("");
      setPassword("");
    }
  };

  const getUserAccessRights = (user) => {
    switch (user.username) {
      case "Nils_Furst":
        return ["patienten", "ärzte", "abteilungen", "behandlungen"];
      case "Julius_Schmidt":
        return ["patienten", "ärzte", "zimmer", "abteilungen", "behandlungen"];
      case "Dario_Lutz":
        return ["patienten", "ärzte", "zimmer", "behandlungen"];
      default:
        return [];
    }
  };

  const navigateToTables = (tables) => {
    if (tables && tables.length > 0) {
      navigate(`/${tables[0]}`);
    }
  };

  const handlePasswordChange = () => {
    setChangingPassword(true);
  };

  const handlePasswordConfirmation = () => {
    const userWithNewPassword = users.find(
      (user) => user.username === username
    );
    if (userWithNewPassword) {
      setUpdatedPasswords((prev) => ({ ...prev, [username]: newPassword }));
      alert(`Password for user ${username} updated to ${newPassword}`);
      setChangingPassword(false);
      setNewPassword("");
    } else {
      alert("User not found. Password not updated.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (changingPassword) {
      handlePasswordConfirmation();
    } else {
      handleLogin();
    }
  };

  useEffect(() => {
    if (isLocked && timeLeft > 0) {
      lockTimer.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isLocked && timeLeft === 0) {
      clearInterval(lockTimer.current);
      alert("The time lock has expired. You can now log in again.");
      setIsLocked(false);
      setTimeLeft(60);
    } else {
      clearInterval(lockTimer.current);
    }

    return () => clearInterval(lockTimer.current);
  }, [isLocked, timeLeft]);

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Benutzername:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Passwort:
          <input
            type="password"
            value={changingPassword ? newPassword : password}
            onChange={(e) =>
              changingPassword
                ? setNewPassword(e.target.value)
                : setPassword(e.target.value)
            }
          />
        </label>
        {!changingPassword && (
          <p>
            <span
              onClick={handlePasswordChange}
              className="change-password-link"
            >
              Passwort ändern? (Zählt für ein Login!)
            </span>
          </p>
        )}
        <button type="submit" disabled={isLocked} className="anmelde_button">
          {changingPassword ? "Bestätigen" : "Anmelden"}
        </button>
        {isLocked && <p>Zeitsperre: {timeLeft} Sekunden</p>}
      </form>
    </div>
  );
};

export default Login;
