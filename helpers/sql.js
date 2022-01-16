const { BadRequestError } = require("../expressError");

/**
 * Helper function for making selective update queries.
 * @function sqlForPartialUpdate
 * @param {Object} dataToUpdate - { field1: newVal, field2: newVal, ...}
 * @param {Object} jsToSql - js style data fields { thisCase: "this_case", ... }
 *
 * @returns {Object} An object with the new columns and data to update { setCols, values }
 *
 * @throws {BadRequestError} Throws error if no dataToUpdate
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data.");

  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/**
 * Helper function for making selective insert queries.
 * @function sqlForPartialInsert
 * @param {Object} dataToUpdate - { field1: val1, field2: val2, ...}
 * @param {Object} jsToSql - js style data fields { thisCase: "this_case", ... }
 *
 * @returns {Object} An object with the new columns, values, and array of data to update { sqlInsertCols, sqlInsertVals, values }
 *
 * @throws {BadRequestError} Throws error if no dataToUpdate
 */
function sqlForPartialInsert(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName) => `${jsToSql[colName] || colName}`);
  let vals = [];

  for (let i = 1; i <= keys.length; i++) {
    vals.push(`$${i}`);
  }

  return {
    sqlInsertCols: cols.join(", "),
    sqlInsertVals: vals.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate, sqlForPartialInsert };
