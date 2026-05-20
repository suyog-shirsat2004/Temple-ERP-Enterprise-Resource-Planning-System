const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/menu', restaurantController.getMenu);
router.post('/menu', adminAuth, restaurantController.addMenuItem);
router.put('/menu/:id', adminAuth, restaurantController.updateMenuItem);
router.delete('/menu/:id', adminAuth, restaurantController.deleteMenuItem);

router.get('/', auth, restaurantController.getUserOrders);
router.get('/all', adminAuth, restaurantController.getAllOrders);
router.get('/:orderId', auth, restaurantController.getOrder);
router.post('/', auth, restaurantController.placeOrder);
router.put('/:id/status', adminAuth, restaurantController.updateOrderStatus);

module.exports = router;
