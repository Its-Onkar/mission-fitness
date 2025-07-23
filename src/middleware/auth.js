import { verifyToken } from "../utils/auth.utils.js";

const performAuthorization = async (req, res, next) => {
  try {
    const authHeader = req.headers.auth;


    const token =  authHeader;
    console.log("Token:", token);
    if (!token) {
      if (req.path.includes("/api")) {
        return res.status(403).send({
          message: "Token is missing in the authorization header",
        });
      } else {
        return res.status(403).render("404");
      }
    }

    const data = verifyToken(token);

    if (!data) {
      if (req.path.includes("/api")) {
        res.status(403).send({
          message: "user not authorized",
        });

      } else {
        res.status(403).render("404");
      }
    }
    if (data.isVerified === false) {
      if (req.path.includes("/api")) {
        return res.status(403).send({
          message: "user is not  verified",
        });
      } else {

        return res.status(403).render("404", {
          message: 'user is not verified',
        });
      }
    }

    req.auth = data;
    next();
  } catch (error) {
    res.status(403).send({
      error: error.message,
    });
  }
};

export default performAuthorization;