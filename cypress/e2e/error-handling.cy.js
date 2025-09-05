describe("Error Handling", () => {
  beforeEach(() => {
    cy.task("reseed");
  });

  it("should redirect to login when trying to create recipe without authentication", () => {
    cy.visit("/create");

    cy.url().should("include", "/login");
  });

  it("should show validation errors for empty recipe form", () => {
    cy.visit("/login");
    cy.get("#email").type("validation1@example.com");
    cy.contains("Nytt här? Registrera dig").click();
    cy.get("#name").type("Validation Test User");
    cy.get('button[type="submit"]').click();

    cy.url().should("eq", Cypress.config("baseUrl") + "/");

    cy.contains("Skapa Recept").click();

    cy.get("#title").should("be.visible");
    cy.get('button[type="submit"]').should("contain.text", "Skapa Recept");

    cy.get('button[type="submit"]').click();

    cy.contains("Alla fält måste fyllas i").should("be.visible");

    cy.url().should("include", "/create");
  });

  it("should show validation error when submitting form with missing ingredients", () => {
    cy.visit("/login");
    cy.get("#email").type("validation2@example.com");
    cy.contains("Nytt här? Registrera dig").click();
    cy.get("#name").type("Validation Test User 2");
    cy.get('button[type="submit"]').click();

    cy.url().should("eq", Cypress.config("baseUrl") + "/");

    cy.contains("Skapa Recept").click();

    cy.get("#title").type("Test Recipe");
    cy.get('textarea[placeholder="Steg 1"]').type("Do something");

    cy.get('button[type="submit"]').click();

    cy.contains("Alla fält måste fyllas i").should("be.visible");
  });

  it("should handle user registration with duplicate email", () => {
    cy.visit("/login");
    cy.get("#email").type("duplicate@example.com");
    cy.contains("Nytt här? Registrera dig").click();
    cy.get("#name").type("First User");
    cy.get('button[type="submit"]').click();

    cy.url().should("eq", Cypress.config("baseUrl") + "/");

    cy.contains("Logga ut").click();

    cy.contains("Logga in / Registrera").click();
    cy.get("#email").type("duplicate@example.com");
    cy.contains("Nytt här? Registrera dig").click();
    cy.get("#name").type("Second User");
    cy.get('button[type="submit"]').click();

    cy.contains("User already exists").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("should handle login with non-existent user", () => {
    cy.visit("/login");

    cy.get("#email").type("nonexistent@example.com");
    cy.get('button[type="submit"]').click();

    cy.contains("User not found").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("should handle invalid recipe ID gracefully", () => {
    cy.visit("/recipes/invalid-recipe-id", { failOnStatusCode: false });

    cy.contains("Recipe not found").should("be.visible");

    cy.contains("← Tillbaka till startsidan").click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });
});
