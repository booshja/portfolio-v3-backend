const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("./expressError");

/***************************** BadRequestError */
describe("BadRequestError", () => {
  it("throws a 400 error with default message", () => {
    try {
      throw new BadRequestError();
    } catch (err) {
      expect(err.status).toEqual(400);
      expect(err.message).toEqual("Bad Request");
    }
  });

  it("throws a 400 error with message from param", () => {
    try {
      throw new BadRequestError("This is bad!");
    } catch (err) {
      expect(err.status).toEqual(400);
      expect(err.message).toEqual("This is bad!");
    }
  });
});

/*************************** UnauthorizedError */
describe("UnauthorizedError", () => {
  it("throws a 401 error with default message", () => {
    try {
      throw new UnauthorizedError();
    } catch (err) {
      expect(err.status).toEqual(401);
      expect(err.message).toEqual("Unauthorized");
    }
  });

  it("throws a 401 error with message from param", () => {
    try {
      throw new UnauthorizedError("You're not authorized!");
    } catch (err) {
      expect(err.status).toEqual(401);
      expect(err.message).toEqual("You're not authorized!");
    }
  });
});

/****************************** ForbiddenError */
describe("ForbiddenError", () => {
  it("throws a 403 error with default message", () => {
    try {
      throw new ForbiddenError();
    } catch (err) {
      expect(err.status).toEqual(403);
      expect(err.message).toEqual("Forbidden");
    }
  });

  it("throws a 403 error with message from param", () => {
    try {
      throw new ForbiddenError("THIS IS FORBIDDEN");
    } catch (err) {
      expect(err.status).toEqual(403);
      expect(err.message).toEqual("THIS IS FORBIDDEN");
    }
  });
});

/******************************* NotFoundError */
describe("NotFoundError", () => {
  it("throws a 404 error with default message", () => {
    try {
      throw new NotFoundError();
    } catch (err) {
      expect(err.status).toEqual(404);
      expect(err.message).toEqual("Not Found");
    }
  });

  it("throws a 404 error with message from param", () => {
    try {
      throw new NotFoundError("Can't find that, sorry!");
    } catch (err) {
      expect(err.status).toEqual(404);
      expect(err.message).toEqual("Can't find that, sorry!");
    }
  });
});
