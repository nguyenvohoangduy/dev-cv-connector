const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const message = require('../utils/message');
const keys = require('../config/key');

// Load input validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

module.exports = {
    register,
    login,
    current
};

// Register user
// 10 Xử lý chi tiết
//   (2) Xử lý đăng ký
//      2. Xử lý chẹck
//          a. Check hạng mục
function register(req) 
{
    return new Promise((res, rej) => {
        const { errors, isValid } = validateRegisterInput(req);
        // Check Validation
        if (!isValid) 
        {
            rej({
                statusCode: 400,
                errors
            });
        }
        
        //2.a.9 check Trường hợp giá trị đã tồn tại trong model users, báo lỗi 
        User.findOne({
            email: req.email
        }).exec(function(err, data) {
            if(err) rej(err)
            else {
                if(data) {
                    errors.email = message.ERROR_MESSAGE.USER.EXISTS;
                    rej({
                        statusCode: 400,
                        errors
                    })
                }
                else {
                    const avatar = gravatar.url(req.email, {
                        s: '200',
                        r: 'pg',
                        d: 'mm'
                    });

                    const newUser = new User({
                        name: req.name,
                        email: req.email,
                        avatar,
                        password: req.password 
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) 
                            {
                                rej(err)
                            }
                            newUser.password = hash;
                            newUser.save((err, response) => {
                                if(err) 
                                {
                                    rej(err)
                                }
                                res(response)
                            })
                        })
                    })
                }
            }
        })
    });
}

// Login user
// 10 Xử lý chi tiết
//   (2) Xử lý đăng ký
//      2. Xử lý chẹck
//          a. Check hạng mục: 4,5
function login(req) 
{
    return new Promise((res, rej) => {
        const { errors, isValid } = validateLoginInput(req);
        // Check Validation
        if (!isValid) 
        {
            rej({
                statusCode: 400,
                errors
            });
        }

        const email = req.email;
        const password = req.password;

        // Find User by email
        User.findOne({email})
            .then((user) => {
                // Check for user
                //2.a.4 check Trường hợp email không tồn tại
                if (!user) 
                {
                    errors.email = message.ERROR_MESSAGE.USER.NOT_FOUND;
                    rej({
                        statusCode: 400,
                        errors
                    })
                }
                else 
                {
                    bcrypt.compare(password, user.password)
                        .then((isMatch) => {
                            if (isMatch) 
                            {
                                const payload = {
                                    id: user.id,
                                    name: user.name,
                                    avatar: user.avatar,
                                }

                                // Sign Token
                                jwt.sign(payload, keys.secretOrKey, {expiresIn: keys.timeExpires}, (err, token) => {
                                    if(err) 
                                    {
                                        rej(err)
                                    }
                                    res({
                                        success: true,
                                        token: 'Bearer ' + token
                                    })
                                });
                            }
                            //2.a.5 check Trường hợp mật khẩu không đúng
                            else {
                                errors.password = message.ERROR_MESSAGE.USER.PASSWORD_INCORECT;
                                rej({
                                    statusCode: 400,
                                    errors
                                })
                            }
                        })
                }
            })
    });
}

function current(req) {
    return new Promise((res, rej) => {
        if(req.user) 
        {
            res({
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
            })
        }
        else 
        {
            errors.auth = message.ERROR_MESSAGE.AUTH.NOT_AUTHORIZED;
            rej({
                statusCode: 403,
                errors
            })
        }
    })
    
}