import type { NextFunction, Request, Response } from "express";
import { Prisma } from '../../generated/prisma/client';
import { z } from "zod";

const errorHandler = (
  error: Error, 
  _req: Request, 
  res: Response, 
  _next: NextFunction
): void => {
  if (error instanceof z.ZodError) {
    res.status(400).json({
      success: false,
      errors: z.flattenError(error)
    });
    return; 
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log("Message:", error.message);
    console.log("Error Code:", error.code);
    console.log("Metadata:", error.meta); 
    
    switch (error.code) {
      case "P2002":
        res.status(409).json({ 
          success: false, 
          message: `Unique constraint failed on the fields: ${error.meta?.target}`
        });
        return;
      case "P1001":
        res.status(503).json({ 
          success: false, 
          message: `Unable to connect to the database.`
        });
        return;
    }
  }

  console.error('Unexpected Error:', error.message);
  res.status(500).json({
    success: false,
    message: error.message
  });
};

export default errorHandler;