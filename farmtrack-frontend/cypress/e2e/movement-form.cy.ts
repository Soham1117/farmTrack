describe('Movement Form Component', () => {
  const mockFarms = [
    { premiseId: 'FARM001', totalAnimal: 100 },
    { premiseId: 'FARM002', totalAnimal: 50 },
  ];

  const mockMovement = {
    movementId: 1,
    originFarm: { premiseId: 'FARM001', totalAnimal: 100 },
    destinationFarm: { premiseId: 'FARM002', totalAnimal: 50 },
    numItemsMoved: 10,
  };

  beforeEach(() => {
    cy.intercept('GET', '/api/farms', mockFarms).as('getFarms');

    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/farms');

    cy.visit('/movements');
    cy.wait('@getFarms');
  });

  it('should add a new movement successfully', () => {
    cy.intercept('POST', '/api/movements', {
      statusCode: 201,
      body: mockMovement,
    }).as('createMovement');

    cy.intercept('PUT', '/api/farms/*', { statusCode: 200 }).as('updateFarm');

    cy.visit('/movement/create');

    cy.get('select[name="originPremiseId"]').select('FARM001');
    cy.get('select[name="destinationPremiseId"]').select('FARM002');
    cy.get('input[name="numItemsMoved"]').type('10');

    cy.get('button[type="submit"]').click();

    cy.wait('@createMovement');

    cy.url().should('include', '/movements');
  });

  it('should edit an existing movement successfully', () => {
    cy.intercept('GET', '/api/movements/1', {
      statusCode: 200,
      body: mockMovement,
    }).as('getMovementById');

    cy.intercept('PUT', '/api/movements/1', {
      statusCode: 200,
      body: mockMovement,
    }).as('updateMovement');

    cy.intercept('PUT', '/api/farms/*', { statusCode: 200 }).as('updateFarm');

    cy.visit('/movement/edit/1');

    cy.wait('@getMovementById');

    cy.get('input[name="numItemsMoved"]').clear().type('20');

    cy.get('button[type="submit"]').click();

    cy.wait('@updateMovement');

    cy.url().should('include', '/movements');
  });

  it('should cancel the form and return to the movements list', () => {
    cy.visit('/movement/create');

    cy.get('button').contains('Cancel').click();

    cy.url().should('include', '/movements');
  });

  it('should show an error message for insufficient animals', () => {
    cy.visit('/movement/create');

    cy.get('select[name="originPremiseId"]').select('FARM001');
    cy.get('select[name="destinationPremiseId"]').select('FARM002');
    cy.get('input[name="numItemsMoved"]').type('200');

    cy.get('button[type="submit"]').click();

    cy.contains('Origin farm does not have enough animals').should(
      'be.visible'
    );
  });
});
