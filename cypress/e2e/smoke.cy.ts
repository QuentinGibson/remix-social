import { faker } from "@faker-js/faker";
import { getUser } from "~/session.server";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      name: faker.internet.userName(),
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /sign up/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByLabelText(/name/i).type(loginForm.name);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /login/i });
  });

  it("should contain a list of previous posts", () => {
    cy.login();
    cy.visitAndCheck("/");
    // Get the first article element
    cy.get("article:first").then(($article: JQuery<HTMLElement>) => {
      // Get the initial like count as a number
      const initialLikes: number = parseInt(
        $article.find(".total-likes").html() as string
      );

      // Click the like button
      cy.get("article:first .like-button").click();
      cy.wait(2000);

      // Get the updated like count as a number
      cy.get("article:first").then(($article: JQuery<HTMLElement>) => {
        const updatedLikes: number = parseInt(
          $article.find(".total-likes").html() as string
        );
        cy.get("article:first .like-button").click();

        // Check if the updated like count increased by one
        expect(updatedLikes).to.equal(initialLikes + 1);
      });
    });
  });
  it("should allow you to leave a comment on a post", () => {
    const comment = faker.lorem.words(14);
    cy.login();
    cy.visit("/");
    cy.get("article:first .post-anchor").click();
    cy.get(
      "form[action='/api/forms/newcomment'] textarea[name='comment']"
    ).type(comment);
    cy.get(
      "form[action='/api/forms/newcomment'] button[type='submit']"
    ).click();
    cy.get("ul#comments li:first-child").should("contain.text", comment);
  });
  // it("should allow you to create a new post", () => {

  // })
  it("should allow you to change user settings", () => {
    cy.login();
    cy.visit("/settings");

    cy.get("#theme-input").clear().type("dark"); // types "dark" into the theme input field
    // cy.get("#language-select").select("French"); // selects "French" from the language dropdown
    // cy.get("#layout-input").clear().type("grid"); // types "grid" into the layout input field
    cy.get("#notifications-checkbox").check(); // checks the notifications checkbox
    cy.get("#privacy-select").select("private"); // selects "private" from the privacy dropdown
    cy.get("#accessibility-select").select("high-contrast"); // selects "high-contrast" from the accessibility dropdown
    cy.get("#save-button").click(); // clicks the save button

    // asserts that the user settings have been updated
    cy.get("#theme-input").should("have.value", "dark");
    // cy.get("#language-select").should("have.value", "French");
    // cy.get("#layout-input").should("have.value", "grid");
    cy.get("#notifications-checkbox").should("be.checked");
    cy.get("#privacy-select").should("have.value", "private");
    cy.get("#accessibility-select").should("have.value", "high-contrast");
  });
  it("shows the user details", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      name: faker.internet.userName(),
      password: faker.internet.password(),
      avatar: "",
      bio: "",
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /sign up/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByLabelText(/name/i).type(loginForm.name);
    cy.findByRole("button", { name: /create account/i }).click();
    cy.get("/settings");
    cy.get("#viewprofile").click();
    // Replace the selectors with the actual selectors for the elements that detail the user
    cy.get(".user-name").should("contain", loginForm.name); // checks that the user's name is displayed
    cy.get(".user-avatar").should("have.attr", "src", loginForm.avatar); // checks that the user's avatar is displayed with the correct URL
    cy.get(".user-bio").should("contain", loginForm.bio); // checks that the user's bio is displayed
    cy.get(".user-posts").should("have.length", 5); // checks that the user has 5 posts displayed
  });
});
