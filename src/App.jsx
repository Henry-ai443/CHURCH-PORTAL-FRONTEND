import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

//Admin Components
import UsersManagement from "./components/Admin/UsersMangement";
import AnnouncementsManagement from "./components/Admin/AnnouncementsManagement";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import AnnouncementPage from "./pages/AnnouncementPage";
import EventsPage from "./pages/EventsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import EventDetailPage from "./pages/EventDetailPage";
import Profile from "./pages/ProfilePage";
import YouthPage from "./pages/YouthPage";
import YouthMessagesList from "./components/YouthMessageList";
import ChatsPage from "./pages/ChatsPage";
import AdminDashboard from "./components/AdminDashboard";

// ✅ Get user from localStorage
const getUserFromLocalStorage = () => {
  const token = localStorage.getItem("token");
  const is_staff = localStorage.getItem("is_staff") === "true";
  const username = localStorage.getItem("username");

  if (!token) return null;

  return {
    token,
    is_staff,
    username,
  };
};

// ✅ Protected Routes
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const StaffRoute = ({ user, children }) => {
  if (!user || !user.is_staff) return <Navigate to="/home" replace />;
  return children;
};

// ✅ Layout with navbar/footer visibility logic
function Layout({ user }) {
  const location = useLocation();
  const noNavFooterPaths = ["/", "/register"];
  const hideNavFooter = noNavFooterPaths.includes(location.pathname);

  return (
    <>
      {!hideNavFooter && <Navbar user={user} />}
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/home" replace /> : <RegisterPage />}
        />

        {/* Protected */}
        <Route
          path="/home"
          element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute user={user}>
              <AnnouncementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute user={user}>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute user={user}>
              <EventDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/youth"
          element={
            <ProtectedRoute user={user}>
              <YouthPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute user={user}>
              <ChatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/youth/messages"
          element={
            <ProtectedRoute user={user}>
              <YouthMessagesList />
            </ProtectedRoute>
          }
        />

                <Route
          path="users_management"
          element={
            <ProtectedRoute user={user}>
              <UsersManagement />
            </ProtectedRoute>
          }
        />

                <Route
          path="announcements_management"
          element={
            <ProtectedRoute user={user}>
              <AnnouncementsManagement />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <StaffRoute user={user}>
              <AdminDashboard />
            </StaffRoute>
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/"} replace />}
        />
      </Routes>
      {!hideNavFooter && <Footer />}
    </>
  );
}

// ✅ App entry point
function App() {
  const user = getUserFromLocalStorage();

  useEffect(() => {
    Aos.init({
      duration: 2000,
      once: true,
    });
  }, []);

  return (
    <Router>
      <Layout user={user} />
    </Router>
  );
}

export default App;
