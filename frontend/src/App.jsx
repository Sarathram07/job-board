import { ApolloProvider } from "@apollo/client/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import { getUser } from "./lib/auth";
import { apolloClient } from "./lib/graphql/client.js";
import NavBar from "./components/NavBar";
import CompanyPage from "./pages/CompanyPage";
import CreateJobPage from "./pages/CreateJobPage";
import HomePage from "./pages/HomePage";
import JobPage from "./pages/JobPage";
import LoginPage from "./pages/LoginPage";
import Chat from "./components/Chat.jsx";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser);

  const handleLogin = (user) => {
    setUser(user);
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <ApolloProvider client={apolloClient}>
      <NavBar user={user} onLogout={handleLogout} />
      <main className="section">
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/companies/:companyId" element={<CompanyPage />} />
          <Route path="/jobs/new" element={<CreateJobPage />} />
          <Route path="/jobs/:jobId" element={<JobPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/chat" element={<Chat user={user} />} />
        </Routes>
      </main>
    </ApolloProvider>
  );
}

export default App;
