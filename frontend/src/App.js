import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout components
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';

// Resume pages
import Resumes from './pages/resumes/Resumes';
import CreateResume from './pages/resumes/CreateResume';
import EditResume from './pages/resumes/EditResume';
import ViewResume from './pages/resumes/ViewResume';

// Job application pages
import Jobs from './pages/jobs/Jobs';
import CreateJob from './pages/jobs/CreateJob';
import EditJob from './pages/jobs/EditJob';
import ViewJob from './pages/jobs/ViewJob';
import TailorResume from './pages/jobs/TailorResume';

// Error pages
import NotFound from './pages/NotFound';

function App() {
  const { isAuthenticated, loading } = useAuth();

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        
        {/* Resume routes */}
        <Route path="resumes" element={<Resumes />} />
        <Route path="resumes/create" element={<CreateResume />} />
        <Route path="resumes/:id/edit" element={<EditResume />} />
        <Route path="resumes/:id" element={<ViewResume />} />
        
        {/* Job application routes */}
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route path="jobs/:id/edit" element={<EditJob />} />
        <Route path="jobs/:id" element={<ViewJob />} />
        <Route path="jobs/:id/tailor" element={<TailorResume />} />
      </Route>

      {/* Catch-all for 404s */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;