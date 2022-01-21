const {
  sqlForPartialUpdate,
  sqlForPartialInsert,
  sqlForBulkPositionUpdate,
} = require("../sql");
const { BadRequestError } = require("../../expressError");

describe("sqlForPartialUpdate", () => {
  it("works: 1 item", () => {
    const result = sqlForPartialUpdate({ f1: "v1" }, { f1: "f_1" });
    expect(result).toEqual({
      setCols: '"f_1"=$1',
      values: ["v1"],
    });
  });

  it("works: 2 items", () => {
    const result = sqlForPartialUpdate(
      { f1: "v1", jsF2: "v2" },
      { jsF2: "f2" }
    );
    expect(result).toEqual({
      setCols: '"f1"=$1, "f2"=$2',
      values: ["v1", "v2"],
    });
  });

  it("throws BadRequestError for no data", () => {
    try {
      sqlForPartialUpdate({}, []);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("sqlForPartialInsert", () => {
  it("works: 1 item", () => {
    const result = sqlForPartialInsert({ f1: "v1" }, { f1: "f_1" });
    expect(result).toEqual({
      sqlInsertCols: "f_1",
      sqlInsertVals: "$1",
      values: ["v1"],
    });
  });

  it("works: 2 items", () => {
    const result = sqlForPartialInsert(
      { f1: "v1", f2: "v2" },
      { f1: "f_1", f2: "f_2" }
    );
    expect(result).toEqual({
      sqlInsertCols: "f_1, f_2",
      sqlInsertVals: "$1, $2",
      values: ["v1", "v2"],
    });
  });

  it("throws BadRequestError for no data", () => {
    try {
      sqlForPartialInsert({}, []);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("sqlForBulkPositionUpdate", () => {
  it("works", () => {
    const result = sqlForBulkPositionUpdate([
      { id: 1, position: 99 },
      { id: 2, position: 98 },
      { id: 3, position: 97 },
    ]);
    expect(result).toEqual({
      query:
        "UPDATE projects AS p SET position = v.position::integer from (VALUES($1, $2), ($3, $4), ($5, $6)) AS v(id, position) WHERE v.id::integer = p.id",
      paramVals: [1, 99, 2, 98, 3, 97],
    });
  });

  it("throws bad request for no data", () => {
    try {
      sqlForBulkPositionUpdate();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws bad request for invalid input type", () => {
    try {
      sqlForBulkPositionUpdate("helllloooooo!");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
