import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /sign up/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByLabelText(/name/i).type("cypress user");
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /login/i });
  });

  it("should contain a list of previous posts", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");
    cy.visitAndCheck("/");
    cy.findByRole("link", { name: /sign up/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByLabelText(/name/i).type("cypress user");
    cy.findByRole("button", { name: /create account/i }).click();
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
});
