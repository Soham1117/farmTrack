describe('User Management Component', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/users', {
      statusCode: 201,
      body: { username: 'testuser', password: 'password123', role: 'VIEWER' },
    }).as('createUser');

    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/farms');

    cy.visit('/users');
  });

  it('should add a new user successfully', () => {
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('select[name="role"]').select('VIEWER');

    cy.get('button[type="submit"]').click();

    cy.wait('@createUser');

    cy.url().should('include', '/');
  });

  it('should cancel the form and return to the home page', () => {
    cy.get('button').contains('Cancel').click();

    cy.url().should('include', '/');
  });

  it('should show validation errors for invalid input', () => {
    cy.get('button[type="submit"]').click();

    cy.contains('Username is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });
});
