import { Router, Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/users';
import { signupUserSchema } from '../db/schema';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG, AUTH_ERRORS } from '../config/constants';
import { AppError } from '../middleware/errorHandler';
import { authenticateLocal, authenticateJWT } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const userRepo = new UserRepository();

// Signup route
const signupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = signupUserSchema.parse(req.body);

    const existingUser = await userRepo.findByEmail(validatedData.email);
    if (existingUser) {
      throw new AppError(AUTH_ERRORS.EMAIL_ALREADY_EXISTS, 400);
    }

    const user = await userRepo.create({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        message: 'Signup successful',
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login route
const loginHandler = (req: Request, res: Response) => {
  const user = (req as AuthRequest).user!;
  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    },
  });
};

// Get current user
const getCurrentUser = (req: Request, res: Response) => {
  const user = (req as AuthRequest).user!;
  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
    },
  });
};

// Helper functions
const generateToken = (user: any) => {
  const jwtSecret = JWT_CONFIG.SECRET || JWT_CONFIG.FALLBACK_SECRET;
  return jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
    expiresIn: JWT_CONFIG.EXPIRES_IN,
  });
};

const sanitizeUser = (user: any) => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

// Demo login — no database required, returns a JWT for a hardcoded demo user.
// Only active when DEMO_MODE=true.
router.post('/demo-login', (req: Request, res: Response) => {
  if (process.env.DEMO_MODE !== 'true') {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  const DEMO_USERS = [
    { id: '1', name: 'Aubrey Huang',  email: 'aubrey@cgsadvisors.com',  role: 'consultant',        profileComplete: true },
    { id: '2', name: 'Marcus Chen',   email: 'marcus@cgsadvisors.com',   role: 'senior_reviewer',   profileComplete: true },
    { id: '3', name: 'Priya Nair',    email: 'priya@cgsadvisors.com',    role: 'knowledge_manager', profileComplete: true },
    { id: '4', name: 'James Okafor', email: 'james@cgsadvisors.com',   role: 'admin',             profileComplete: true },
  ];
  const { userId } = req.body;
  const user = DEMO_USERS.find((u) => u.id === userId) || DEMO_USERS[0];
  const jwtSecret = JWT_CONFIG.SECRET || JWT_CONFIG.FALLBACK_SECRET;
  const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
    expiresIn: JWT_CONFIG.EXPIRES_IN,
  });
  return res.json({ success: true, data: { token, user } });
});

// Routes
router.post('/signup', signupHandler);
router.post('/login', authenticateLocal, loginHandler);
router.get('/me', authenticateJWT, getCurrentUser);

export default router;
