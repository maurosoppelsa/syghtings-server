import * as fs from 'fs';
import * as shortid from 'shortid';
import { Sight, SightFormData } from '@/interfaces/sight.interface';
import sightsModel from '@/models/sights.model';
import MongoService from '@services/mongo-service';
import { isEmpty } from '@utils/util';
import { HttpException } from '@exceptions/HttpException';
import path from 'path';

class SightService {
  private sights = sightsModel;
  private mongoService = new MongoService();
  private sightImageFolder = process.env.SIGHT_IMAGE_DIRECTORY || '../../sight-photos';

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
  public async createSight(sightFormData: SightFormData): Promise<Sight> {
    const sightData: Sight = JSON.parse(sightFormData.sight);
    const photo = sightFormData.photo;
    const imageId = shortid.generate();
    await this.mongoService.connect();
    if (isEmpty(sightData)) throw new HttpException(400, 'Wrong sight data');
    const createSightData: Sight = { ...sightData };
    const sight = new sightsModel({
      province: sightData.province,
      condition: sightData.condition,
      placeName: sightData.placeName,
      animal: sightData.animal,
      location: sightData.location,
      description: sightData.description,
      createdAt: sightData.createdAt,
      userId: sightData.userId,
      imageId: imageId,
    });
    const savedSight = await sight.save();
    await this.uploadPhoto(imageId, photo);
    createSightData.id = savedSight._id.toString();
    createSightData.imageId = imageId;
    return createSightData;
  }

  public async updateSight(sightId: String, sightData: any): Promise<Sight> {
    try {
      await this.mongoService.connect();
      if (isEmpty(sightData)) throw new HttpException(400, 'Wrong sight data');
      let photo = sightData.photo;
      let sight;
      if (sightData.photo) {
        photo = sightData.photo;
        sight = JSON.parse(sightData.sight);
        await this.uploadPhoto(sight.imageId, photo);
      } else {
        sight = sightData;
      }
      const findSight = await this.sights.findByIdAndUpdate({ _id: sightId }, sight, { new: true });
      if (!findSight) throw new HttpException(409, 'Sight not found');
      return findSight;
    } catch (error) {
      throw new HttpException(500, error);
    }
  }

  public async deleteSight(sightId: String): Promise<Sight> {
    await this.mongoService.connect();
    const findSight = await this.sights.findByIdAndRemove({ _id: sightId });
    await this.deletePhoto(findSight.imageId);
    if (!findSight) throw new HttpException(409, 'Sight not found');
    return findSight;
  }

  public getSightImage = async (imageId: string): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
      const imagePath = path.join(__dirname, this.sightImageFolder, imageId);
      fs.readFile(imagePath, (error, data) => {
        if (error) {
          // Handle any error that occurred during file reading
          reject(error);
        } else {
          // Resolve with the file data
          resolve(data.toString());
        }
      });
    });
  };

  public uploadPhoto = async (imageId: string, photoContent: any): Promise<void> => {
    const filePath = path.join(__dirname, this.sightImageFolder, imageId);
    // Convert the photo content to a Buffer object
    const photoBuffer = Buffer.from(photoContent, 'base64');

    await fs.writeFile(filePath, photoBuffer, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error(err);
        throw new Error('Failed to upload photo.');
      }
    });
  };

  public deletePhoto = async (imageId: string): Promise<void> => {
    const filePath = path.join(__dirname, this.sightImageFolder, imageId);
    await fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        throw new Error('Failed to delete photo.');
      }
    });
  };

  public getSightImagePath = (imageId: string): string => {
    return path.join(__dirname, this.sightImageFolder, imageId);
  };
}

export default SightService;
