import { NextFunction, Request, Response } from 'express';

class HealthcheckController {
  public checkStatus = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({ healthcheckStatus: 'SYGHTINGS SERVER STATUS OK...' });
    } catch (error) {
      next(error);
    }
  };
}

export default HealthcheckController;
