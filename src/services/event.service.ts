import { IEvent } from '../interfaces/event.interface';
import Event from '../models/events.model';
class EventService {
  public createNewEvents = async (body: IEvent): Promise<IEvent> => {
    const data = await Event.create(body);
    return data;
  };

  /**
   * getEventsByDate
   */
  public getEventsByDate = async (date): Promise<IEvent[]> => {
    const data = await Event.find({ eventDate: date.toString });
    return data;
  };

  public getEventsbyOrganizer = async (
    organizer: string
  ): Promise<IEvent[]> => {
    const data = await Event.find({ organizer });
    return data;
  };
  public getEventIdByName = async (eventName: string): Promise<string> => {
    const data = await Event.findOne({ eventName });
    return data._id;
  };
}

export default EventService;
