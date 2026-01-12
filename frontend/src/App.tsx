import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import LandingPage from "./Landing";
import Register from "./Register";
import Feed from "./Feed";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />
        {/* ... other routes ... */}
      </Routes>
    </Router>
  );
}
