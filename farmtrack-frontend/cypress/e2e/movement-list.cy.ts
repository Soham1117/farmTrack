describe('Movement List Component', () => {
  let mockMovements = [
    {
      movementId: 1,
      originFarm: { premiseId: 'FARM001', totalAnimal: 100 },
      destinationFarm: { premiseId: 'FARM002', totalAnimal: 50 },
      numItemsMoved: 10,
    },
    {
      movementId: 2,
      originFarm: { premiseId: 'FARM003', totalAnimal: 200 },
      destinationFarm: { premiseId: 'FARM004', totalAnimal: 75 },
      numItemsMoved: 20,
    },
  ];

  beforeEach(() => {
    cy.intercept('GET', '**/api/movements', (req) => {
      req.reply(mockMovements);
    }).as('getMovements');

    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/farms');

    cy.visit('/movements');
    cy.wait('@getMovements');
  });

  it('should display movement list with correct data', () => {
    cy.get('tbody tr').should('have.length', 2);
    cy.contains('FARM001').should('exist');
    cy.contains('FARM002').should('exist');
    cy.contains('10').should('exist');
  });

  it('should filter movements by search term', () => {
    cy.get('input[placeholder="Search by Origin or Destination"]').type(
      'FARM001'
    );
    cy.get('tbody tr').should('have.length', 1);
    cy.contains('FARM001').should('exist');
    cy.contains('FARM003').should('not.exist');
  });

  it('should navigate to create movement page', () => {
    cy.get('button').contains('Add Movement').click();
    cy.url().should('include', '/movement/create');
  });

  it('should navigate to edit movement page', () => {
    cy.get('tbody tr:first-child button').contains('Edit').click();
    cy.url().should('include', '/movement/edit/1');
  });

  it('should delete movement when confirmed', () => {
    cy.intercept('DELETE', '/api/movements/1', { statusCode: 204 }).as(
      'deleteMovement'
    );

    cy.intercept('PUT', '/api/farms/*', { statusCode: 200 }).as('updateFarm');

    cy.get('tbody tr:first-child button').contains('Delete').click();

    cy.on('window:confirm', () => true);

    cy.wait('@deleteMovement');

    mockMovements = mockMovements.filter(
      (movement) => movement.movementId !== 1
    );

    cy.intercept('GET', '**/api/movements', mockMovements).as(
      'getUpdatedMovements'
    );

    cy.reload();
    cy.wait('@getUpdatedMovements');

    cy.get('tbody tr').should('have.length', 1);
  });

  it('should hide action buttons for non-admin/user roles', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('user');
    cy.get('input[name="password"]').type('user123');
    cy.get('button[type="submit"]').click();

    cy.reload();

    cy.get('button').contains('Add Movement').should('not.exist');
    cy.get('button').contains('Edit').should('not.exist');
    cy.get('button').contains('Delete').should('not.exist');
  });
});
