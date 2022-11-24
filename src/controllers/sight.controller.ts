import { CreateSightDto } from '@/dtos/sights.dto';
import { Sight } from '@/interfaces/sight.interface';
import SightService from '@/services/sight.service';
import { NextFunction, Request, Response } from 'express';

class SightController {
    public sightService = new SightService();

    public getSights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const findAllSigths = await this.sightService.findAllSights();
            res.status(200).json({ data: findAllSigths, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    };

    public getSightsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = String(req.params.userId);
            const findAllSigthsByUserId = await this.sightService.findSightsByUserId(userId);
            res.status(200).json({ data: findAllSigthsByUserId, message: 'findAllById' });
        } catch (error) {
            next(error);
        }
    };

    public createSight = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const sightData: Sight = req.body;
            const createSightData: Sight = await this.sightService.createSight(sightData);
            res.status(201).json({ data: createSightData, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    public updateSight = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const sightId = String(req.params.sightId);
            const sightData: CreateSightDto = req.body;
            const updateSightData: Sight = await this.sightService.updateSight(sightId, sightData);
            res.status(200).json({ data: updateSightData, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public deleteSight = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const sightId = String(req.params.sightId);
            const deleteSightData: Sight = await this.sightService.deleteSight(sightId);
            res.status(200).json({ data: deleteSightData, message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };
}

export default SightController;
