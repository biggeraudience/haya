const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  if (!role) {
    throw new Error("Role is required for token generation");
  }
  // Each token will now include an iat timestamp automatically.
  const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

module.exports = generateToken;
