const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

/**
 * Generates a SQL query snippet for a partial update.
 *
 * @param {Object} dataToUpdate - Key-value pairs of fields to update.
 * @param {Object} jsToSql - Mapping of JavaScript-style field names to SQL-style column names.
 *
 * @returns {Object} An object containing:
 *   - `setCols`: A string of SQL column assignments for the `SET` clause.
 *   - `values`: An array of values corresponding to the placeholders in `setCols`.
 *
 * @throws {BadRequestError} If `dataToUpdate` is empty.
 *
 * @example
 * Input:
 *   dataToUpdate = { firstName: 'Aliya', age: 32 };
 *   jsToSql = { firstName: 'first_name' };
 *
 * Output:
 *   {
 *     setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32]
 *   }
 */


function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // Convert keys to SQL column assignments with placeholders
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),  // Combine assignments into a single string
    values: Object.values(dataToUpdate),  // Extract values for prepared statements
  };
}

module.exports = { sqlForPartialUpdate };
