describe('initial test', () => {
  it('should contain moto', () => {
    cy.visit('/');
    cy.contains('You Bingewatch? Track your progress!').should('exist');
  });
});
