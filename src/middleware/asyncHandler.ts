<<<<<<< HEAD
// src/middleware/asyncHandler.ts

=======
>>>>>>> b13ebdf (add crud menu)
import { Request, Response, NextFunction } from 'express';

// Define a type for the async controller function
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wrapper function for Express async route handlers to automatically catch errors
 * and pass them to the Express error middleware (next(err)).
 * @param fn The async controller function.
 */
const asyncHandler = (fn: AsyncController) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export default asyncHandler;