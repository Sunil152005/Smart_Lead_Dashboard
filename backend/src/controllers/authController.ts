import { Request, Response } from "express";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import User from "../models/User";

export const register = async (
  req: Request,
  res: Response
) => {
  try {

    const { name, email, password } =
      req.body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json(user);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Register Error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {

    const { email, password } =
      req.body;

    console.log(email);
    console.log(password);

    const user = await User.findOne({
      email,
    });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password as string
      );

    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET as string
    );

    res.json({
      token,
      role: user.role,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Login Error",
    });
  }
};