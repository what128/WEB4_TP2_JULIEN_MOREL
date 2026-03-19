import express from 'express';
import { seedDatabase } from '../controllers/dbController.mjs';

const router = express.Router();

router.post('/seed', seedDatabase);

export default router;