import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";

import { prisma } from "~/db.server";
import { validateEmail } from "~/utils";
import { createDefaultTheme, populateTheme } from "./theme.server";

export type { User } from "@prisma/client";

/**
 * Retrieves a user from the database based on their ID.
 *
 * @async
 * @function getUserById
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<User>} - A promise that resolves to the user object.
 */
export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

/**
 * Retrieves a user profile from the database based on their ID, including their posts and comments.
 *
 * @async
 * @function getUserProfileById
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<User>} - A promise that resolves to the user object, including their posts and comments.
 */

export async function getUserProfileById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true, comments: true },
  });
}

/**
 * Retrieves a user from the database based on their email address.
 *
 * @async
 * @function getUserByEmail
 * @param {string} email - The email address of the user to retrieve.
 * @returns {Promise<User>} - A promise that resolves to the user object.
 */
export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

/**

Creates a new user with the specified email, password, and name.
@async
@param {string} email - The email address of the user.
@param {string} password - The user's password (will be hashed before storing in the database).
@param {string} name - The name of the user.
@returns {Promise<User>} A Promise that resolves with the newly created user object.
@throws {Error} If a default theme cannot be found or created.
*/
export async function createUser(
  email: User["email"],
  password: string,
  name: User["name"]
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  let defaultTheme;
  try {
    defaultTheme = await prisma.theme.findFirstOrThrow();
  } catch (error) {
    defaultTheme = await createDefaultTheme();
  }

  const isAdmin = email === "quent@example.com";

  return prisma.user.create({
    data: {
      email,
      name,
      isAdmin,
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
          theme: { connect: { id: defaultTheme.id } },
        },
      },
    },
  });
}

/**

Retrieves and deletes the user with the given email address.
@param {string} email - The email address of the user to delete.
@returns {Promise<User>} The deleted user object.
*/
export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

/**
Verifies the user's email and password combination for login.
@param {string} email - The email address of the user.
@param {string} password - The hashed password of the user.
@returns {Promise<User|null>} The user object if the login is successful, or null if the email or password is incorrect.
*/
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

/**

Retrieves the user settings and theme list for the given user ID.
@param {number} id - The ID of the user to retrieve settings for.
@returns {Promise<{user: User, themeList: Theme[]}>} An object containing the user object and a list of available themes.
@throws {Error} If there is an error getting the user's settings.
*/
export async function getUserSettings(id: User["id"]) {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
      include: { settings: true },
    });

    const themeList = await prisma.theme.findMany({
      select: { id: true, name: true },
    });

    return { user, themeList };
  } catch (error: any) {
    throw new Error("Error getting user! " + error.message);
  }
}

/**

Updates the user settings for the given user ID.
@param {number} id - The ID of the user to update settings for.
@param {FormData} formData - The form data containing the new user settings.
@returns {Promise<User>} The updated user object.
@throws {Error} If there is an error updating the user's settings.
*/
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
            theme: { connect: { id: theme } },
            notifications,
            privacy,
            accessibility,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Error updatting user! " + error.message);
  }
}
