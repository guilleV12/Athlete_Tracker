/** Catálogo canónico de logros (orden de progresión). */
export const ACHIEVEMENT_DEFINITIONS = [
  {
    condition: "workouts >= 1",
    sortOrder: 10,
    category: "workouts",
    name: "Primer entrenamiento",
    description: "Registrá tu primer entrenamiento en la app.",
  },
  {
    condition: "meals >= 1",
    sortOrder: 20,
    category: "nutrition",
    name: "Primera comida",
    description: "Empezá a llevar tu registro alimenticio del día.",
  },
  {
    condition: "profile_completed",
    sortOrder: 30,
    category: "profile",
    name: "Perfil listo",
    description: "Completá tu perfil para calcular BMR, TDEE y meta calórica.",
  },
  {
    condition: "nutrition_day_on_target",
    sortOrder: 40,
    category: "nutrition",
    name: "Día en objetivo",
    description: "Llegá a tu meta calórica de hoy (±10 %).",
  },
  {
    condition: "workouts >= 7",
    sortOrder: 50,
    category: "workouts",
    name: "Ritmo constante",
    description: "Acumulá 7 entrenamientos registrados.",
  },
  {
    condition: "nutrition_days_on_target >= 3",
    sortOrder: 60,
    category: "nutrition",
    name: "Tres días en meta",
    description: "Conseguí tu meta calórica en 3 días distintos (con comidas registradas).",
  },
  {
    condition: "workouts >= 30",
    sortOrder: 70,
    category: "workouts",
    name: "Atleta dedicado",
    description: "Llegá a 30 entrenamientos registrados.",
  },
];
