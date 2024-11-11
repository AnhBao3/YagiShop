const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtServices");
const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailServices")

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const { orderItems, paymentMethod,deliveryMethod,itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder;
    console.log("Received new order data:", newOrder);
    try {
      // Kiểm tra tồn kho cho tất cả các sản phẩm
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOne({
          _id: order.product,
          countInStock: { $gte: order.amount },
        });

        // Nếu sản phẩm không đủ tồn kho, trả về lỗi
        if (!productData) {
          return {
            status: "ERR",
            message: `Sản phẩm với id ${order.product} không đủ tồn kho`,
            productId: order.product,
          };
        }

        // Cập nhật tồn kho cho sản phẩm nếu đủ hàng
        await Product.findOneAndUpdate(
          { _id: order.product },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true }
        );
        return { status: "OK" };
      });

      // Chờ tất cả các kiểm tra tồn kho hoàn tất
      const results = await Promise.all(promises);

      // Lọc các sản phẩm không đủ tồn kho
      const insufficientStock = results.filter(result => result.status === "ERR");
      
      // Nếu có sản phẩm không đủ tồn kho, trả về lỗi
      if (insufficientStock.length > 0) {
        const productIds = insufficientStock.map(item => item.productId);
        return resolve({
          status: "ERR",
          message: `Sản phẩm với id ${productIds.join(", ")} không đủ hàng`,
        });
      }

      // Nếu tất cả sản phẩm đều có đủ tồn kho, tạo đơn hàng
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
        },
        paymentMethod,
        deliveryMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: user,
        isPaid, paidAt
      });

      if (createdOrder) {
        await EmailService.sendEmailCreateOrder(email, orderItems)
        resolve({
          status: "OK",
          message: "Đặt hàng thành công",
        });
      } else {
        reject({
          status: "ERR",
          message: "Đã có lỗi khi tạo đơn hàng",
        });
      }  
    } catch (e) {
      reject(e);
    }
  });
};


const getAllOrder = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.find({
          user: id
        });
        if (order === null) {
          resolve({
            status: "OK",
            message: "Ko tim thay order",
          });
        }
  
        resolve({
          status: "OK",
          message: "tim thay product",
          data: order,
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  const getAllOrderAdmin = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const allOrder = await Order.find();
        resolve({
          status: "OK",
          message: "tim thay product",
          data: allOrder,
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findById({
          _id: id
        });
        if (order === null) {
          resolve({
            status: "OK",
            message: "Ko tim thay order",
          });
        }
  
        resolve({
          status: "OK",
          message: "tim thay product",
          data: order,
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  const cancelOrderDetails = (id,data) => {
    return new Promise(async (resolve, reject) => {
      try {     
            let order = [] 
            const promises = data.map(async (order) => {
              const productData = await Product.findOneAndUpdate(
                {
                  _id: order.product,
                  selled: {$gte: order.amount}
                }, 
                {$inc: {
                  countInStock: +order.amount,
                  selled:-order.amount
                }},
                {new: true}
              )
              console.log('productData',productData)
              if(productData) {
                order = await Order.findByIdAndDelete(id)
                if(order === null){
                  resolve({
                    status: 'OK',
                    message:'Sai 123'
                  })
                }
              } else {
                return {
                  status:'OK',
                  message: 'ERR',
                  id: order.product
                }
              }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item)=>item.id)
            if(newData.length){
              resolve({
                status: 'ERR',
                message:'Sai ko ton tai',
              })
            }
            resolve({
              status: 'OK',
              message:'Đúng',
              data: order
            })
      } catch (e) {
        reject(e);
      }
    });
  };

module.exports = {
  createOrder,
  getAllOrder,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrderAdmin
};

