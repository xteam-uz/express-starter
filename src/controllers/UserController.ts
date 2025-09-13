import { type Request, type Response } from "express";
import { User } from "@utils/types.js";
import UserModel from "@schemas/user.schema.js";

class UserController {
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users: User[] = await UserModel.find();
      return res.status(200).json({ date: users });
    } catch (error) {
      return res.sendStatus(500).json({ message: "Server Error", error });
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user: User | null = await UserModel.findById(id);
      return res.status(200).json({ date: user });
    } catch (error) {
      return res.sendStatus(500).json({ message: "Server Error", error });
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const newUser = new UserModel({ name, email, password });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "User successfuly saved", data: newUser });
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;

      const resUser = await user.save();

      return res
        .status(201)
        .json({ message: "User successfuly updated", data: resUser });
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "User successfuly deleted", data: user });
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };
}

export default new UserController();
