import { MONGO_URI } from '@/config';
import { logger } from '@/utils/logger';
import mongoose from 'mongoose';

class MongoService {
  public async connect() {
    //TODO configure setTimeOut connection
    await mongoose.connect(MONGO_URI, {
      socketTimeoutMS: 100,
    });
  }

  public close() {
    mongoose.connection.close();
  }
}

mongoose.connection.on('error', err => {
  logger.error(`The server couldn't stablish the connection database`, err);
});

export default MongoService;
