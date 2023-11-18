import { data } from "../data/data.js";
import User from "../models/userModel.js";

async function getSeedUsers(req, res, next) {
  try {
    await User.deleteMany({});
    const users = await User.insertMany(data.users);
    res.status(200).send({
      message: "Users returned!",
      users,
    });
  } catch (error) {
    next(error);
  }
}

export { getSeedUsers };
