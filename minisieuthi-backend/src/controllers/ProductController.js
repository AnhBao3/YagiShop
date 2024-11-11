const ProductServices = require('../services/ProductServices')

const createProduct = async (req, res) => {
    try {
        console.log(req.body)
        const { name, image, type, price, countInStock,rating,description,discount } = req.body

        if(!name || !image || !type || !price || !countInStock || !rating || !description || !discount) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Nhap thieu thong tin'
            })
        }
        const respone = await ProductServices.createProduct(req.body)
        console.log('respone',respone)
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if(!productId){
            return res.status(200).json({
                status: 'ERR',
                message: 'productId ko ton tai'
            })
        }
        const response = await ProductServices.updateProduct(productId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if(!productId){
            return res.status(200).json({
                status: 'ERR',
                message: 'productId ko ton tai'
            })
        }
        const response = await ProductServices.getDetailsProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if(!productId){
            return res.status(200).json({
                status: 'ERR',
                message: 'userId ko ton tai'
            })
        }
        const response = await ProductServices.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;
        const response = await ProductServices.getAllProduct(Number(limit) || 100, Number(page) || 0, sort,filter);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const getAllType = async (req, res) => {
    try {
        const response = await ProductServices.getAllType();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    getAllType
}
