/* eslint-disable no-console */
import express from 'express';
import dotenv from 'dotenv';
import getConfig from './config/getConfig';
import errorHandler from './middlewares/errorHandler';
import router from './routes';
import { customBodyMiddleware } from './middlewares/customJsonBody';
import MongoDatabase from './config/Database';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});
const config = getConfig();
const db = new MongoDatabase(config.MONGO_URL);
db.connect();

const app = express();
const PORT = config.PORT;

app.use(express.json());
app.use(customBodyMiddleware);
app.use('/api/', router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✔ Server is running on port ${PORT}`);
});

export default app;
