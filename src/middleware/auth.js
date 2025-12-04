import { verifyToken } from "../utils/auth.utils.js";

const performAuthorization = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (req.path.includes("/api")) {
        return res.status(401).json({
          message: "Token is missing in the authorization header",
        });
      } else {
        return res.status(403).render("404");
      }
    }
    
    const token = authHeader.split(" ")[1];
    if (!token) {
      if (req.path.includes("/api")) {
        return res.status(401).json({
          message: "Invalid token format",
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

    req.auth = data;
    next();
  } catch (error) {
    res.status(403).send({
      error: error.message,
    });
  }
};


export default performAuthorization;