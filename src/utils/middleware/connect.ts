import mongoose from 'mongoose';
import { EnvEnum } from '@/env/env.enum';
import EnvService from '@/env/env.service';

export const connectDb = async () => {
  if (mongoose.connections[0].readyState) {
    console.log('Already connected to DB');
    return;
  }
  await mongoose.connect(EnvService.get(EnvEnum.DB_URL));
};