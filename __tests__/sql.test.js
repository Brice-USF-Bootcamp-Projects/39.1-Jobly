const { sqlForPartialUpdate } = require('../helpers/sql');
const { BadRequestError } = require('../expressError');

describe('sqlForPartialUpdate', () => {
  test('works: valid input with jsToSql mapping', () => {
    const dataToUpdate = { firstName: 'Aliya', age: 32 };
    const jsToSql = { firstName: 'first_name' };
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ['Aliya', 32],
    });
  });

  test('works: valid input without jsToSql mapping', () => {
    const dataToUpdate = { firstName: 'Aliya', age: 32 };
    const jsToSql = {}; // No mappings provided
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"firstName"=$1, "age"=$2',
      values: ['Aliya', 32],
    });
  });

  test('works: single field update', () => {
    const dataToUpdate = { age: 32 };
    const jsToSql = {};
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"age"=$1',
      values: [32],
    });
  });

  test('throws BadRequestError when no data provided', () => {
    const dataToUpdate = {}; // Empty data
    const jsToSql = {};

    expect(() => {
      sqlForPartialUpdate(dataToUpdate, jsToSql);
    }).toThrow(BadRequestError);
  });

  test('ignores extra jsToSql mappings not in dataToUpdate', () => {
    const dataToUpdate = { firstName: 'Aliya' };
    const jsToSql = { firstName: 'first_name', age: 'age_column' }; // Extra mapping
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1',
      values: ['Aliya'],
    });
  });
});
