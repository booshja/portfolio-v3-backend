require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "this-is-secret";
const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "portfolio_v3_test"
    : process.env.DATABASE_URL || "portfolio_v3";
}

const BCRYPT_WORK_FACTOR =
  process.env.NODE_ENV === "test" ? 1 : +process.env.BCRYPT_WORK_FACTOR;

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
