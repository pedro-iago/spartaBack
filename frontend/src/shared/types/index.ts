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

/** Resposta do endpoint /auth/login (backend retorna name, role, token) */
export interface LoginResponseDTO {
    name: string;
    role: string;
    token: string;
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

/** Payload para POST /trainings/request (backend espera level/focus como string) */
export interface CreateTrainingDTO {
    level: string;   // BEGINNER | INTERMEDIATE | ADVANCED
    focus: string;   // HYPERTROPHY | STRENGTH | ENDURANCE (ou WEIGHT_LOSS, CONDITIONING)
    daysPerWeek: number;
    limitations: string;
}

/** Resposta GET /trainings/my-active e POST /trainings/request */
export interface TrainingSetDTO {
    id: string;
    exerciseId: string;
    exerciseName: string;
    dayLetter: string;
    exerciseOrder: number;
    sets: number;
    reps: string;
    restSeconds: number;
    loadPrescription: string;
    technique: string;
    notes: string;
    createdAt: string;
}

export interface TrainingResponseDTO {
    id: string;
    userId: string;
    userName: string;
    level: string;
    focus: string;
    daysPerWeek: number;
    limitations: string;
    status: string; // DRAFT, PENDING_REVIEW, ACTIVE, COMPLETED, ARCHIVED
    sets: TrainingSetDTO[];
    createdAt: string;
    updatedAt: string;
}

/** Resumo da anamnese para o profissional avaliar no dashboard. */
export interface AnamnesisSummaryDTO {
    id: string;
    weight: number | null;
    height: number | null;
    age: number | null;
    gender: string | null;
    goal: string;
    activityLevel: string | null;
    daysPerWeekAvailable: number | null;
    injuries: string | null;
    medicalConditions: string | null;
    createdAt: string;
}

/** Item de revisão pendente: treino + anamnese do aluno. */
export interface PendingReviewDTO {
    training: TrainingResponseDTO;
    anamnesis: AnamnesisSummaryDTO | null;
}

/** Payload para PUT /trainings/{id} (atualizar sets do treino) */
export interface UpdateTrainingSetDTO {
    id: string | null;
    exerciseId: string;
    dayLetter: string;
    exerciseOrder: number;
    sets: number;
    reps: string;
    restSeconds: number;
    loadPrescription: string;
    technique: string;
    notes: string;
}

export interface UpdateTrainingDTO {
    sets: UpdateTrainingSetDTO[];
}

/** Payload para POST /trainings/{id}/approve */
export interface ApproveTrainingDTO {
    approved: boolean;
    feedback?: string;
}