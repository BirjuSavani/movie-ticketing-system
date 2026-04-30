import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../config/database";
import { env } from "../../config/env";
import { RefreshToken } from "../../database/entities/RefreshToken";
import { User } from "../../database/entities/User";
import { MESSAGES } from "../../messages/messages";
import { AppError } from "../../utils/AppError";
import { AuthResponse, AuthTokens } from "./types";

const userRepository = AppDataSource.getRepository(User);
const tokenRepository = AppDataSource.getRepository(RefreshToken);

const generateTokens = async (user: User): Promise<AuthTokens> => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });

  const decodedRefresh = jwt.decode(refreshToken) as any;

  const tokenRecord = tokenRepository.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(decodedRefresh.exp * 1000),
  });

  await tokenRepository.save(tokenRecord);

  return { accessToken, refreshToken };
};

export const register = async (data: any): Promise<AuthResponse> => {
  const existingUser = await userRepository.findOne({ where: { email: data.email } });

  if (existingUser) {
    throw new AppError(409, "CONFLICT", MESSAGES.AUTH.EMAIL_IS_ALREADY_REGISTERED);
  }

  const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);

  const user = userRepository.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: "customer", // Default role
  });

  await userRepository.save(user);

  const tokens = await generateTokens(user);

  return {
    ...tokens,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const login = async (data: any): Promise<AuthResponse> => {
  const user = await userRepository.findOne({ where: { email: data.email } });

  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", MESSAGES.AUTH.INVALID);
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new AppError(401, "UNAUTHORIZED", MESSAGES.AUTH.INVALID);
  }

  const tokens = await generateTokens(user);

  return {
    ...tokens,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const refresh = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new AppError(401, "TOKEN_INVALID", MESSAGES.AUTH.INVALID_TOKEN);
  }

  const tokenRecord = await tokenRepository.findOne({
    where: { token: refreshToken },
    relations: ["user"],
  });

  if (!tokenRecord) {
    throw new AppError(401, "TOKEN_INVALID", MESSAGES.AUTH.INVALID_REFRESH_TOKEN);
  }

  await tokenRepository.remove(tokenRecord);

  const tokens = await generateTokens(tokenRecord.user);
  return tokens;
};

export const logout = async (refreshToken: string): Promise<void> => {
  if (!refreshToken) return;
  const tokenRecord = await tokenRepository.findOne({ where: { token: refreshToken } });
  if (tokenRecord) {
    await tokenRepository.remove(tokenRecord);
  }
};
