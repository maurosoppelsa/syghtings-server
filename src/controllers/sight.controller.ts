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
}

export default SightController;
