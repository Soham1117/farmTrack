describe('Farm List Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
  });

  it('should display the farms list', () => {
    cy.get('table').should('be.visible');

    cy.contains('671HMJV').should('be.visible');
    cy.contains('611ULSK').should('be.visible');
  });

  it('should filter farms by Premise ID', () => {
    cy.get('input[placeholder="Search by Premise ID"]').type('671HMJV');

    cy.get('table tbody tr').should('have.length', 1);
    cy.contains('671HMJV').should('be.visible');
    cy.contains('TESTTEST').should('not.exist');
  });

  it('should navigate to the farm creation page when "Add Farm" is clicked', () => {
    cy.contains('Add Farm').click();
    cy.url().should('include', '/farm/create');
  });

  it('should navigate to the farm edit page when "Edit" is clicked', () => {
    cy.get('input[placeholder="Search by Premise ID"]').type('671HMJV');
    cy.get('table tbody tr').first().find('button').contains('Edit').click();
    cy.url().should('include', '/farm/edit/671HMJV');
  });

  it('should delete a farm when "Delete" is clicked and confirmed', () => {
    cy.intercept('DELETE', '/api/farms/671HMJV', {
      statusCode: 200,
    }).as('deleteFarm');

    cy.intercept('GET', '/api/farms', {
      statusCode: 200,
      body: [{ premiseId: '611ULSK', totalAnimal: 200 }],
    }).as('getFarmsAfterDelete');

    cy.get('table tbody tr').first().find('button').contains('Delete').click();

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Cannot delete farm. It has associated movements.');
      return true;
    });
  });
});
