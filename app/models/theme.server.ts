import { prisma } from "~/db.server";

/**
 * Creates a new default theme with pre-defined colors and mood.
 *
 * @async
 * @function
 * @returns {Promise<Theme>} - A Promise that resolves to the newly created Theme object.
 */
export async function createDefaultTheme() {
  return await prisma.theme.create({
    data: {
      name: "default",
      primary: "hsl(165, 23%, 65%)",
      secondary: "hsl(170, 20%, 71%)",
      accent: "#59A19F",
      accent2: "#5FA59C",
      mood: "light",
    },
  });
}

/**
 * Populates the database with default theme data if the purple theme is not found.
 * Themes added: purple, azure, jasmine, ruby, dark
 * @returns {Promise<void>}
 */
export async function populateTheme() {
  const defaultTheme = await prisma.theme.findFirst({
    where: { name: "purple" },
  });
  if (defaultTheme) return;
  await prisma.theme.create({
    data: {
      name: "purple",
      primary: "hsl(283,88%,31%)",
      secondary: "hsl(218, 18%, 32%)",
      accent: "hsl(304,32%,30%)",
      accent2: "hsl(283,90%,32%)",
      mood: "dark",
    },
  });
  await prisma.theme.create({
    data: {
      name: "azure",
      primary: "hsl(200,64%,70%)",
      secondary: "hsl(179,81%,69%)",
      accent: "hsl(251,84%,73%)",
      accent2: "#8996EB",
      mood: "light",
    },
  });
  await prisma.theme.create({
    data: {
      name: "jasmine",
      primary: "hsl(40,99%, 44%)",
      secondary: "hsl(60,12%,10%)",
      accent: "hsl(0,80%,44%)",
      accent2: "hsl(108,58%,31%)",
      mood: "dark",
    },
  });
  await prisma.theme.create({
    data: {
      name: "ruby",
      primary: "hsl(0,78%,35%)",
      secondary: "hsl(0,9%,4%)",
      accent: "hsl(10,91%,29%)",
      accent2: "hsl(0,43%,25%)",
      mood: "dark",
    },
  });
  await prisma.theme.create({
    data: {
      name: "dark",
      primary: "hsl(200, 16%, 19%)",
      secondary: "hsl(218, 18%, 32%)",
      accent: "hsl(251,90%,34%)",
      accent2: "hsl(283,90%,32%)",
      mood: "dark",
    },
  });
}

/**
 * Retrieves the user's theme from the database, or returns the default theme if no user is found.
 * @param {string} userId - The ID of the user whose theme is being retrieved.
 * @returns {Promise<Object>} The theme object containing the name, primary color, secondary color, accent color, accent2 color, and mood of the theme.
 * @throws {Error} Throws an error if the default theme cannot be found or created.
 */
export async function getTheme(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });
  let theme;
  if (!user) {
    theme = await prisma.theme.findFirst({ where: { name: "default" } });
    if (!theme) {
      theme = await createDefaultTheme();
    }
    return theme;
  }
  theme = await prisma.theme.findFirst({
    where: { id: user?.settings?.themeId },
  });
  return theme;
}
