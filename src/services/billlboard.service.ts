import { IBillboard } from '../interfaces/billboard.interface';
import Billboard from '../models/billboard.model';
import {
  getBillboardByNewest,
  getBillboardByOwnerId,
  getSingleBillboard
} from '../utils/billboard.util';

class BillboardService {
  public getAllBillboards = async (): Promise<IBillboard[]> => {
    const data = await Billboard.find().sort({ available: -1 });
    return data;
  };

  // create a new billboard
  public newBillboard = async (body: IBillboard): Promise<IBillboard> => {
    const data = await Billboard.create(body);
    return data;
  };

  // update billboard
  public updateBillboard = async (
    _id: string,
    body: IBillboard
  ): Promise<IBillboard> => {
    const data = await Billboard.findByIdAndUpdate(
      {
        _id
      },
      body,
      {
        new: true
      }
    );
    return data;
  };

  public getBillboardByOwnerId = async (
    ownerId: string
  ): Promise<IBillboard[]> => {
    const data = await getBillboardByOwnerId(ownerId);
    return data;
  };

  public getSingleBillboardById = async (id: string) => {
    const data = await getSingleBillboard(id);
    return data;
  };
  public getBillBoardByNewest = async (): Promise<IBillboard[]> => {
    const data = await getBillboardByNewest();
    return data;
  };
  // set availability
  public setAvailability = async (_id: string, value): Promise<IBillboard> => {
    const data = await await Billboard.findByIdAndUpdate(
      {
        _id
      },
      { available: value },
      {
        new: true
      }
    );
    return data;
  };

  public deleteBillboard = async (_id: string): Promise<string> => {
    await Billboard.findByIdAndDelete(_id);
    return '';
  };

  public getBillboard = async (_id: string): Promise<IBillboard> => {
    const data = await Billboard.findById(_id);
    return data;
  };
}

export default BillboardService;
