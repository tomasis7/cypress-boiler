describe("Recipe Discovery Flow", () => {
  beforeEach(() => {
    cy.task("reseed");
    cy.request("POST", "/api/auth/register", {
      email: "erik@example.com",
      name: "Erik Andersson",
    }).then((response) => {
      const user = response.body.user;
      cy.request("POST", "/api/recipes", {
        title: "Pannkakor",
        ingredients: ["mjöl", "mjölk", "ägg"],
        instructions: ["Blanda allt", "Stek i panna"],
        authorId: user.id,
      });
    });
  });

  it("Maria visits homepage and views a recipe", () => {
    cy.visit("/");
    cy.get("h2").should("contain", "Alla Recept");
    cy.contains("Pannkakor").should("be.visible");
    cy.contains("Av: Erik Andersson").should("be.visible");
    cy.contains("3 ingredienser • 2 steg").should("be.visible");
    cy.contains("Pannkakor").click();
    cy.url().should("include", "/recipes/");
    cy.get("h1").should("contain", "Pannkakor");
    cy.contains("Av: Erik Andersson").should("be.visible");
    cy.contains("h2", "Ingredienser").should("be.visible");
    cy.get("ul").within(() => {
      cy.contains("mjöl").should("be.visible");
      cy.contains("mjölk").should("be.visible");
      cy.contains("ägg").should("be.visible");
    });
    cy.contains("h2", "Instruktioner").should("be.visible");
    cy.get("ol").within(() => {
      cy.contains("Blanda allt").should("be.visible");
      cy.contains("Stek i panna").should("be.visible");
    });
    cy.contains("Av: Erik Andersson").should("be.visible");
    cy.contains("← Tillbaka till startsidan").should("be.visible").click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });
});
