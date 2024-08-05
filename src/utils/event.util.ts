import Event from '../models/events.model';

export const getEventsByDate = (date) => {};

export const getEventsbyOrganizer = async (host: string) => {
  const events = await Event.findOne({
    host
  });
  return events;
};

export const getASingleEventById = async (id) => {
  const events = await Event.findOne({
    _id: id
  });
  return events;
};
export const getEventBySlugUtil = async (slug: string) => {
  const event = await Event.findOne({
    slug
  });
  return event;
};

export const createEventSlug = (name: string) => {
  let slug = name.split(' ').join('-').toLowerCase();
  if (getEventBySlugUtil(slug)) {
    slug = slug + Math.floor(Math.random() * 1000);
  }
  return slug;
};
