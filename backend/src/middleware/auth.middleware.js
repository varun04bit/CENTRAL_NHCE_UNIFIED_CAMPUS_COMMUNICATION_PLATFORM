const { verifyToken } = require("../utils/jwt");

/**
 * JWT Authentication + Role Authorization Middleware
 *
 * Usage examples:
 *   auth()                         → any authenticated user
 *   auth("ADMIN")                  → admin only
 *   auth("FACULTY")                → faculty only
 *   auth("STUDENT")                → student only
 *   auth(["ADMIN", "FACULTY"])     → multiple roles allowed
 */
function authMiddleware(requiredRoles = null) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1️⃣ Token missing
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    // 2️⃣ Validate Bearer format
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    try {
      // 3️⃣ Verify JWT
      const decoded = verifyToken(token);

      // 4️⃣ Role authorization (if required)
      if (requiredRoles) {
        const allowedRoles = Array.isArray(requiredRoles)
          ? requiredRoles
          : [requiredRoles];

        if (!allowedRoles.includes(decoded.role)) {
          return res.status(403).json({
            message: "Forbidden: insufficient permissions",
          });
        }
      }

      // 5️⃣ Attach user to request
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
}

module.exports = authMiddleware;
