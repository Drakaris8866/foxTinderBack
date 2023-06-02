import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Role from "../models/Role.js";
import secret from "../config.js";

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {
        expiresIn: "24h"
    })
}

class AuthController {
    async registration(req, res) {
        try {
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"})
            const newUser = new User({username, password: hashPassword, roles: [userRole.value]})
            const user = await user.save()
            const token = generateAccessToken(newUser._id, newUser.roles)
            return res.json({user, token, message: "Пользователь успешно создан"})
        } catch (e) {
            res.status(400).json({message: e.message})
        }

    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }
            const token = generateAccessToken(user._id, user.roles)

            res.json({user, token, message: "Успешный вход"})

        } catch (e) {
            res.status(400).json({message: e.message})
        }
    }
}

export default new AuthController