import mongoose from 'mongoose';

class MongoService {
  public async connect() {
    try {
      //TODO hanlde environment URI
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sygthings-db');
    } catch (error) {
      console.log(error);
    }
  }

  public close() {
    mongoose.connection.close();
  }
}

export default MongoService;
