/**
 * 404 Not Found Middleware
 * Handles requests to undefined routes
 */

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = notFound;
