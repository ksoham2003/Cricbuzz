import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SeriesPage from './pages/SeriesPage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import MatchesPage from './pages/MatchesPage';
import SearchPage from './pages/SearchPage';
import MatchDetailPage from './pages/MatchDetailPage';
import CommentaryPage from './pages/CommentaryPage';
import PointsTablePage from './pages/PointsTablePage';
import SquadsPage from './pages/SquadsPage';
import ScoringPage from './pages/ScoringPage';
import AdminManagePage from './pages/AdminManagePage';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

import './styles/globals.css';
import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/matches/:id" element={<MatchDetailPage />} />
          <Route path="/matches/:id/commentary" element={<CommentaryPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/series/:id/points-table" element={<PointsTablePage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/squads" element={<SquadsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/scoring"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'SCORER']}>
                <ScoringPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminManagePage />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

function UnauthorizedPage() {
  return (
    <div className="page-shell narrow">
      <h1>403 - Unauthorized</h1>
      <p>You don't have permission to access this resource.</p>
      <a href="/" className="btn primary">Go home</a>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="page-shell narrow">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn primary">Back to live scores</a>
    </div>
  );
}

export default App;
