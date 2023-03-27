import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";

import { prisma } from "~/db.server";
import { validateEmail } from "~/utils";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserProfileById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true, comments: true },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  email: User["email"],
  password: string,
  name: User["name"]
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      name,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      settings: {
        create: {
          notifications: true,
          privacy: "none",
          accessibility: "none",
          theme: "light",
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function getUserSettings(id: User["id"]) {
  try {
    return await prisma.user.findFirst({
      where: { id },
      include: { settings: true },
    });
  } catch (error: any) {
    throw new Error("Error getting user! " + error.message);
  }
}

export async function updateUserById(id: User["id"], formData: FormData) {
  const theme = formData.get("theme");
  const notifications = formData.get("notifications") === "on";
  const privacy = formData.get("privacy");
  const email = formData.get("useremail");
  const accessibility = formData.get("accessibility");
  invariant(typeof theme === "string", "theme must be a string");
  invariant(typeof privacy === "string", "privacy must be a string");
  invariant(
    typeof accessibility === "string",
    "accessibility must be a string"
  );
  invariant(
    validateEmail(email),
    "email must be a email that ends with a @domain"
  );
  try {
    return await prisma.user.update({
      where: { id },
      data: {
        email: email,
        settings: {
          update: {
            theme,
            notifications,
            privacy,
            accessibility,
          },
        },
      },
    });
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}
