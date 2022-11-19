import { Sight } from '@/interfaces/sight.interface';
import sightsModel from '@/models/sights.model';
import MongoService from '@services/mongo-service';

class SightService {
    private sights = sightsModel;
    private mongoService = new MongoService();

    public async findAllSights(): Promise<Sight[]> {
        await this.mongoService.connect();
        const sights: Sight[] = await this.sights.find({});
        return sights;
    }
    public async findSightsByUserId(userId: string): Promise<Sight[]> {
        await this.mongoService.connect();
        const sights: Sight[] = await this.sights.find({userId});
        return sights;
    }
}

export default SightService;