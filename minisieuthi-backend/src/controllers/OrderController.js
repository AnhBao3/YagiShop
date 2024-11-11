const Order = require("../models/OrderProduct");
const OrderServices = require("../services/OrderServices");

const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
    } = req.body;
    console.log(
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone
    );
    if (
      !paymentMethod ||
      !itemsPrice ||
      shippingPrice === undefined ||
      !totalPrice ||
      !fullName ||
      !address ||
      !city ||
      !phone
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "Nhap thieu thong tin",
      });
    }
    const respone = await OrderServices.createOrder(req.body);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllDetailsOrder = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "userId ko ton tai",
      });
    }
    console.log('userId',userId)
    const response = await OrderServices.getAllOrder(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "orderId ko ton tai",
      });
    }
    console.log('orderId',orderId)
    const response = await OrderServices.getOrderDetails(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const cancleOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "orderId ko ton tai",
      });
    }
    const response = await OrderServices.cancelOrderDetails(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const data = await OrderServices.getAllOrderAdmin();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createOrder,
  getAllDetailsOrder,
  getDetailOrder,
  cancleOrderDetails,
  getAllOrder
};
