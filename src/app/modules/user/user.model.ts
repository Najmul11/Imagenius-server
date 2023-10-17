/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, IUserMethods, Usermodel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const UserSchema = new Schema<IUser, Record<string, unknown>, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      publicId: {
        type: String,
      },
      photoUrl: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'super admin'],
      default: 'user',
    },
    payment: {
      type: String,
      enum: ['Bkash', 'Nagad', 'Binance'],
      default: 'Bkash',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.isUserExist = async function (
  email: string
): Promise<Partial<IUser> | null> {
  return await User.findOne(
    { email },
    { password: 1, _id: 1, email: 1, name: 1, avatar: 1, role: 1 }
  );
};

UserSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round)
  );
  next();
});

export const User = model<IUser, Usermodel>('User', UserSchema);
