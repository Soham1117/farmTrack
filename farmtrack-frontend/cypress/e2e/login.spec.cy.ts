describe('Login Component', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.get('form').should('exist');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show an error message for invalid credentials', () => {
    cy.get('input[name="username"]').type('invaliduser');
    cy.get('input[name="password"]').type('wrongpassword');

    cy.get('button[type="submit"]').click();

    cy.contains('Invalid username or password').should('be.visible');
  });

  it('should log in successfully with valid credentials and redirect to the home page', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    }).as('loginRequest');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');

    cy.get('button[type="submit"]').should('not.be.disabled');

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.url().should('include', '/');
  });

  it('should disable the submit button while loading', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
      delay: 1000,
    }).as('loginRequest');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');

    cy.get('button[type="submit"]').should('not.be.disabled');

    cy.get('button[type="submit"]').click();

    cy.get('button[type="submit"]').should('be.disabled');

    cy.wait('@loginRequest');

    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});
