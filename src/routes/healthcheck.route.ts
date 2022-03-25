import { Router } from 'express';
import HealthCheckController from '@controllers/healthcheck.controller';
import { Routes } from '@interfaces/routes.interface';

class HealthCheckRoute implements Routes {
  public path = '/healthcheck';
  public router = Router();
  public healthcheckController = new HealthCheckController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.healthcheckController.checkStatus);
  }
}

export default HealthCheckRoute;
