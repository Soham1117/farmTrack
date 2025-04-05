describe('Farm Management System End-to-End Test', () => {
  const mockFarms = [
    { premiseId: 'FARM001', totalAnimal: 100 },
    { premiseId: 'FARM002', totalAnimal: 50 },
    { premiseId: '671HMJV', totalAnimal: 120 },
    { premiseId: '611ULSK', totalAnimal: 200 },
  ];

  const mockMovements = [
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

  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      role: 'ADMIN',
    },
    {
      id: 2,
      username: 'user',
      password: 'user123',
      role: 'USER',
    },
    {
      id: 3,
      username: 'viewer',
      password: 'viewer123',
      role: 'VIEWER',
    },
  ];

  beforeEach(() => {
    cy.intercept('GET', '/api/farms', mockFarms).as('getFarms');
    cy.intercept('GET', '**/api/movements', mockMovements).as('getMovements');
    cy.intercept('GET', '**/api/users', mockUsers).as('getUsers');

    cy.intercept('POST', '**/api/auth/login', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE1MTYyMzkwMjJ9.eoGgMc8yQMwUVGJqJyOyVFz_5S9B91gKJaYk1zfMJcA',
        },
      });
    }).as('loginRequest');

    cy.intercept('PUT', '/api/farms/*', { statusCode: 200 }).as('updateFarm');
    cy.intercept('POST', '/api/users', {
      statusCode: 201,
      body: { username: 'newuser', password: 'password123', role: 'VIEWER' },
    }).as('createUser');

    cy.visit('/login');
  });

  it('should test the complete application workflow', () => {
    cy.get('form').should('exist');
    cy.get('input[name="username"]').should('be.visible').type('admin');
    cy.get('input[name="password"]').should('be.visible').type('admin123');
    cy.get('button[type="submit"]').should('be.visible').click();
    cy.wait('@loginRequest');
    cy.url().should('include', '/farms');

    cy.get('table').should('be.visible');
    cy.contains('671HMJV').should('be.visible');
    cy.contains('611ULSK').should('be.visible');

    cy.get('input[placeholder="Search by Premise ID"]').type('671HMJV');
    cy.get('table').eq(1).find('tbody tr').should('have.length', 1);
    cy.contains('671HMJV').should('be.visible');
    cy.get('input[placeholder="Search by Premise ID"]').clear();

    cy.contains('Add Farm').click();
    cy.url().should('include', '/farm/create');
    cy.get('h2').should('contain', 'Add Farm');

    cy.get('#premiseId').should('be.visible').type('NEWFARM001');
    cy.get('#total_animal').type('150');

    const updatedMockFarms = [
      ...mockFarms,
      { premiseId: 'NEWFARM001', totalAnimal: 150 },
    ];

    cy.intercept('POST', '/api/farms', {
      statusCode: 201,
      body: { premiseId: 'NEWFARM001', totalAnimal: 150 },
    }).as('createFarm');

    cy.intercept('GET', '/api/farms', updatedMockFarms).as('getUpdatedFarms');

    cy.get('button[type="submit"]').click();
    cy.wait('@createFarm');

    cy.url().should('include', '/farms');
    cy.wait('@getUpdatedFarms');

    cy.contains('NEWFARM001').should('be.visible');

    cy.intercept('GET', '/api/farms/671HMJV', {
      statusCode: 200,
      body: { premiseId: '671HMJV', totalAnimal: 120 },
    }).as('getFarmById');

    cy.intercept('PUT', '/api/farms/671HMJV', {
      statusCode: 200,
      body: { premiseId: '671HMJV', totalAnimal: 200 },
    }).as('updateFarm');

    cy.get('input[placeholder="Search by Premise ID"]').type('671HMJV');
    cy.get('table')
      .eq(1)
      .find('tbody tr')
      .first()
      .find('button')
      .contains('Edit')
      .click();
    cy.url().should('include', '/farm/edit/671HMJV');
    cy.wait('@getFarmById');

    cy.get('input[name="premiseId"]').should('have.value', '671HMJV');
    cy.get('#total_animal').clear().type('200');

    const editedMockFarms = mockFarms.map((farm) => {
      if (farm.premiseId === '671HMJV') {
        return { ...farm, totalAnimal: 200 };
      }
      return farm;
    });
    cy.intercept('GET', '/api/farms', editedMockFarms).as('getEditedFarms');

    cy.get('button[type="submit"]').click();
    cy.wait('@updateFarm');

    cy.url().should('include', '/farms');
    cy.wait('@getEditedFarms');

    cy.visit('/movements');
    cy.wait('@getMovements');

    cy.get('table').eq(1).find('tbody tr').should('have.length', 2);
    cy.contains('FARM001').should('exist');
    cy.contains('FARM002').should('exist');

    cy.get('input[name="movement-search"]').type('FARM001');
    cy.get('table').eq(1).find('tbody tr').should('have.length', 1);
    cy.contains('FARM001').should('exist');
    cy.contains('FARM003').should('not.exist');
    cy.get('input[name="movement-search"]').clear();

    cy.get('button').contains('Add Movement').click();
    cy.url().should('include', '/movement/create');

    cy.get('select[name="originPremiseId"]').select('FARM001');
    cy.get('select[name="destinationPremiseId"]').select('FARM002');
    cy.get('input[name="numItemsMoved"]').type('10');

    const newMovement = {
      movementId: 3,
      originFarm: { premiseId: 'FARM001', totalAnimal: 90 },
      destinationFarm: { premiseId: 'FARM002', totalAnimal: 60 },
      numItemsMoved: 10,
    };
    const updatedMockMovements = [
      ...mockMovements,
      {
        movementId: 3,
        originFarm: { premiseId: 'FARM001', totalAnimal: 90 },
        destinationFarm: { premiseId: 'FARM002', totalAnimal: 60 },
        numItemsMoved: 10,
      },
    ];

    cy.intercept('POST', '/api/movements', {
      statusCode: 201,
      body: newMovement,
    }).as('createMovement');
    cy.intercept('GET', '/api/movements', updatedMockMovements).as(
      'getUpdatedMovements'
    );

    cy.get('button[type="submit"]').click();
    cy.wait('@createMovement');
    cy.url().should('include', '/movements');
    cy.wait('@getUpdatedMovements');

    cy.intercept('GET', '/api/movements/1', {
      statusCode: 200,
      body: mockMovements[0],
    }).as('getMovementById');

    cy.intercept('PUT', '/api/movements/1', {
      statusCode: 200,
      body: {
        ...mockMovements[0],
        numItemsMoved: 15,
      },
    }).as('updateMovement');

    cy.get('tbody tr:first-child button').contains('Edit').click();
    cy.url().should('include', '/movement/edit/1');
    cy.wait('@getMovementById');

    cy.get('input[name="numItemsMoved"]').clear().type('15');

    const editedMockMovements = updatedMockMovements.map((movement) => {
      if (movement.movementId === 1) {
        return { ...movement, numItemsMoved: 15 };
      }
      return movement;
    });
    cy.intercept('GET', '/api/movements', editedMockMovements).as(
      'getEditedMovements'
    );

    cy.get('button[type="submit"]').click();
    cy.wait('@updateMovement');
    cy.url().should('include', '/movements');
    cy.wait('@getEditedMovements');

    cy.visit('/users');
    cy.wait('@getUsers');

    cy.get('tbody tr').should('have.length', 3);
    cy.contains('admin').should('exist');
    cy.contains('user').should('exist');
    cy.contains('viewer').should('exist');

    cy.contains('Add User').click();
    cy.url().should('include', '/user/create');

    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('select[name="role"]').select('VIEWER');

    const updatedUsers = [
      ...mockUsers,
      {
        id: 4,
        username: 'newuser',
        password: 'password123',
        role: 'VIEWER',
      },
    ];
    cy.intercept('GET', '/api/users', updatedUsers).as('getUpdatedUsers');

    cy.get('button[type="submit"]').click();
    cy.wait('@createUser');
    cy.url().should('include', '/users');
    cy.wait('@getUpdatedUsers');

    cy.visit('/farms');
  });
});
