import { IAds } from '../interfaces/ads.interface';
import adsModel from '../models/ads.model';

class AdsService {
  constructor() {}

  public getAllAds = async () => {
    const ads = await adsModel.find();
    return ads;
  };
  public createAd = async (body: IAds) => {
    console.log(body);
    const ad = await adsModel.create(body);
    return ad;
  };
  public updateAd = async (id: string, body: IAds) => {
    const ad = await adsModel.findByIdAndUpdate(
      {
        _id: id
      },
      body,
      {
        new: true
      }
    );
    return ad;
  };

  public getSingleAd = async (id: string) => {
    const ad = await adsModel.findById(id);
    return ad;
  };
}

export default AdsService;
