export const sectionPaths = {
  overview: "/",
  planner: "/meal-planner",
  prep: "/prep-sessions",
  groceries: "/shopping-list",
  recipes: "/menu",
  preferences: "/preferences",
} as const;

export type Section = keyof typeof sectionPaths;
