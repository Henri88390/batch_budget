export const sectionPaths = {
  overview: "/",
  planner: "/meal-planner",
  prep: "/prep-sessions",
  groceries: "/shopping-list",
  recipes: "/menu",
  preferences: "/preferences",
  about: "/about",
} as const;

export type Section = keyof typeof sectionPaths;
