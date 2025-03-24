context ('Navigation', () => {

    it ('should navigate to the blog board', () => {
        cy.visit('http://localhost:9999/')
        cy.go('back')
        cy.go('forward')
        cy.reload()
        cy.url().then(url => cy.log("URL: " + url));
        cy.title().then(title => cy.log("Title: " + title));
    })

})