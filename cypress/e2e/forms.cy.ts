describe('Forms Page', () => {
  beforeEach(() => {
    cy.visit('/forms')
  })

  it('should load the forms page', () => {
    cy.get('h1').should('contain', 'Clinical Forms')
    cy.get('[data-testid="forms-grid"]').should('exist')
  })

  it('should display all form types', () => {
    cy.get('[data-testid="comprehensive-validation"]').should('exist')
    cy.get('[data-testid="advanced-analytics"]').should('exist')
    cy.get('[data-testid="data-field-validation"]').should('exist')
    cy.get('[data-testid="parameter-validation"]').should('exist')
  })

  it('should navigate to comprehensive validation form', () => {
    cy.get('[data-testid="comprehensive-validation"]').click()
    cy.url().should('include', '/forms/comprehensive-parameter-validation')
    cy.get('h1').should('contain', 'Comprehensive Parameter Validation')
  })

  it('should navigate to advanced analytics form', () => {
    cy.get('[data-testid="advanced-analytics"]').click()
    cy.url().should('include', '/forms/advanced-clinical-analytics')
    cy.get('h1').should('contain', 'Advanced Clinical Analytics')
  })

  it('should navigate to data field validation form', () => {
    cy.get('[data-testid="data-field-validation"]').click()
    cy.url().should('include', '/forms/data-field-validation')
    cy.get('h1').should('contain', 'Data Field Validation')
  })

  it('should navigate to parameter validation form', () => {
    cy.get('[data-testid="parameter-validation"]').click()
    cy.url().should('include', '/forms/parameter-validation')
    cy.get('h1').should('contain', 'Parameter Validation')
  })

  it('should have working form cards with proper styling', () => {
    cy.get('[data-testid="form-card"]').should('have.length.at.least', 4)
    cy.get('[data-testid="form-card"]').first().should('have.class', 'hover:shadow-lg')
  })

  it('should display form descriptions', () => {
    cy.get('[data-testid="form-description"]').should('exist')
    cy.get('[data-testid="form-description"]').should('contain', 'validation')
  })

  it('should have proper navigation breadcrumbs', () => {
    cy.get('[data-testid="breadcrumb"]').should('exist')
    cy.get('[data-testid="breadcrumb"]').should('contain', 'Forms')
  })
}) 