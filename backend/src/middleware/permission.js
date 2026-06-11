import { ErrorResponse } from "./errorHandler.js";

/**
 * Middleware to check admin permissions
 * @param {...string} requiredPermissions The permissions required to access the route
 */
export const authorizePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.admin) {
      return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    // Superadmin has full access and bypasses specific checks
    if (req.admin.role === "superadmin") {
      return next();
    }

    // Check if admin has at least one of the required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      req.admin.permissions.includes(permission)
    );

    if (!hasPermission) {
      return next(
        new ErrorResponse(
          `Access denied. Required permissions: [${requiredPermissions.join(", ")}]`,
          403
        )
      );
    }

    next();
  };
};

export default authorizePermissions;
