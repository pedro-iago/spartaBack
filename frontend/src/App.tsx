import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SpartaProvider } from './shared/context/SpartaContext';

// Auth & Selection
import { Login } from './ui/modules/auth/Login';

// Aluno (Student)
import { StudentDashboard } from './ui/modules/student/StudentDashboard';
import { StudentWorkouts } from './ui/modules/student/StudentWorkouts';
import WorkoutOverview from './ui/modules/student/WorkoutOverview';
import ActiveWorkout from './ui/modules/student/ActiveWorkout';
import DailyDiet from './ui/modules/student/DailyDiet';
import MealScan from './ui/modules/student/MealScan';
import DietPhotoGallery from './ui/modules/student/DietPhotoGallery';
import { StudentProfile } from './ui/modules/student/StudentProfile';
import { TrainingHistory } from './ui/modules/student/TrainingHistory';

// Profissional (Trainer) - Ajustado para o nome do arquivo na sua tree
import { TrainerDashboard as ProfessionalDashboard } from './ui/modules/professional/ProfessionalDashboard';
import { ProfessionalStudents } from './ui/modules/professional/ProfessionalStudents';

// Admin
import { AdminDashboard } from './ui/modules/admin/AdminDashboard';
import { AdminReports } from './ui/modules/admin/AdminReports';
import { AdminUsers } from './ui/modules/admin/AdminUsers';
import { AdminSettings } from './ui/modules/admin/AdminSettings';

// Common (multi-role)
import { AIAssistant } from './ui/modules/common/AIAssistant';

const PrivateRoute = ({ children, allowedRole }: { children: JSX.Element, allowedRole: string }) => {
  const userStr = localStorage.getItem('@sparta:user');
  if (!userStr) return <Navigate to="/login" replace />;
  
  const user = JSON.parse(userStr);
  return user.role === allowedRole ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <SpartaProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Domínio Aluno */}
          <Route path="/dashboard/student" element={
            <PrivateRoute allowedRole="STUDENT">
              <StudentDashboard />
            </PrivateRoute>
          } />
          <Route path="/student/workouts" element={
            <PrivateRoute allowedRole="STUDENT">
              <StudentWorkouts />
            </PrivateRoute>
          } />
          <Route path="/student/workout" element={
            <PrivateRoute allowedRole="STUDENT">
              <WorkoutOverview />
            </PrivateRoute>
          } />
          <Route path="/workout-overview" element={
            <PrivateRoute allowedRole="STUDENT">
              <WorkoutOverview />
            </PrivateRoute>
          } />
          <Route path="/active-workout" element={
            <PrivateRoute allowedRole="STUDENT">
              <ActiveWorkout />
            </PrivateRoute>
          } />
          <Route path="/diet" element={
            <PrivateRoute allowedRole="STUDENT">
              <DailyDiet />
            </PrivateRoute>
          } />
          <Route path="/meal-scan" element={
            <PrivateRoute allowedRole="STUDENT">
              <MealScan />
            </PrivateRoute>
          } />
          <Route path="/diet/photos" element={
            <PrivateRoute allowedRole="STUDENT">
              <DietPhotoGallery />
            </PrivateRoute>
          } />
          <Route path="/dashboard/perfil" element={
            <PrivateRoute allowedRole="STUDENT">
              <StudentProfile />
            </PrivateRoute>
          } />
          <Route path="/dashboard/perfil/historico" element={
            <PrivateRoute allowedRole="STUDENT">
              <TrainingHistory />
            </PrivateRoute>
          } />
          <Route path="/student/profile" element={
            <PrivateRoute allowedRole="STUDENT">
              <StudentProfile />
            </PrivateRoute>
          } />

          {/* Domínio Profissional */}
          <Route path="/dashboard/professional" element={
            <PrivateRoute allowedRole="PROFESSIONAL">
              <ProfessionalDashboard />
            </PrivateRoute>
          } />
          <Route path="/dashboard/professional/students" element={
            <PrivateRoute allowedRole="PROFESSIONAL">
              <ProfessionalStudents />
            </PrivateRoute>
          } />
          <Route path="/assistant" element={
            <PrivateRoute allowedRole="PROFESSIONAL">
              <AIAssistant />
            </PrivateRoute>
          } />

          {/* Domínio Admin */}
          <Route path="/dashboard/admin" element={
            <PrivateRoute allowedRole="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/reports" element={
            <PrivateRoute allowedRole="ADMIN">
              <AdminReports />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute allowedRole="ADMIN">
              <AdminUsers />
            </PrivateRoute>
          } />
          <Route path="/admin/settings" element={
            <PrivateRoute allowedRole="ADMIN">
              <AdminSettings />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </SpartaProvider>
  );
};

export default App;