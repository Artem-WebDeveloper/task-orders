import type { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

function sendErrorDev(err: CustomError, res: Response) {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err: CustomError, res: Response) {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR!', err);

    res.status(500).json({
      status: 'error',
      message: 'Что-то пошло не так!',
    });
  }
}

function globalErrorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    const error: CustomError = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.isOperational = err.isOperational;

    sendErrorProd(error, res);
  }
}

export default globalErrorHandler;
