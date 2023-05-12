import { Sight } from '@/interfaces/sight.interface';
import sightsModel from '@/models/sights.model';
import MongoService from '@services/mongo-service';
import { isEmpty } from '@utils/util';
import { HttpException } from '@exceptions/HttpException';
import { CreateSightDto } from '@/dtos/sights.dto';

class SightService {
  private sights = sightsModel;
  private mongoService = new MongoService();

  public async findAllSights(): Promise<Sight[]> {
    await this.mongoService.connect();
    const sights: Sight[] = await this.sights.find({});
    return sights;
  }

  public async findSightsByUserIdExcludingOwn(userId: string): Promise<Sight[]> {
    await this.mongoService.connect();

    const sights: Sight[] = await this.sights.aggregate([
      {
        $match: {
          userId: { $ne: userId },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      { $set: { userId: { $toObjectId: '$userId' } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $set: {
          user: {
            $arrayElemAt: ['$user', 0],
          },
        },
      },
      {
        $project: {
          'user._id': 0,
          'user.password': 0,
          'user.email': 0,
        },
      },
    ]);

    return sights;
  }

  public async findSightsByUserId(userId: string): Promise<Sight[]> {
    await this.mongoService.connect();
    const sights: Sight[] = await this.sights.find({ userId }).sort({ createdAt: -1 });
    return sights;
  }
  public async createSight(sightData: Sight): Promise<Sight> {
    await this.mongoService.connect();
    if (isEmpty(sightData)) throw new HttpException(400, 'Wrong sight data');
    const createSightData: Sight = { ...sightData };
    const sight = new sightsModel({
      province: sightData.province,
      condition: sightData.condition,
      placeName: sightData.placeName,
      animal: sightData.animal,
      picture: sightData.picture,
      location: sightData.location,
      description: sightData.description,
      createdAt: sightData.createdAt,
      userId: sightData.userId,
    });
    const savedSight = await sight.save();
    createSightData.id = savedSight._id.toString();
    return createSightData;
  }

  public async updateSight(sightId: String, sightData: CreateSightDto): Promise<Sight> {
    try {
      await this.mongoService.connect();
      if (isEmpty(sightData)) throw new HttpException(400, 'Wrong sight data');
      const findSight = await this.sights.findByIdAndUpdate({ _id: sightId }, sightData);
      if (!findSight) throw new HttpException(409, 'Sight not found');
      return findSight;
    } catch (error) {
      throw new HttpException(500, error);
    }
  }

  public async deleteSight(sightId: String): Promise<Sight> {
    await this.mongoService.connect();
    const findSight = await this.sights.findByIdAndRemove({ _id: sightId });
    if (!findSight) throw new HttpException(409, 'Sight not found');
    return findSight;
  }
}

export default SightService;
