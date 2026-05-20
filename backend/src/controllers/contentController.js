const { Festival, Event, News, TempleUpdate } = require('../models');

const getFestivals = async (req, res) => {
  try {
    const festivals = await Festival.find().sort({ event_date: -1 });
    const today = new Date().toISOString().split('T')[0];

    const upcoming = festivals.filter(f => new Date(f.event_date).toISOString().split('T')[0] > today && f.status !== 'inactive');
    const ongoing = festivals.filter(f => new Date(f.event_date).toISOString().split('T')[0] === today);
    const completed = festivals.filter(f => new Date(f.event_date).toISOString().split('T')[0] <= today || f.status === 'inactive');

    res.json({ success: true, upcoming_festivals: upcoming, ongoing_festivals: ongoing, completed_festivals: completed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get festivals', error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ event_date: -1 });
    const today = new Date().toISOString().split('T')[0];

    const upcoming = [];
    const ongoing = [];
    const completed = [];

    events.forEach(event => {
      if (event.status === 'completed') completed.push(event);
      else if (new Date(event.event_date).toISOString().split('T')[0] === today) ongoing.push(event);
      else upcoming.push(event);
    });

    res.json({ success: true, upcoming_events: upcoming, ongoing_events: ongoing, completed_events: completed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get events', error: error.message });
  }
};

const getNews = async (req, res) => {
  try {
    const news = await News.find({ status: 'active' }).sort({ published_at: -1 });
    res.json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get news', error: error.message });
  }
};

const getTempleUpdates = async (req, res) => {
  try {
    const { status, type } = req.query;
    let whereClause = {};

    if (status === 'active') whereClause.status = 'active';
    if (type) whereClause.update_type = type;

    const updates = await TempleUpdate.find(whereClause).sort({ is_featured: -1, event_date: 1, created_at: -1 });
    res.json({ success: true, data: updates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get updates', error: error.message });
  }
};

const createTempleUpdate = async (req, res) => {
  try {
    const { title, description, short_description, update_type, event_date, event_end_date, is_featured, status } = req.body;

    const update = await TempleUpdate.create({
      title,
      description,
      short_description: short_description || description?.substring(0, 100),
      update_type,
      event_date: event_date || null,
      event_end_date: event_end_date || null,
      image: req.file ? req.file.filename : null,
      is_featured: is_featured ? true : false,
      status: status ? 'active' : 'inactive',
      created_by: req.userId
    });

    res.status(201).json({ success: true, message: 'Update added successfully', update });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add update', error: error.message });
  }
};

const updateTempleUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, short_description, update_type, event_date, event_end_date, is_featured, status } = req.body;

    const existing = await TempleUpdate.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Update not found' });

    const imageName = req.file ? req.file.filename : existing.image;

    Object.assign(existing, {
      title,
      description,
      short_description: short_description || description?.substring(0, 100),
      update_type,
      event_date: event_date || null,
      event_end_date: event_end_date || null,
      image: imageName,
      is_featured: is_featured ? true : false,
      status: status ? 'active' : 'inactive',
      updated_by: req.userId
    });

    await existing.save();
    res.json({ success: true, message: 'Update updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update', error: error.message });
  }
};

const deleteTempleUpdate = async (req, res) => {
  try {
    const result = await TempleUpdate.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ success: true, message: 'Update deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Update not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete', error: error.message });
  }
};

const toggleTempleUpdateStatus = async (req, res) => {
  try {
    const update = await TempleUpdate.findById(req.params.id);
    if (!update) return res.status(404).json({ success: false, message: 'Update not found' });

    update.status = update.status === 'active' ? 'inactive' : 'active';
    await update.save();
    res.json({ success: true, new_status: update.status });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
  }
};

const createFestival = async (req, res) => {
  try {
    const { name, description, event_date, event_time } = req.body;
    const festival = await Festival.create({
      name, description, event_date, event_time,
      image: req.file ? req.file.filename : null, status: 'active'
    });
    res.status(201).json({ success: true, message: 'Festival added', festival });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add festival', error: error.message });
  }
};

const updateFestival = async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id);
    if (!festival) return res.status(404).json({ success: false, message: 'Festival not found' });
    const { name, description, event_date, event_time, status } = req.body;
    if (name) festival.name = name;
    if (description) festival.description = description;
    if (event_date) festival.event_date = event_date;
    if (event_time) festival.event_time = event_time;
    if (status) festival.status = status;
    if (req.file) festival.image = req.file.filename;
    await festival.save();
    res.json({ success: true, message: 'Festival updated', festival });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update festival', error: error.message });
  }
};

const deleteFestival = async (req, res) => {
  try {
    const result = await Festival.findByIdAndDelete(req.params.id);
    if (result) res.json({ success: true, message: 'Festival deleted' });
    else res.status(404).json({ success: false, message: 'Festival not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete festival', error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, event_time } = req.body;
    const event = await Event.create({
      title, description, event_date, event_time,
      image: req.file ? req.file.filename : null, status: 'upcoming'
    });
    res.status(201).json({ success: true, message: 'Event added', event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add event', error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    const { title, description, event_date, event_time, status } = req.body;
    if (title) event.title = title;
    if (description) event.description = description;
    if (event_date) event.event_date = event_date;
    if (event_time) event.event_time = event_time;
    if (status) event.status = status;
    if (req.file) event.image = req.file.filename;
    await event.save();
    res.json({ success: true, message: 'Event updated', event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update event', error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const result = await Event.findByIdAndDelete(req.params.id);
    if (result) res.json({ success: true, message: 'Event deleted' });
    else res.status(404).json({ success: false, message: 'Event not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event', error: error.message });
  }
};

const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const news = await News.create({
      title, content, image: req.file ? req.file.filename : null, status: 'active'
    });
    res.status(201).json({ success: true, message: 'News added', news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add news', error: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    const { title, content, status } = req.body;
    if (title) news.title = title;
    if (content) news.content = content;
    if (status) news.status = status;
    if (req.file) news.image = req.file.filename;
    await news.save();
    res.json({ success: true, message: 'News updated', news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update news', error: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const result = await News.findByIdAndDelete(req.params.id);
    if (result) res.json({ success: true, message: 'News deleted' });
    else res.status(404).json({ success: false, message: 'News not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete news', error: error.message });
  }
};

module.exports = {
  getFestivals, getEvents, getNews, getTempleUpdates,
  createTempleUpdate, updateTempleUpdate, deleteTempleUpdate, toggleTempleUpdateStatus,
  createFestival, updateFestival, deleteFestival,
  createEvent, updateEvent, deleteEvent,
  createNews, updateNews, deleteNews
};
