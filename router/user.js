import express from 'express'
import Joi from 'joi'
import UserModel from '../models/userModel.js'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = express.Router();

//Genetate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

router.post('/', async (req, res) => {
    const Schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required()
    });

    const { error } = Schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email, password } = req.body;

    //Check if user exists
    const userExists = await UserModel.findOne({email})

    if(userExists) {
        return res.status(400).send('User already exists')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Creating user
    let user = new UserModel({
        name:name, email:email, password: hashedPassword
    })

    user = await user.save();
    if(user) {
        res.send({
            _id: user.id,
            name:user.name,
            email: user.email,
            token: generateToken(user._id),
            createTime: user.createdAt
        })
    }
});


router.post('/login', async(req, res) => {
    const Schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })

    const { error } = Schema.validate(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    const { email, password} = req.body

    //Check for user email matching
    const user = await UserModel.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.send({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).send('Invalid credentials')
    }
})




export default router

     