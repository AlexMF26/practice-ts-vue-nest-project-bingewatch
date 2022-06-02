describe('initial test', () => {
  it('should contain moto', () => {
    cy.visit('/');
    cy.contains('Vizionezi în maraton? Urmăreșteți progresul!').should('exist');
  });
});
