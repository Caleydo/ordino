import * as cypress from 'local-cypress';

/**
 * Count columns in the ranking and wait until the new column has been added
 * Auxilary function for checkScoreColLoaded. Count columns in the ranking and wait until the new column has been added
 * @param {number} rankingId - ID of the ranking to search in, e.g. 0 for the initial ranking, 1 for the first detail view etc.
 * @param {string[]} totalNumColumns - total number of columns that are expected after adding them
 */
export function checkColCountOrdino(rankingId: number, totalNumColumns: number) {
  const colsSelector = `[data-testid=viewWrapper-${rankingId}] > .view > .inner > .tdp-view.lineup > div > main > header > article > section`;
  cypress.cy.get(colsSelector).should('have.length', totalNumColumns);
}

/**
 * Check if a score column has finished loading
 * Finds score column by searching for input strings in title, label and sublabel of the columns
 * @param {number} rankingId - ID of the ranking to search in, e.g. 0 for the initial ranking, 1 for the first detail view etc.
 * @param {string[]} searchStrings - Array of strings containing the user input of the modal (if this does not work inspect the header element of the column and extract information from the title attribute)
 * @param {string[]} totalNumColumns - total number of columns that are expected after adding them
 */
export function checkScoreColLoadedOrdino(rankingId: number, searchStrings: string[], totalNumColumns: number) {
  const searchStringsLower = searchStrings.map((string) => string.toLowerCase());
  checkColCountOrdino(rankingId, totalNumColumns);
  cypress.cy
    .get(`[data-testid=viewWrapper-${rankingId}] .tdp-view.lineup > div > main > header > article`)
    .children()
    .filter((i, elem) => {
      const label = elem.getElementsByClassName('lu-label')[0];
      const sublabel = elem.getElementsByClassName('lu-sublabel')[0];
      return searchStringsLower.every(
        (s) => elem.title.toLowerCase().includes(s) || label.innerHTML.toLowerCase().includes(s) || sublabel.innerHTML.toLowerCase().includes(s),
      );
    })
    // extract data-col-id and save it to variable column_id
    .invoke('attr', 'data-col-id')
    .as('column_id');

  // use variable column_id and check if first row contains "Loading"
  cypress.cy.get('@column_id').then((id) => {
    return cypress.cy
      .get(`[data-testid=viewWrapper-${rankingId}] .tdp-view.lineup > div > main > .le-body > [data-ranking="rank${0}"] > div:nth-child(1) > [data-id="${id}"]`)
      .should('not.contain', 'Loading');
  });
}

/**
 * Wait for the lineup table rows to be visible
 * @param {number} rankingId - ID of the ranking to search in, e.g. 0 for the initial ranking, 1 for the first detail view etc.
 */
export function waitLineupReadyOrdino(rankingId: number) {
  cypress.cy.get(`[data-testid=viewWrapper-${rankingId}] .le-tr`).should('be.visible');
}
