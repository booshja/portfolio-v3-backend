const { sqlForPartialUpdate, sqlForPartialInsert } = require("../sql");
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
