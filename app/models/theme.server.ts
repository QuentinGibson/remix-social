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
      accent: "hsl(304,32%,20%)",
      accent2: "hsl(283,90%,32%)",
      mood: "dark",
    },
  });
  await prisma.theme.create({
    data: {
      name: "azure",
      primary: "hsl(200,64%,70%)",
      secondary: "hsl(231,74%,32%)",
      accent: "hsl(251,86%,17%)",
      accent2: "hsl(241,51%,39%)",
      mood: "light",
    },
  });
  await prisma.theme.create({
    data: {
      name: "jasmine",
      primary: "hsl(47, 90%, 73%)",
      secondary: "hsl(60,12%,10%)",
      accent: "hsl(120,80%,34%)",
      accent2: "hsl(108,58%,41%)",
      mood: "dark",
    },
  });
  await prisma.theme.create({
    data: {
      name: "ruby",
      primary: "hsl(0,78%,35%)",
      secondary: "hsl(0,9%,4%)",
      accent: "hsl(0,71%,39%)",
      accent2: "hsl(0,47%,49%)",
      mood: "dark",
    },
  });
  await prisma.theme.create({
    data: {
      name: "dark",
      primary: "hsl(200, 16%, 19%)",
      secondary: "hsl(218, 18%, 32%)",
      accent: "hsl(251,80%,34%)",
      accent2: "hsl(283,90%,32%)",
      mood: "dark",
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
    return theme;
  }
  theme = await prisma.theme.findFirst({
    where: { id: user?.settings?.themeId },
  });
  return theme;
}
