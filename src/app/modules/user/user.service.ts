/* eslint-disable no-console */
/* eslint-disable no-undef */
import { IUser, IUserLogin } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  IRefreshTokenResponse,
  IUserLoginResponse,
} from '../../../jwt/jwt.interface';
import { jwtHelpers } from '../../../jwt/jwtHelper';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { cloudinaryHelper } from '../../../cloudinary/cloudinaryHelper';

const createUser = async (
  user: IUser,
  avatar: Express.Multer.File | undefined
): Promise<IUser | null> => {
  const { email, password, name } = user;
  if (!email || !password || !name)
    throw new ApiError(httpStatus.BAD_REQUEST, 'All fields are required');

  const userExist = await User.findOne({ email });
  if (userExist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');

  let avatarUrl = null;
  if (avatar)
    avatarUrl = await cloudinaryHelper.uploadToCloudinary(
      avatar,
      'Imagenius/avatars'
    );

  user.avatar = avatarUrl!;
  const result = await User.create(user);

  const sanitizedResult = await User.findById(result._id)
    .select('-password')
    .lean();

  return sanitizedResult;
};

const loginUser = async (payload: IUserLogin): Promise<IUserLoginResponse> => {
  const { email: givenEmail, password } = payload;

  const user = new User();
  const isUserExist = await user.isUserExist(givenEmail);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (
    isUserExist.password &&
    !(await user.isPasswordMatched(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ' Password is incorrect');
  }

  // create access token , refresh token
  const { _id, email, name, role } = isUserExist;

  const photoUrl = isUserExist.avatar?.photoUrl;

  const accessToken = jwtHelpers.createToken(
    { _id, email, name, photoUrl, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, email },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }
  // checking deleted user refresh  token

  const { _id } = verifiedToken;

  const isUserExist = await User.findById(_id, { _id: 1, email: 1 });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // generate new user refresh token
  const newAccesstoken = jwtHelpers.createToken(
    {
      _id: isUserExist._id,
      email: isUserExist.email,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    accessToken: newAccesstoken,
  };
};

const getAllUsers = async () => {
  const result = await User.find({}, { avatar: 0, password: 0 });
  return result;
};

const makeAdmin = async (userId: string): Promise<IUser | null> => {
  const userExist = await User.findById(userId);
  if (!userExist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User do not exist here');

  const options = {
    role: 'admin',
  };

  const result = await User.findByIdAndUpdate(userId, options, { new: true });
  return result;
};

const removeAdmin = async (userId: string): Promise<IUser | null> => {
  const userExist = await User.findById(userId);
  if (!userExist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User do not exist');

  const options = {
    role: 'user',
  };

  const result = await User.findByIdAndUpdate(userId, options, { new: true });
  return result;
};

const getProfile = async (userId: string) => {
  const result = await User.findById(userId, {
    avatar: 1,
    email: 1,
    name: 1,
  });

  return result;
};

const deleteUser = async (
  userId: string,
  role: string
): Promise<IUser | null> => {
  const userExist = await User.findById(userId);
  if (!userExist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User do not exist');

  if (userExist.role === 'super admin')
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not authorized');

  if (role === 'admin' && userExist.role == 'admin')
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not authorized');

  const result = await User.findByIdAndDelete(userId);
  return result;
};

export const UserService = {
  createUser,
  loginUser,
  refreshToken,
  getProfile,
  getAllUsers,
  makeAdmin,
  removeAdmin,
  deleteUser,
};
