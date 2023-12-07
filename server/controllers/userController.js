const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcrypt");

const createUser = asyncHandler( async (req, res) => {
    const { username, email, password, picture } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please enter all required information");
    }

    const duplicateUsername = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
    const duplicateEmail = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicateUsername) {
        res.status(400);
        throw new Error("Username already in use");
    }
    if (duplicateEmail) {
        res.status(400);
        throw new Error("Email already in use");
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        "password": hashedPwd,
        picture
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Failed to create user");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400);
        throw new Error("Username and password required");
    }

    const user = await User.findOne({ username }).exec();

    if (!user) {
        res.status(400);
        throw new Error("User does not exist");
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Login information incorrect");
    }
})

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        username: { $regex: req.query.search, $options: "i" }
    } : {};

    const users = await User.find(keyword).find({_id: {$ne: req.user._id } });
    res.send(users);
});

module.exports = { createUser, authUser, allUsers };