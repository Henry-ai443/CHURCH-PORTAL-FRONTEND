import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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

// Your auth hooks and ProtectedRoute, StaffRoute same as before

const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://church-portal-backend.onrender.com/api/current-user/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const StaffRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />;
  if (!user.is_staff) return <Navigate to="/home" replace />;
  return children;
};

function Layout({ user }) {
  // We can get current location to conditionally show Navbar/Footer
  const location = useLocation();

  // Paths without Navbar/Footer:
  const noNavFooterPaths = ['/', '/register'];

  const hideNavFooter = noNavFooterPaths.includes(location.pathname);

  return (
    <>
      {!hideNavFooter && <Navbar user={user} />}
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/home" replace /> : <RegisterPage />}
        />

        {/* Protected routes */}
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
          path="/admin"
          element={
            <StaffRoute user={user}>
              <AdminDashboard />
            </StaffRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
      </Routes>
      {!hideNavFooter && <Footer />}
    </>
  );
}

function App() {
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    Aos.init({
      duration: 2000,
      once: true,
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Layout user={user} />
    </Router>
  );
}

export default App;
