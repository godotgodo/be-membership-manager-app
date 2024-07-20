import path from 'path';

const getConfig = () => {
  const config = {
    ENV: process.env.ENV || 'development',
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL as string,
    UPLOAD_PATH: path.resolve(`${__dirname}/../../uploads`),
    JWT_SECRET: process.env.JWT_SECRET as string,
  };

  return config;
};

export default getConfig;
