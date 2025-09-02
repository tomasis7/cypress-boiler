// Test 3: Error Handling
// Invalid form submission and error scenarios

describe('Error Handling', () => {
  beforeEach(() => {
    // Reseed database for clean state
    cy.task('reseed');
  });

  it('should redirect to login when trying to create recipe without authentication', () => {
    // Visit create recipe page directly without being logged in
    cy.visit('/create');
    
    // Should redirect to login page
    cy.url().should('include', '/login');
  });

  it('should show validation errors for empty recipe form', () => {
    // First register and login a user
    cy.visit('/login');
    cy.get('#email').type('validation1@example.com');
    cy.contains('Nytt här? Registrera dig').click();
    cy.get('#name').type('Validation Test User');
    cy.get('button[type="submit"]').click();
    
    // Wait to be redirected to homepage after successful registration
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    
    // Navigate to create recipe
    cy.contains('Skapa Recept').click();
    
    // Wait for form to load
    cy.get('#title').should('be.visible');
    cy.get('button[type="submit"]').should('contain.text', 'Skapa Recept');
    
    // Try to submit empty form
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.contains('Alla fält måste fyllas i').should('be.visible');
    
    // URL should stay on create page
    cy.url().should('include', '/create');
  });

  it('should show validation error when submitting form with missing ingredients', () => {
    // Register and login user
    cy.visit('/login');
    cy.get('#email').type('validation2@example.com');
    cy.contains('Nytt här? Registrera dig').click();
    cy.get('#name').type('Validation Test User 2');
    cy.get('button[type="submit"]').click();
    
    // Wait to be redirected to homepage after successful registration
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    
    // Navigate to create recipe
    cy.contains('Skapa Recept').click();
    
    // Fill only title, leave ingredients empty
    cy.get('#title').type('Test Recipe');
    cy.get('textarea[placeholder="Steg 1"]').type('Do something');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.contains('Alla fält måste fyllas i').should('be.visible');
  });

  it('should handle user registration with duplicate email', () => {
    // First register a user
    cy.visit('/login');
    cy.get('#email').type('duplicate@example.com');
    cy.contains('Nytt här? Registrera dig').click();
    cy.get('#name').type('First User');
    cy.get('button[type="submit"]').click();
    
    // Should successfully register and redirect
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    
    // Logout
    cy.contains('Logga ut').click();
    
    // Try to register again with same email
    cy.contains('Logga in / Registrera').click();
    cy.get('#email').type('duplicate@example.com');
    cy.contains('Nytt här? Registrera dig').click();
    cy.get('#name').type('Second User');
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.contains('User already exists').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should handle login with non-existent user', () => {
    cy.visit('/login');
    
    // Try to login with email that doesn't exist
    cy.get('#email').type('nonexistent@example.com');
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.contains('User not found').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should handle invalid recipe ID gracefully', () => {
    // Visit recipe page with invalid ID
    cy.visit('/recipes/invalid-recipe-id', { failOnStatusCode: false });
    
    // Should show error message
    cy.contains('Recipe not found').should('be.visible');
    
    // Should have back link that works
    cy.contains('← Tillbaka till startsidan').click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });
});