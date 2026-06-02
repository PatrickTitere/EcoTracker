import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const BCRYPT_ROUNDS = 12;
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

function getSecrets() {
  const access = process.env.JWT_SECRET;
  const refresh = process.env.JWT_REFRESH_SECRET;
  if (!access || !refresh) {
    throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be set");
  }
  return { access, refresh };
}

export interface TokenPayload {
  userId: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: TokenPayload): string {
  const { access } = getSecrets();
  return jwt.sign(payload, access, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(payload: TokenPayload): string {
  const { refresh } = getSecrets();
  return jwt.sign(payload, refresh, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccessToken(token: string): TokenPayload {
  const { access } = getSecrets();
  return jwt.verify(token, access) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const { refresh } = getSecrets();
  return jwt.verify(token, refresh) as TokenPayload;
}