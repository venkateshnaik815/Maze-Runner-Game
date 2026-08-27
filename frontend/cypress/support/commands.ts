// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login programmatically bypassing UI
     * @param usernameOrEmail user identifier
     * @param password user password
     */
    loginByApi(usernameOrEmail?: string, password?: string): Chainable<void>;
  }
}

Cypress.Commands.add('loginByApi', (usernameOrEmail = 'testplayer', password = 'TestPassword123!') => {
  cy.request('POST', 'http://localhost:8080/api/v1/auth/login', {
    usernameOrEmail,
    password,
  }).then((response) => {
    expect(response.status).to.eq(200);
    window.localStorage.setItem('maze_access_token', response.body.access_token);
    window.localStorage.setItem('maze_refresh_token', response.body.refresh_token);
    // In actual implementation we might also need to set the user state in zustand localstorage
  });
});
