import { NextFunction, Request, Response } from 'express';

class HealthcheckController {
  public checkStatus = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.json({
        healthcheckStatus: 'SYGHTINGS SERVER WORKING FINE...',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default HealthcheckController;
