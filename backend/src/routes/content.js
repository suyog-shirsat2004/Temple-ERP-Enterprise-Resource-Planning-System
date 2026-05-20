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

module.exports = router;
