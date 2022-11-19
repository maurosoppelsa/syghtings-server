import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import SightController from '@/controllers/sight.controller';
import authMiddleware from '@middlewares/auth.middleware';

class SightsRoute implements Routes {
  public path = '/sight';
  public router = Router();
  public sightController = new SightController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.sightController.getSights);
    this.router.get(`${this.path}/:userId`, authMiddleware, this.sightController.getSightsByUserId);
  }
}

export default SightsRoute;