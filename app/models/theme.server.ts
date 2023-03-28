import { prisma } from "~/db.server";

export async function createDefaultTheme() {
  return await prisma.theme.create({
    data: {
      name: "default",
      primary: "hsl(165, 23%, 65%)",
      secondary: "hsl(170, 20%, 71%)",
      accent: "hsl(178, 99%, 20%)",
      accent2: "hsl(172,29%,35%)",
      mood: "light",
    },
  });
}

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
  }
  theme = await prisma.theme.findFirst({
    where: { id: user?.settings?.themeId },
  });
  return theme;
}
