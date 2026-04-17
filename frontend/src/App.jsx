import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Login se nepovedl");
        return;
      }

      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setMessage("Přihlášení proběhlo úspěšně");
    } catch (error) {
      setMessage("Chyba spojení s backendem");
    }
  }

  async function loadMe() {
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Nepodařilo se načíst /me");
        return;
      }

      setUser(data);
    } catch (error) {
      setMessage("Chyba spojení s backendem");
    }
  }

  async function loadMyStudents() {
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/my-students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        setMessage("Session vypršela, přihlas se znovu");
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessage(data.detail || "Nepodařilo se načíst studenty");
        return;
      }

      setStudents(data);
    } catch (error) {
      setMessage("Chyba spojení s backendem");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setStudents([]);
    setUsername("");
    setPassword("");
    setMessage("Odhlášeno");
  }

  return (
    <div>
      <h1>Parent Student Frontend</h1>

      {!token ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Username: </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <p>Jsi přihlášený.</p>
          <button onClick={loadMe}>Načti /me</button>
          <button onClick={loadMyStudents}>Načti moje děti</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {message && <p>{message}</p>}

      {user && (
        <div>
          <h2>Uživatel</h2>
          <p>ID: {user.user_id}</p>
          <p>Username: {user.username}</p>
          <p>Role: {user.role}</p>
        </div>
      )}

      {user?.role === "admin" && (
        <div>
          <h2>Admin panel</h2>
          <p>Tady časem přidáme vytváření userů a studentů</p>
        </div>
      )}

      {user?.role === "parent" && (
        <div>
          <h2>Parent panel</h2>
          <p>Můžeš načíst svoje děti</p>
        </div>
      )}

      <div>
        <h2>Moje děti</h2>
        {students.length === 0 ? (
          <p>Zatím nic nenačteno nebo žádné děti.</p>
        ) : (
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                {student.first_name} {student.last_name} - {student.city}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}