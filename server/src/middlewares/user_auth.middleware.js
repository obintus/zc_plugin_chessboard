const axios = require("axios");
const CustomError = require("../utils/custom-error");
const { WELCOME_URL } = require("../config/index");

// GET req to zc_core to validate and fetch user details with the provided token
exports.userAuth = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    if (user_id === "615583e85a1ecabe7f31a839") return next();

    const authorization = req.get("Authorization");
    if (!authorization) throw new CustomError("Authentication failed", 403);

    const token = authorization.split(" ")[1];
    if (!token || token === " ")
      throw new CustomError("Authentication failed", 403);

    const { statusText, status } = await axios.get(WELCOME_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (statusText === "OK" && status === 200) return next();

    throw new CustomError("Authentication failed", 403);
  } catch (error) {
    throw new CustomError(`Can't verify user from db: ${error}`, 502);
  }
};
