// Test 2: Recipe Discovery  
// Maria finds and views a recipe

describe('Recipe Discovery Flow', () => {
  beforeEach(() => {
    // Reseed database and create test data
    cy.task('reseed');
    
    // Create a test user and recipe via API
    cy.request('POST', '/api/auth/register', {
      email: 'erik@example.com',
      name: 'Erik Andersson'
    }).then((response) => {
      const user = response.body.user;
      
      // Create a recipe
      cy.request('POST', '/api/recipes', {
        title: 'Pannkakor',
        ingredients: ['mjöl', 'mjölk', 'ägg'],
        instructions: ['Blanda allt', 'Stek i panna'],
        authorId: user.id
      });
    });
  });

  it('Maria visits homepage and views a recipe', () => {
    // Visit homepage
    cy.visit('/');
    
    // Should see list of recipes
    cy.get('h2').should('contain', 'Alla Recept');
    cy.contains('Pannkakor').should('be.visible');
    cy.contains('Av: Erik Andersson').should('be.visible');
    cy.contains('3 ingredienser • 2 steg').should('be.visible');
    
    // Click on "Pannkakor" recipe
    cy.contains('Pannkakor').click();
    
    // Should navigate to recipe detail page
    cy.url().should('include', '/recipes/');
    
    // Verify all recipe content displays correctly
    cy.get('h1').should('contain', 'Pannkakor');
    cy.contains('Av: Erik Andersson').should('be.visible');
    
    // Verify ingredients section
    cy.contains('h2', 'Ingredienser').should('be.visible');
    cy.get('ul').within(() => {
      cy.contains('mjöl').should('be.visible');
      cy.contains('mjölk').should('be.visible');
      cy.contains('ägg').should('be.visible');
    });
    
    // Verify instructions section  
    cy.contains('h2', 'Instruktioner').should('be.visible');
    cy.get('ol').within(() => {
      cy.contains('Blanda allt').should('be.visible');
      cy.contains('Stek i panna').should('be.visible');
    });
    
    // Verify author name shows
    cy.contains('Av: Erik Andersson').should('be.visible');
    
    // Should have back link to homepage
    cy.contains('← Tillbaka till startsidan').should('be.visible').click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });
});