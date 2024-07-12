import { IBillboard } from '../interfaces/billboard.interface';
import Billboard from '../models/billboard.model';

export const getBillboardByOwnerId = async (
  ownerId: string
): Promise<IBillboard[]> => {
  const data = await Billboard.find({ ownerId });
  return data;
};

export const getBillboardByLocation = async (
  location: string
): Promise<IBillboard[]> => {
  const data = await Billboard.find({ location });
  return data;
};

export const getBillboardByState = async (
  state: string
): Promise<IBillboard[]> => {
  const data = await Billboard.find({ state });
  return data;
};

export const arrangeBillboardbyUserLocation = async (
  userLocation: string
): Promise<IBillboard[]> => {
  const data = await Billboard.aggregate([
    {
      $match: {
        location: userLocation
      }
    },
    {
      $group: {
        _id: '$location',
        billboards: {
          $push: '$$ROOT'
        }
      }
    }
  ]);
  return data;
};

export const getAvailableBillboards = async (): Promise<IBillboard[]> => {
  const data = await Billboard.find({ availability: true });
  return data;
};

export const getBillboardByNewest = async (): Promise<IBillboard[]> => {
  const data = await Billboard.find().sort({ createdAt: -1 });
  return data;
};
