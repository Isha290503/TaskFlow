import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx"; // Import the new component
import NotFound from "./pages/NotFound.jsx";
// App.jsx - Add route
import MyWork from "./pages/MyWork";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} /> {/* Add this route */}
        <Route path="*" element={<NotFound />} />
      <Route path="/my-work" element={<MyWork />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;