// Test 1: User Registration & Recipe Creation
// Erik creates and shares a recipe

describe('Recipe Creation Flow', () => {
  beforeEach(() => {
    // Reseed database for clean state
    cy.task('reseed');
  });

  it('Erik registers and creates a pannkakor recipe', () => {
    // Visit site
    cy.visit('/');
    
    // Should see empty state message
    cy.contains('Inga recept ännu');
    
    // Click login/register link  
    cy.contains('Logga in / Registrera').click();
    cy.url().should('include', '/login');
    
    // Register with email and name
    cy.get('#email').type('erik@example.com');
    
    // Switch to register mode
    cy.contains('Nytt här? Registrera dig').click();
    cy.get('#name').should('be.visible');
    cy.get('#name').type('Erik Andersson');
    
    // Submit registration
    cy.get('button[type="submit"]').click();
    
    // Should redirect to homepage and be logged in
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    cy.contains('Välkommen, Erik Andersson!');
    
    // Navigate to create recipe
    cy.contains('Skapa Recept').click();
    cy.url().should('include', '/create');
    
    // Fill recipe form
    cy.get('#title').type('Pannkakor');
    
    // Add ingredients - should start with one empty field
    cy.get('input[placeholder="Ingrediens 1"]').type('mjöl');
    cy.contains('+ Lägg till ingrediens').click();
    cy.get('input[placeholder="Ingrediens 2"]').type('mjölk');
    cy.contains('+ Lägg till ingrediens').click();
    cy.get('input[placeholder="Ingrediens 3"]').type('ägg');
    
    // Add instructions - should start with one empty field  
    cy.get('textarea[placeholder="Steg 1"]').type('Blanda allt');
    cy.contains('+ Lägg till steg').click();
    cy.get('textarea[placeholder="Steg 2"]').type('Stek i panna');
    
    // Submit recipe
    cy.get('button[type="submit"]').click();
    
    // Should redirect to homepage
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    
    // Verify recipe appears on homepage
    cy.contains('Pannkakor');
    cy.contains('Av: Erik Andersson');
    cy.contains('3 ingredienser • 2 steg');
  });
});