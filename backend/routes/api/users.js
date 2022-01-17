const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const { getRandom } = require("../../helpers/utils");

router.post("/register", async (req, res) => {
  try {
    const { name, password, email, phone } = req.body;
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide all required fields!" });
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ msg: "User already exist!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      name,
      email,
      phone,
      password: hashedPassword,
      account_balance: getRandom(5),
      account_number: getRandom(11),
    };
    const user = await User.create(newUser);
    const token = jwt.sign({ id: user.id }, config.get("SECRET_KEY"), {
      expiresIn: 3600,
    });
    return res.send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        account_number: user.account_number,
        account_balance: user.account_balance,
        userRef: user.userRef,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
