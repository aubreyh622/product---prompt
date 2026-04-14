export const SERVER_CONFIG = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET,
  FALLBACK_SECRET: 'development-jwt-secret', // Only used if no secret is configured
  EXPIRES_IN: '24h',
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  INVALID_TOKEN: 'Invalid token',
  NO_TOKEN: 'No token provided',
  UNAUTHORIZED: 'Unauthorized access',
} as const;
