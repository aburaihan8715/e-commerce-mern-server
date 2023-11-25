import User from "../models/userModel.js";

const checkUserExists = async (email) => {
  return await User.exists({ email: email });
};

export { checkUserExists };
