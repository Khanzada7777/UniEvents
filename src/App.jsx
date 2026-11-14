import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Events from './pages/Events.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import MyRegistrations from './pages/MyRegistrations.jsx';
import AdminEvents from './pages/AdminEvents.jsx';
import AdminEventForm from './pages/AdminEventForm.jsx';
import AdminParticipants from './pages/AdminParticipants.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute role="Student">
                <MyRegistrations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="Admin">
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/new"
            element={
              <ProtectedRoute role="Admin">
                <AdminEventForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/:id/edit"
            element={
              <ProtectedRoute role="Admin">
                <AdminEventForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/:id/participants"
            element={
              <ProtectedRoute role="Admin">
                <AdminParticipants />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
