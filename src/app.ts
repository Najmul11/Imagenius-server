import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import config from './config';
import cookieParser from 'cookie-parser';

import globalErrorhandler from './app/middlewares/globalErrorHandler';
import { routes } from './app/routes';
import Cloudinary from './cloudinary/cloudinary.config';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cloudinarys
Cloudinary();

app.use('/api/v1', routes);

app.get('/', (req: Request, res: Response) => {
  res.send(`Imagenius server running on PORT ${config.port}`);
});

// middleware
app.use(globalErrorhandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
