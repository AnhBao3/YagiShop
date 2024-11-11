const UserServices = require('../services/UserServices')
const JwtServices = require('../services/JwtServices')

const createUser = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if(!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Nhap thieu thong tin'
            })
        } else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'Nhap sai email'
            })
        } else if(password !== confirmPassword){
            return res.status(200).json({
                status: 'ERR',
                message: 'Password ko trung'
            })
        }
        const respone = await UserServices.createUser(req.body)
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        console.log(req.body)
        const {email, password} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        console.log(email,password)
        if(!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Nhap thieu thong tin aaa'
            })
        } else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'Nhap sai email'
            })
        } 
        const respone = await UserServices.loginUser(req.body)
        const {refresh_token, ...newResponse} = respone
        res.cookie('refresh_token',refresh_token,{
            httpOnly:true,
            secure: false,
            samesite: 'strict'
        })
        return res.status(200).json(newResponse)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'userId ko ton tai'
            })
        }
        const response = await UserServices.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'userId ko ton tai'
            })
        }
        const response = await UserServices.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserServices.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'userId ko ton tai'
            })
        }
        const response = await UserServices.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    console.log('req.cookies.refresh_token',req.cookies.refresh_token)
    try {
        const token = req.cookies.refresh_token
        if(!token){
            return res.status(200).json({
                status: 'ERR',
                message: 'token la bat buoc'
            })
        }
        const response = await JwtServices.refreshTokenJwtServices(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Đăng xuất thành công!'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser
}
