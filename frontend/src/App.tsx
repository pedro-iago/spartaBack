import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { SpartaProvider } from "./shared/context/SpartaContext";

// Auth & Selection
import { Login } from "./ui/modules/auth/Login";

// Aluno (Student)
import { StudentDashboard } from "./ui/modules/student/StudentDashboard";
import { StudentWorkouts } from "./ui/modules/student/StudentWorkouts";
import WorkoutOverview from "./ui/modules/student/WorkoutOverview";
import ActiveWorkout from "./ui/modules/student/ActiveWorkout";
import DailyDiet from "./ui/modules/student/DailyDiet";
import MealScan from "./ui/modules/student/MealScan";
import DietPhotoGallery from "./ui/modules/student/DietPhotoGallery";
import { StudentProfile } from "./ui/modules/student/StudentProfile";
import { TrainingHistory } from "./ui/modules/student/TrainingHistory";

// Profissional (Trainer) - Ajustado para o nome do arquivo na sua tree
import { TrainerDashboard as ProfessionalDashboard } from "./ui/modules/professional/ProfessionalDashboard";
import { ProfessionalSolicitacoes } from "./ui/modules/professional/ProfessionalSolicitacoes";
import { ProfessionalStudents } from "./ui/modules/professional/ProfessionalStudents";
import InstructorReview from "./ui/modules/professional/InstructorReview";

// Admin
import { AdminDashboard } from "./ui/modules/admin/AdminDashboard";
import { AdminReports } from "./ui/modules/admin/AdminReports";
import { AdminUsers } from "./ui/modules/admin/AdminUsers";
import { AdminSettings } from "./ui/modules/admin/AdminSettings";

// Common (multi-role)
import { AIAssistant } from "./ui/modules/common/AIAssistant";
import GoalSelection from "./ui/modules/common/GoalSelection";
import RoutineSettings from "./ui/modules/common/RoutineSettings";

/** Roles que podem acessar a rota. ADMIN pode acessar todas as áreas (admin, aluno, personal). */
const PrivateRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const userStr = localStorage.getItem("@sparta:user");
  if (!userStr) return <Navigate to="/login" replace />;

  const user = JSON.parse(userStr);
  const canAccess = allowedRoles.includes(user.role);
  return canAccess ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <SpartaProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Domínio Aluno */}
          <Route
            path="/dashboard/student"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/workouts"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <StudentWorkouts />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/workout"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <WorkoutOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="/workout-overview"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <WorkoutOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="/active-workout"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <ActiveWorkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/diet"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <DailyDiet />
              </PrivateRoute>
            }
          />
          <Route
            path="/meal-scan"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <MealScan />
              </PrivateRoute>
            }
          />
          <Route
            path="/diet/photos"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <DietPhotoGallery />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/perfil"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <StudentProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/perfil/historico"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <TrainingHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <StudentProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/goal"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <GoalSelection />
              </PrivateRoute>
            }
          />
          <Route
            path="/routine"
            element={
              <PrivateRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <RoutineSettings />
              </PrivateRoute>
            }
          />

          {/* Domínio Profissional */}
          <Route
            path="/dashboard/professional"
            element={
              <PrivateRoute allowedRoles={["PERSONAL", "ADMIN"]}>
                <ProfessionalDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/professional/solicitacoes"
            element={
              <PrivateRoute allowedRoles={["PERSONAL", "ADMIN"]}>
                <ProfessionalSolicitacoes />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/professional/students"
            element={
              <PrivateRoute allowedRoles={["PERSONAL", "ADMIN"]}>
                <ProfessionalStudents />
              </PrivateRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <PrivateRoute allowedRoles={["PERSONAL", "ADMIN"]}>
                <AIAssistant />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/edit-workout"
            element={
              <PrivateRoute allowedRoles={["PERSONAL", "ADMIN"]}>
                <InstructorReview />
              </PrivateRoute>
            }
          />

          {/* Domínio Admin */}
          <Route
            path="/dashboard/admin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminReports />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminSettings />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </SpartaProvider>
  );
};

export default App;
