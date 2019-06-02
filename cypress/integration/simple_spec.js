describe('Simple UI tests for organism', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    it('Renders the application correctly in landscape mode', () => {
        cy.get('.header')
            .should('be.visible');

        cy.get('.input')
            .should('be.visible');

        cy.get('.output')
            .should('be.visible');

        cy.get('.footer')
            .should('be.visible');
    });

    it('Renders the application correctly in portrait mode', () => {
        cy.viewport(420, 480);

        cy.get('.header')
            .should('be.visible');

        cy.get('.input')
            .should('be.visible');

        cy.get('.output')
            .should('be.visible');

        cy.get('.footer')
            .should('be.visible');
    });

    it('Changing the input text changes the text on the right while in org mode', () => {
        cy.get('.input')
            .type('{selectall}{backspace}')
            .type('#+TITLE: This is the title of the document');

        cy.get('.output')
            .invoke('html')
            .should('include', '<h1>This is the title of the document</h1>');
    });
});
