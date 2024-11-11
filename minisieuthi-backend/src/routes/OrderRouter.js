const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/create',OrderController.createOrder)

router.get('/get-all-order/:id', OrderController.getAllDetailsOrder)

router.get('/get-details-order/:id', OrderController.getDetailOrder)

router.delete('/cancel-order/:id', OrderController.cancleOrderDetails)

router.get('/get-all-order', OrderController.getAllOrder)


module.exports = router