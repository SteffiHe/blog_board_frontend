context ('Create, edit and delete Article', () => {

    const frontend_url = 'http://localhost:9999/'

    const article = {
        category: 'Other',
        author: 'Lucy',
        title: 'E2E Test Article Title',
        content: 'E2E Test Article Content',
        category_new: 'SQL',
        title_new: 'New E2E Test Article Title',
    }

    it ('Create a new article', () => {
        cy.visit(frontend_url)
        cy.get('#buttonToggleModal').click()
        cy.get('#modalSelectCategory').select(article.category)
        cy.get('#modalSelectAuthor').select(article.author)
        cy.get('#modalInputTitle').type(article.title)
        cy.get('#modalInputContent').type(article.content)

        /// Select tags
        // Click the dropdown button to open it
        cy.get('#modalDropdownTriggerTag').click();
        cy.get('#modalDropdownTriggerTag').should('be.visible');

        cy.get('#modalDropdownMenuTag').should('exist');
        cy.get('#modalDropdownMenuTag').within(() => {
            cy.get('input:first').check().should('be.checked');
            cy.get('input:last').check().should('be.checked');
            cy.get('input:first').uncheck().should('not.be.checked');
        });
        // Close the dropdown menu of tags
        cy.get('#modalDropdownTriggerTag').click();
        cy.get('#modalDropdownMenuTag').should('not.be.checked');


        /// Select rates
        cy.get('#modalDropdownTriggerRate').click();
        cy.get('#modalDropdownTriggerRate').should('be.visible');
        cy.get('#modalDropdownMenuRate').within(() => {
            cy.get('input:first').check().should('be.checked');
        });
        cy.get('#modalDropdownTriggerRate').click();
        cy.get('#modalDropdownMenuRate').should('not.be.checked');


        /// Select recommendation
        cy.get('#modalDropdownTriggerRecommendation').click();
        cy.get('#modalDropdownTriggerRecommendation').should('be.visible');

        cy.get('#modalDropdownMenuRecommendation').within(() => {
            cy.get('input:last').check().should('be.checked');
        });
        cy.get('#modalDropdownTriggerRecommendation').click();
        cy.get('#modalDropdownMenuRecommendation').should('not.be.checked');


        // Submit
        cy.get('#modalButtonSubmit').click()

        // confirm the new created article exists
        cy.get(`#column-${article.category}`).should('exist').within(() => {
            cy.get(`[data-testid="article-${article.title}"]`).should('exist').within(() => {
                cy.get('[data-testid="article-title"]').should('contain', article.title);
                cy.get('[data-testid="article-content"]').should('contain', article.content);

            });
        })

        cy.wait(2000)

    })

    it ('Edit article', () => {
        cy.visit(frontend_url)
        cy.get(`#column-${article.category}`).find(`[data-testid="article-${article.title}"]`).find(".dropdown").find("#dropdownMenuButton").click();
        cy.get(`#column-${article.category}`).find(`[data-testid="article-${article.title}"]`).find(".dropdown").find("#dropdownItemEdit").click();

        cy.get('.modal-dialog').should('exist');
        cy.get('#modalSelectCategory').select(article.category_new)
        cy.get('#modalInputTitle').clear().type(article.title_new)


        cy.get('#modalButtonSubmit').click()

        // confirm the article has been moved to the new category and title has been updated
        cy.get(`#column-${article.category_new}`).should('exist').within(() => {
            cy.get(`[data-testid="article-${article.title_new}"]`).should('exist').within(() => {
                cy.get('[data-testid="article-title"]').should('contain', article.title);
            });
        })


        //move back to original category
        cy.get(`#column-${article.category_new}`).find(`[data-testid="article-${article.title_new}"]`).find(".dropdown").find("#dropdownMenuButton").click();
        cy.get(`#column-${article.category_new}`).find(`[data-testid="article-${article.title_new}"]`).find(".dropdown").find("#dropdownItemEdit").click();

        cy.get('.modal-dialog').should('exist');
        cy.get('#modalSelectCategory').select(article.category)
        cy.get('#modalInputTitle').clear().type(article.title)
        cy.get('#modalButtonSubmit').click()

        cy.wait(2000)
    })


    it ('Delete article', () => {
        cy.visit(frontend_url)
        cy.get(`#column-${article.category}`).find(`[data-testid="article-${article.title}"]`).find(".dropdown").find("#dropdownMenuButton").click()
        cy.get(`#column-${article.category}`).find(`[data-testid="article-${article.title}"]`).find(".dropdown").find("#dropdownItemDelete").click()
        cy.get(`#column-${article.category}`).find(`[data-testid="article-${article.title}"]`).should('not.exist')
    })
})