// utils/caseConverter.js
// Postgres returns columns in snake_case (lt_number, av_support, ...).
// The frontend expects camelCase (ltNumber, avSupport, ...).
// These helpers convert query results at the API boundary so the
// response contract stays camelCase regardless of the underlying
// SQL column names, instead of relying on the frontend to know
// about database column naming.

function snakeToCamel(key) {
  return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function rowToCamelCase(row) {
  if (!row) return row;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    result[snakeToCamel(key)] = value;
  }
  return result;
}

function rowsToCamelCase(rows) {
  return (rows || []).map(rowToCamelCase);
}

module.exports = { rowToCamelCase, rowsToCamelCase };
