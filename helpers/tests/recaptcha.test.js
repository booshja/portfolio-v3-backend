const { validateHuman } = require("../recaptcha");

beforeAll(() => {
  process.env.NODE_ENV = "test";
});

describe("recaptcha", () => {
  it("returns true in testing", async () => {
    const result = await validateHuman("token");
    expect(result).toBe(true);
  });
});
