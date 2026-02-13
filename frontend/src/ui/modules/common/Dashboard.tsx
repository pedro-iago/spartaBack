import React from 'react';
import { useSparta } from '../../../shared/context/SpartaContext';
import { UserRole } from '../../../shared/types';

// Import dos 3 Painéis (Caminhos Corrigidos)
import AdminDashboard from '../admin/AdminDashboard';
import ProfessionalDashboard from '../professional/ProfessionalDashboard';
import StudentDashboard from '../student/StudentDashboard'; 

const Dashboard: React.FC = () => {
  const { user } = useSparta();
  
  if (!user || !user.isAuthenticated) {
     return <div className="text-white p-10">Carregando perfil...</div>;
  }

  console.log("Cargo do Usuário:", user.role); 

  // ROTEAMENTO DE VISUALIZAÇÃO
  switch (user.role) {
    case UserRole.ADMIN:
        return <AdminDashboard />;
        
    case UserRole.PROFESSIONAL:
        return <ProfessionalDashboard />;
        
    case UserRole.STUDENT:
    default:
        // Se for aluno (ou indefinido), mostra a tela clássica
        return <StudentDashboard />;
  }
};

export default Dashboard;