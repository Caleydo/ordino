/**
 * Count columns in the ranking and wait until the new column has been added
 * Auxilary function for checkScoreColLoaded. Count columns in the ranking and wait until the new column has been added
 * @param {number} rankingId - ID of the ranking to search in, e.g. 0 for the initial ranking, 1 for the first detail view etc.
 * @param {string[]} totalNumColumns - total number of columns that are expected after adding them
 */
export declare function checkColCountOrdino(rankingId: number, totalNumColumns: number): void;
/**
 * Check if a score column has finished loading
 * Finds score column by searching for input strings in title, label and sublabel of the columns
 * @param {number} rankingId - ID of the ranking to search in, e.g. 0 for the initial ranking, 1 for the first detail view etc.
 * @param {string[]} searchStrings - Array of strings containing the user input of the modal (if this does not work inspect the header element of the column and extract information from the title attribute)
 * @param {string[]} totalNumColumns - total number of columns that are expected after adding them
 */
export declare function checkScoreColLoadedOrdino(rankingId: number, searchStrings: string[], totalNumColumns: number): void;
/**
 * Wait for the lineup table rows to be visible
 * @param {number} rankingId - ID of the ranking to search in, e.g. 0 for the initial ranking, 1 for the first detail view etc.
 */
export declare function waitLineupReadyOrdino(rankingId: number): void;
//# sourceMappingURL=utils.d.ts.map