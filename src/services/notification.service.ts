import { INotification } from '../interfaces/notifaction.interface';
import notificationModel from '../models/notification.model';
import UserService from './user.service';

class NotificationService {
  private userService = new UserService();
  sendEmail(recipient: string, subject: string, message: string): void {
    // Logic to send an email
    console.log(
      `Email sent to ${recipient} with subject "${subject}" and message "${message}"`
    );
  }

  sendSMS(phoneNumber: string, message: string): void {
    // Logic to send an SMS
    console.log(`SMS sent to ${phoneNumber} with message "${message}"`);
  }

  async sendPushNotification(notification: INotification, userId) {
    const user = await this.userService.getUser(userId);
  }
}

export default NotificationService;
