import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import SightController from '@/controllers/sight.controller';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateSightDto, GetSightImageDto, UpdateSightDto } from '@/dtos/sights.dto';

class SightsRoute implements Routes {
  public path = '/sight';
  public router = Router();
  public sightController = new SightController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.sightController.getSights);
    this.router.get(`${this.path}/exclude/:userId`, authMiddleware, this.sightController.getSightsByUserIdExcludingOwn);
    this.router.get(`${this.path}/:userId`, authMiddleware, this.sightController.getSightsByUserId);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateSightDto, 'body', true), this.sightController.createSight);
    this.router.put(`${this.path}/:sightId`, authMiddleware, validationMiddleware(UpdateSightDto, 'body', true), this.sightController.updateSight);
    this.router.delete(`${this.path}/:sightId`, authMiddleware, this.sightController.deleteSight);
    this.router.get(`${this.path}/image/:imageId`, validationMiddleware(GetSightImageDto, 'params'), this.sightController.getImage);
  }
}

export default SightsRoute;
