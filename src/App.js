import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { AllContentPage } from './pages/principal/AllContentPage';
import { PendingApprovalPage } from './pages/principal/PendingApprovalPage';
import { PrincipalDashboardPage } from './pages/principal/PrincipalDashboardPage';
import { LivePage } from './pages/public/LivePage';
import { MyContentPage } from './pages/teacher/MyContentPage';
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';
import { UploadContentPage } from './pages/teacher/UploadContentPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/live/:teacherId" element={<LivePage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboardPage />} />
            <Route path="upload" element={<UploadContentPage />} />
            <Route path="content" element={<MyContentPage />} />
          </Route>

          <Route
            path="/principal"
            element={
              <ProtectedRoute allowedRoles={['principal']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/principal/dashboard" replace />} />
            <Route path="dashboard" element={<PrincipalDashboardPage />} />
            <Route path="approvals" element={<PendingApprovalPage />} />
            <Route path="content" element={<AllContentPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

export default App;
