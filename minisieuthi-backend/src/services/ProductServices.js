const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      description,
      discount,
    } = newProduct;

    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "OK",
          message: "Ten san pham da ton tai",
        });
      }
      const newProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
        discount,
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "Thanh cong",
          data: newProduct,
        });
      }
      resolve({
        status: "OK",
        message: "Thanh cc",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "Ko tim thay Product",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "Thanh cong",
        data: updatedProduct,
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "Ko tim thay product",
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "delete Thanh cong",
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      console.log("filter", filter);
      if (filter) {
        const lable = filter[0];
        const allObjectFilter = await Product.find({
          [lable]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit);
        resolve({
          status: "OK",
          data: allObjectFilter,
          total: totalProduct,
          page: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const getALLSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
        resolve({
          status: "OK",
          data: getALLSort,
          total: totalProduct,
          page: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      const getALL = await Product.find()
        .limit(limit)
        .skip(page * limit);
      resolve({
        status: "OK",
        data: getALL,
        total: totalProduct,
        page: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById({
        _id: id,
      });
      if (product === null) {
        resolve({
          status: "OK",
          message: "Ko tim thay product",
        });
      }

      resolve({
        status: "OK",
        message: "tim thay product",
        data: product,
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        data: allType,
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  getAllType,
};
