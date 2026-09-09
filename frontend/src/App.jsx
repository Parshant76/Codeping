import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Reminders from './pages/Reminders';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="reminders"
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
