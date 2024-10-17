import admin from 'firebase-admin';
import serviceaccount from '../serviceacount.json';
import { ServiceAccount } from 'firebase-admin';

class FirebaseService {
  private static instance: FirebaseService;
  private messaging: ReturnType<typeof admin.messaging>;

  private constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceaccount as ServiceAccount)
    });
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }
  public notify(notification) {}
}

export default FirebaseService;
