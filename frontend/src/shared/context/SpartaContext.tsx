import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserState, Meal, DietPhoto, Goal, ExperienceLevel, Workout, Exercise, UserRole } from '../types';

interface SpartaContextData {
  user: UserState;
  loading: boolean; // Novo: para controlar redirecionamento
  meals: Meal[];
  dietPhotos: DietPhoto[];
  
  // Ações
  updateUser: (data: Partial<UserState>) => void;
  logout: () => void; // Novo
  addMeal: (meal: Meal) => void;
  addDietPhoto: (photo: DietPhoto) => void;
  toggleMeal: (id: string) => void;
  completeWorkout: () => void;
  swapExercise: (originalExerciseId: string, newExercise: Exercise) => void;
}

const SpartaContext = createContext<SpartaContextData>({} as SpartaContextData);

export const SpartaProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  // Estado inicial do usuário
  const [user, setUserState] = useState<UserState>({
    isAuthenticated: false,
    name: "",
    role: null,
    token: null,
    level: ExperienceLevel.BEGINNER,
    frequency: 3,
    goal: Goal.HYPERTROPHY
  });

  // --- LÓGICA DE DIETA E TREINO (MANTIDA) ---
  const [meals, setMeals] = useState<Meal[]>([]);
  const EXAMPLE_DIET_PHOTOS: DietPhoto[] = [
    { id: "ex-1", mealId: "1", mealName: "Café da manhã", imageUrl: "/teste.jpg", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "ex-2", mealId: "2", mealName: "Almoço", imageUrl: "/teste.jpg", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "ex-3", mealId: "3", mealName: "Jantar", imageUrl: "/teste.jpg", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: "ex-4", mealId: "1", mealName: "Café da manhã", imageUrl: "/teste.jpg", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: "ex-5", mealId: "2", mealName: "Almoço", imageUrl: "/teste.jpg", createdAt: new Date().toISOString() },
  ];

  const [dietPhotos, setDietPhotos] = useState<DietPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('@sparta:diet-photos');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : EXAMPLE_DIET_PHOTOS;
    } catch { return EXAMPLE_DIET_PHOTOS; }
  });

  // --- EFEITOS DE SESSÃO ---
  
  useEffect(() => {
    const loadSession = () => {
      const storedUser = localStorage.getItem('@sparta:user');
      const storedToken = localStorage.getItem('@sparta:token');

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserState({
            ...parsedUser,
            isAuthenticated: true,
            token: storedToken // Garante que o token está no state
          });
        } catch (error) {
          console.error("Erro ao restaurar sessão:", error);
          logout();
        }
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  useEffect(() => {
    localStorage.setItem('@sparta:diet-photos', JSON.stringify(dietPhotos));
  }, [dietPhotos]);

  useEffect(() => {
    if (user.isAuthenticated) {
        localStorage.setItem('@sparta:user', JSON.stringify(user));
    }
  }, [user]);

  // --- ACTIONS ---

  const updateUser = (data: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...data }));
  };

  const logout = () => {
    localStorage.removeItem('@sparta:user');
    localStorage.removeItem('@sparta:token');
    setUserState({
      isAuthenticated: false,
      name: "",
      role: null,
      token: null,
      level: ExperienceLevel.BEGINNER,
      frequency: 3,
      goal: Goal.HYPERTROPHY
    });
    window.location.href = '/login';
  };

  const addMeal = (meal: Meal) => {
    setMeals(prev => [...prev, meal]);
  };

  const addDietPhoto = (photo: DietPhoto) => {
    setDietPhotos(prev => [...prev, photo]);
  };

  const toggleMeal = (id: string) => {
    setMeals(prev => prev.map(m => m.id === id ? {...m, completed: !m.completed} : m));
  };

  const completeWorkout = () => {
    console.log("Treino finalizado");
  };

  const swapExercise = (originalExerciseId: string, newExercise: Exercise) => {
    // Lógica futura de troca
  };

  return (
    <SpartaContext.Provider value={{ 
      user, 
      loading, 
      meals, 
      dietPhotos, 
      updateUser, 
      logout, 
      addMeal, 
      addDietPhoto, 
      toggleMeal, 
      completeWorkout, 
      swapExercise 
    }}>
      {children}
    </SpartaContext.Provider>
  );
};

export const useSparta = () => useContext(SpartaContext);