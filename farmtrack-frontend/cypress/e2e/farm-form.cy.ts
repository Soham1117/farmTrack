describe('Farm Form Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
  });

  it('should add a new farm successfully', () => {
    cy.contains('Add Farm').click();
    cy.url().should('include', '/farm/create');

    cy.get('#premiseId').should('be.visible').type('NEWFARM001');
    cy.get('#total_animal').type('150');

    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/farms');
  });

  it('should edit an existing farm successfully', () => {
    cy.intercept('GET', '/api/farms/671HMJV', {
      statusCode: 200,
      body: { premiseId: '671HMJV', totalAnimal: 100 },
    }).as('getFarmById');

    cy.intercept('PUT', '/api/farms/671HMJV', {
      statusCode: 200,
      body: { premiseId: '671HMJV', totalAnimal: 200 },
    }).as('updateFarm');

    cy.visit('/farm/edit/671HMJV');

    cy.wait('@getFarmById');

    cy.get('input[name="premiseId"').should('have.value', '671HMJV');
    cy.get('#total_animal').should('have.value', '100');

    cy.get('#total_animal').clear().type('200');

    cy.get('button[type="submit"]').click();

    cy.wait('@updateFarm');

    cy.url().should('include', '/farms');
  });

  it('should cancel the form and return to the farms list', () => {
    cy.contains('Add Farm').click();
    cy.url().should('include', '/farm/create');

    cy.contains('Cancel').click();

    cy.url().should('include', '/farms');
  });

  it('should display the correct title for add and edit modes', () => {
    cy.contains('Add Farm').click();
    cy.get('h2').should('contain', 'Add Farm');

    cy.visit('/farm/edit/671HMJV');
    cy.get('h2').should('contain', 'Edit Farm');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('POST', '/api/farms', {
      statusCode: 400,
      body: { error: 'Invalid premise ID or total animals' },
    }).as('createFarmError');

    cy.contains('Add Farm').click();
    cy.get('#premiseId').type('INVALID001');
    cy.get('#total_animal').type('100');
    cy.get('button[type="submit"]').click();

    cy.wait('@createFarmError');

    cy.contains('Invalid premise ID or total animals').should('be.visible');
  });

  it('should disable the submit button while loading', () => {
    cy.intercept('POST', '/api/farms', (req) => {
      req.reply({ delay: 1000, statusCode: 200 });
    }).as('createFarm');

    cy.contains('Add Farm').click();
    cy.get('#premiseId').type('SLOWFARM001');
    cy.get('#total_animal').type('100');
    cy.get('button[type="submit"]').click();

    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('button[type="submit"]').should('contain', 'Saving...');

    cy.wait('@createFarm');

    cy.url().should('include', '/farms');
  });
});
