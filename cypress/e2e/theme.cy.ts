describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });
  it("should change colors of element with the theme", () => {
    cy.fixture("dark").then((fixtureData) => {
      console.log(fixtureData);
      cy.login();
      cy.visit("/settings");
      cy.wait(1000);
      cy.get("#theme").select("dark");
      cy.get("#save-profile").click();
      cy.get("main").should("have.css", "background-color", "rgb(0, 0, 0)");
      cy.get("#save-profile").should(
        "have.css",
        "background-color",
        fixtureData.accent
      );
      cy.get("#view-profile").should(
        "have.css",
        "background-color",
        fixtureData.accent2
      );
      cy.visit("/");
      cy.wait(1000);
      cy.get("article:first .article-container").should(
        "have.css",
        "background-color",
        fixtureData.accent2
      );
      cy.get("#next-page").should("have.css", "color", "hsl(251, 80%, 34%)");
      cy.get("article:first").click();
      cy.wait(1000);
      cy.get("main").should("have.css", "background-color", "rgb(0, 0, 0)");
      cy.get("article:first .post-user").click();
      cy.wait(1000);
      cy.get("main").should("have.css", "background-color", "rgb(0, 0, 0)");
      cy.get(".total-label").should("have.css", "color", "rgb(43, 17, 156)");
      cy.visit("/newpost");
      cy.wait(1000);
      cy.get("#upload-button").should(
        "have.css",
        "background-color",
        fixtureData.accent2
      );
      cy.get("#submit-button").should(
        "have.css",
        "background-color",
        fixtureData.accent
      );
    });
  });
});