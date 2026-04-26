import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar          from "./components/Navbar";
import Home            from "./pages/Home";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Recommendations from "./pages/Recommendations";
import Search          from "./pages/Search";
import Saved           from "./pages/Saved";
import Performance     from "./pages/Performance";
import Quiz            from "./pages/Quiz";
import QuizResults     from "./pages/QuizResults";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/search"       element={<Search />} />
        <Route path="/performance"  element={<Performance />} />
        <Route path="/quiz"         element={
          <PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/quiz-results" element={
          <PrivateRoute><QuizResults /></PrivateRoute>} />
        <Route path="/recommend"    element={
          <PrivateRoute><Recommendations /></PrivateRoute>} />
        <Route path="/saved"        element={
          <PrivateRoute><Saved /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}