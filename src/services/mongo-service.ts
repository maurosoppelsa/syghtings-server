import mongoose from 'mongoose';

class MongoService {
  public async connect() {
    try {
      //TODO hanlde environment URI
      //TODO configure setTimeOut connection
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sygthings-db', {
        socketTimeoutMS: 2000,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public close() {
    mongoose.connection.close();
  }
}

mongoose.connection.on('error', err => {
  console.log(`The server couldn't stablish the connection database`, err);
});

export default MongoService;
