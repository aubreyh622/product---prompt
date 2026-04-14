import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Index from './pages/Index';
import Login from './components/custom/Login';
import Signup from './components/custom/Signup';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0D1B2E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-[#D4A843] rounded-sm flex items-center justify-center">
            <span className="text-[#0D1B2E] font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>C</span>
          </div>
          <div className="w-6 h-6 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes — redirect to home if already authenticated */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
      />
      {/* Protected main app — redirect to login if not authenticated */}
      <Route
        path="/"
        element={isAuthenticated ? <Index /> : <Navigate to="/login" replace />}
      />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <HashRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </HashRouter>
);

export default App;
