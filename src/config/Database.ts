/* eslint-disable no-console */
import mongoose, { ConnectOptions } from 'mongoose';

class MongoDatabase {
  private dbUri: string;
  private connectOptions: ConnectOptions;
  constructor(url: string, connectOptions?: ConnectOptions) {
    this.dbUri = url;
    this.connectOptions =
      connectOptions ||
      ({
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false,
      } as ConnectOptions);
  }
  public connect() {
    mongoose
      .connect(this.dbUri, this.connectOptions)
      .then(() => {
        console.log('✔ Connected to MongoDB');
      })
      .catch(error => {
        console.error('✘ Error connecting to MongoDB:', error.message);
      });
  }
}

export default MongoDatabase;
