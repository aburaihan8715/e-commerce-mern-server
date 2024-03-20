import fs from 'fs/promises';

const deleteImageHandler = async (userImagePath) => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.log('User image has been deleted!!');
  } catch (error) {
    console.error('user image does not exist!');
  }
};

export { deleteImageHandler };
