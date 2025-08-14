import { Router } from 'express';
// authController.ts

// Your existing code here

export const login = (req, res) => {
    // Implement login logic here
    res.send('Login successful');
};
const router = Router();
router.post('/login', login);
export default router;
