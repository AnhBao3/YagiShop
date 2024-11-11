const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleWare = (req, res, next) => {
   const token = req.headers.token?.split(" ")[1];
   console.log('token', token)
      jwt.verify(token,process.env.ACCESS_TOKEN, function(err,user){
    if(err){
        return res.status(404).json({
            message: 'Sai',
            status: 'ERROR'
        })
    }
    const { payload } = user
    if(user.isAdmin){
        next()
    } else {
        return res.status(404).json({
            message: 'Sai',
            status: 'ERROR ko phai admin'
        })
    }
    console.log('user',user)
   })
};

const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.token?.split(" ")[1];
    const userId = req.params.id
    console.log('token', token)
       jwt.verify(token,process.env.ACCESS_TOKEN, function(err,user){
     if(err){
         return res.status(404).json({
             message: 'Sai',
             status: 'ERROR'
         })
     }
     const { payload } = user
     if(user?.isAdmin || user?.id == userId){
         next()
     } else {
         return res.status(404).json({
             message: 'Sai',
             status: 'ERROR ko phai admin'
         })
     }
     console.log('user',user)
    })
 };

module.exports = {
    authMiddleWare,
    authUserMiddleWare
};
