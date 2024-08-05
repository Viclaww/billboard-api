import { IEvent } from '../interfaces/event.interface';
import Event from '../models/events.model';
import { createEventSlug, getEventBySlugUtil } from '../utils/event.util';

class EventService {
  public createNewEvents = async (body: IEvent): Promise<IEvent> => {
    const slug = createEventSlug(body.eventName);
    const data = await Event.create({
      ...body,
      slug
    });
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
  public getEventsSlug = async (slug: string) => {
    const data = getEventBySlugUtil(slug);
    return data;
  };
}

export default EventService;
