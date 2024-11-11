const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtServices")

const createUser = (newUser) => {
    return new Promise(async (resolve,reject)=>{
        const {name, email, password, phone} = newUser
        try{
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser!==null){
                resolve({
                    status: 'ERR',
                    message: 'Email da ton tai'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            console.log('hash',hash)
            const createdUser = await User.create({
                name, 
                email, 
                password: hash, 
                phone
            })
            if(createdUser){
                resolve({
                    status: 'OK',
                    message: 'Thanh cong',
                    access_token,
                    refresh_token
                })
            }
           resolve({})
        } catch(e){
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve,reject)=>{
        const { email, password} = userLogin
        try{
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser===null){
                resolve({
                    status: 'err',
                    message: 'Ko tim thay user'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            console.log("comparePassword",comparePassword)
            if(!comparePassword){
                resolve({
                    status: 'err',
                    message: 'sai mk hoac email'
                })
            }
            // if(checkUser)
            // const createdUser = await User.create({
            //     name, 
            //     email, 
            //     password: hash, 
            //     confirmPassword: hash, 
            //     phone
            // })
            // if(createdUser){
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
                resolve({
                    status: 'OK',
                    message: 'Thanh cong',
                    access_token,
                    refresh_token
                })
            // }
        } catch(e){
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve,reject)=>{
        try{
            const checkUser = await User.findById({
                _id: id  
            });
            if(checkUser===null){
                resolve({
                    status: 'OK',
                    message: 'Ko tim thay user'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id,data, {new: true})
            console.log('updatedUser',updatedUser)
                resolve({
                    status: 'OK',
                    message: 'Thanh cong',
                    data : updatedUser
                })
            // }
        } catch(e){
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve,reject)=>{
        try{
            const checkUser = await User.findById({
                _id: id  
            });
            if(checkUser===null){
                resolve({
                    status: 'OK',
                    message: 'Ko tim thay user'
                })
            }

           await User.findByIdAndDelete(id)
                resolve({
                    status: 'OK',
                    message: 'delete Thanh cong',
                })
            // }
        } catch(e){
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve,reject)=>{
        try{
           const getALL = await User.find()
                resolve({
                    status: 'OK',
                    data: getALL
                })
            // }
        } catch(e){
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve,reject)=>{
        try{
            const user = await User.findById({
                _id: id  
            });
            if(user===null){
                resolve({
                    status: 'OK',
                    message: 'Ko tim thay user'
                })
            }

                resolve({
                    status: 'OK',
                    message: 'tim thay',
                    data: user
                })
            // }
        } catch(e){
            reject(e)
        }
    })
}

module.exports ={
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser
}