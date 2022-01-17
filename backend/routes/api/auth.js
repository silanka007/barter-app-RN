const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Provide email and password" });

    const userExist = await User.findOne({ email });
    if (!userExist)
      return res.status(400).json({ msg: "Invalid email or password" });
   
    const isCorrectPass = bcrypt.compareSync(password, userExist.password);
    if (!isCorrectPass)
      return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign({ id: userExist }, config.get("SECRET_KEY"), {
      expiresIn: 3600,
    });

    return res.send({
      token,
      user: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        phone: userExist.phone,
        account_number: userExist.account_number,
        account_balance: userExist.account_balance,
        userRef: userExist.userRef,
        createdAt: userExist.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
