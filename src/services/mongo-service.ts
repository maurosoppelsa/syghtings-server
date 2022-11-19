import mongoose from 'mongoose';

class MongoService {
  public async connect() {
    //TODO hanlde environment URI
    //TODO configure setTimeOut connection
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sygthings-db', {
      socketTimeoutMS: 100,
    });
  }

  public close() {
    mongoose.connection.close();
  }
}

mongoose.connection.on('error', err => {
  console.log(`The server couldn't stablish the connection database`, err);
});

export default MongoService;
