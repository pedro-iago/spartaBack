// --- ENUMS (Domínio) ---
export enum UserRole {
    ADMIN = 'ADMIN',
    PROFESSIONAL = 'PROFESSIONAL',
    STUDENT = 'STUDENT'
}

export enum Goal {
    WEIGHT_LOSS = 'WEIGHT_LOSS',
    HYPERTROPHY = 'HYPERTROPHY',
    CONDITIONING = 'CONDITIONING',
}

export enum ExperienceLevel {
    BEGINNER = 'Iniciante',
    INTERMEDIATE = 'Intermediário',
    ADVANCED = 'Avançado',
}

export enum MuscleGroup {
    CHEST = 'Peito',
    BACK = 'Costas',
    LEGS = 'Pernas',
    SHOULDERS = 'Ombros',
    ARMS = 'Braços',
    CORE = 'Abdômen',
    CARDIO = 'Cardio',
    UNKNOWN = 'Geral'
}

// --- AUTH DTOs (Novos - Para Login e Registro) ---

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
    role?: UserRole | string; // Opcional, backend define padrão STUDENT se omitido
}

/** Usuário básico retornado pela API no Login */
export interface User {
    id?: number; // Opcional pois o JWT já carrega a identidade
    name: string;
    email: string;
    role: UserRole;
}

/** Resposta do endpoint /auth/login */
export interface LoginResponseDTO {
    token: string;
    user: User;
}

// --- DOMÍNIO FITNESS (Mantido) ---

/** Badge de técnica avançada (ex.: Ponto de Falha, Drop Set) */
export type ExerciseTechnique = 'Ponto de Falha' | 'Drop Set' | 'Biseto' | 'Rest-Pause' | 'Cluster' | string;

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
    muscleGroup: MuscleGroup;
    image?: string;
    done?: boolean;
    technique?: ExerciseTechnique;
    equipment?: string;
    replacementOptions?: Exercise[];
}

export interface Workout {
    id: string;
    name: string;
    focalMuscles: string;
    duration: number;
    exercises: Exercise[];
    isAiGenerated?: boolean;
    status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
    completedCount?: number;
}

export interface MealVariation {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    imageUrl?: string;
}

export interface Meal {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    time: string;
    completed: boolean;
    variations?: MealVariation[];
}

export interface DietPhoto {
    id: string;
    mealId: string;
    mealName: string;
    imageUrl: string;
    createdAt: string;
}

export interface UserBioimpedance {
    peso?: number;
    altura?: number;
    gordura?: number;
    muscular?: number;
    agua?: number;
    visceral?: number;
    date?: string;
    nextDate?: string;
}

/** Estado Global da Aplicação (Context) */
export interface UserState {
    name: string;
    email?: string; // Adicionado para consistência
    role: UserRole; 
    isAuthenticated?: boolean; // Controle de sessão no front
    goal?: Goal;
    frequency?: number;
    level?: ExperienceLevel;
    currentWorkout?: Workout;
    history?: any[];
    avatarUrl?: string;
    plan?: string;
    planExpiration?: string;
    bio?: UserBioimpedance;
}

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ScheduledWorkout {
    id: string;
    dayOfWeek: DayOfWeek;
    name: string;
    durationMinutes: number;
    workoutId?: string;
    completed?: boolean;
}

export interface StudentWorkoutPlanResponse {
    scheduledWorkouts: ScheduledWorkout[];
}

export interface CreateTrainingDTO {
    level: ExperienceLevel;
    focus: Goal;
    daysPerWeek: number;
    limitations: string;
}