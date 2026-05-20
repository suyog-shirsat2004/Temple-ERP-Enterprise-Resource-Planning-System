const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/festivals', contentController.getFestivals);
router.get('/events', contentController.getEvents);
router.get('/news', contentController.getNews);
router.get('/temple-updates', contentController.getTempleUpdates);

router.post('/temple-updates', adminAuth, upload.single('image'), contentController.createTempleUpdate);
router.put('/temple-updates/:id', adminAuth, upload.single('image'), contentController.updateTempleUpdate);
router.delete('/temple-updates/:id', adminAuth, contentController.deleteTempleUpdate);
router.put('/temple-updates/:id/toggle-status', adminAuth, contentController.toggleTempleUpdateStatus);

router.post('/festivals', adminAuth, upload.single('image'), contentController.createFestival);
router.put('/festivals/:id', adminAuth, contentController.updateFestival);
router.delete('/festivals/:id', adminAuth, contentController.deleteFestival);

router.post('/events', adminAuth, upload.single('image'), contentController.createEvent);
router.put('/events/:id', adminAuth, contentController.updateEvent);
router.delete('/events/:id', adminAuth, contentController.deleteEvent);

router.post('/news', adminAuth, upload.single('image'), contentController.createNews);
router.put('/news/:id', adminAuth, contentController.updateNews);
router.delete('/news/:id', adminAuth, contentController.deleteNews);

module.exports = router;
