import mongoose from 'mongoose';
import createError from 'http-errors';

const findWithId = async (Model, id, options = {}) => {
  try {
    const data = await Model.findById(id, options);

    if (!data)
      throw createError(404, `${Model.modelName} does not exist with this id!`);

    return data;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(404, `Invalid ${Model.modelName} Id`);
    }
    throw error;
  }
};

export { findWithId };
