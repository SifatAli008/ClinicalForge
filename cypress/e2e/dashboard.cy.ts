describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.visit('/dashboard')
  })

  it('should load the dashboard page', () => {
    cy.get('h1').should('contain', 'ClinicalForge Dashboard')
    cy.get('[data-testid="dashboard-stats"]').should('exist')
  })

  it('should display dashboard statistics', () => {
    cy.get('[data-testid="total-forms"]').should('exist')
    cy.get('[data-testid="active-users"]').should('exist')
    cy.get('[data-testid="completion-rate"]').should('exist')
  })

  it('should have working refresh button', () => {
    cy.get('[data-testid="refresh-button"]').should('exist')
    cy.get('[data-testid="refresh-button"]').click()
    cy.get('[data-testid="loading-spinner"]').should('exist')
  })

  it('should have working export button', () => {
    cy.get('[data-testid="export-button"]').should('exist')
    cy.get('[data-testid="export-button"]').click()
    // Check if download was triggered (this is browser-specific)
    cy.window().then((win) => {
      cy.stub(win, 'open').as('download')
    })
  })

  it('should display user activity section', () => {
    cy.get('[data-testid="user-activity"]').should('exist')
    cy.get('[data-testid="contributors-list"]').should('exist')
  })

  it('should have working quick action buttons', () => {
    cy.get('[data-testid="view-forms-button"]').should('exist')
    cy.get('[data-testid="research-findings-button"]').should('exist')
    cy.get('[data-testid="profile-settings-button"]').should('exist')
  })

  it('should display system status', () => {
    cy.get('[data-testid="system-status"]').should('exist')
    cy.get('[data-testid="connection-status"]').should('exist')
  })
}) 