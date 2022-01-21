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
function sqlForPartialUpdate(dataToUpdate, jsToSql = []) {
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
function sqlForPartialInsert(dataToUpdate, jsToSql = []) {
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

/**
 * Helper function for making multiple row update
 * @function sqlForBulkPositionUpdate
 * @param {Array} positions - Array of project objects [ { id, position }, ... ]
 * @param {Object} positions[n] = Project object { id, position }
 *
 * @returns {Array} - Array of updated project objects, sorted by position, ascending
 *
 * @throws {BadRequestError} Throws error if invalid param type
 * @throws {BadRequestError} Throws error if empty param array
 */
function sqlForBulkPositionUpdate(positions = []) {
  if (!(positions instanceof Array))
    throw new BadRequestError("Invalid input type.");
  if (positions.length === 0) throw new BadRequestError("No data.");

  let query =
    "UPDATE projects AS p SET position = v.position::integer from (VALUES";
  const paramVals = [];

  // loop through to create values
  for (let i = 1; i <= positions.length; i++) {
    paramVals.push(+positions[i - 1].id);
    paramVals.push(+positions[i - 1].position);
  }

  const values = [];
  let j = 1;

  for (let i = 0; i < positions.length; i++) {
    values.push(`($${j}, $${j + 1})`);
    j = j + 2;
  }

  return {
    query:
      query +
      values.join(", ") +
      ") AS v(id, position) WHERE v.id::integer = p.id",
    paramVals,
  };
}

module.exports = {
  sqlForPartialUpdate,
  sqlForPartialInsert,
  sqlForBulkPositionUpdate,
};
