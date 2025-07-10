"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const customErrors_1 = require("../errors/customErrors");
const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error for debugging
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.errors,
        });
    }
    if (err instanceof customErrors_1.HttpError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    // Generic error for unexpected issues
    return res.status(500).json({ message: "Something went wrong!" });
};
exports.errorHandler = errorHandler;
