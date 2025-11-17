import express from 'express';
import { body } from 'express-validator';
import { 
  createTriage, getMyTriages, getTriageById, 
  getAllTriages, reviewTriage, getTriageStats
} from '../controllers/triageController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

const createTriageValidation = [
  body('symptoms').isArray({ min: 1 }),
  body('symptoms.*.name').trim().notEmpty(),
  body('symptoms.*.severity').isIn(['mild', 'moderate', 'severe'])
];

router.post('/', authenticate, createTriageValidation, validate, createTriage);
router.get('/my-triages', authenticate, getMyTriages);
router.get('/stats', authenticate, authorize('doctor', 'admin'), getTriageStats);
router.get('/all', authenticate, authorize('doctor', 'admin'), getAllTriages);
router.get('/:id', authenticate, getTriageById);
router.put('/:id/review', authenticate, authorize('doctor'), reviewTriage);

export default router;