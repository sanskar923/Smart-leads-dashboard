import { Router } from 'express';
import * as leadController from '../controllers/leadController';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createLeadSchema,
  leadIdParamSchema,
  leadQuerySchema,
  updateLeadSchema,
} from '../validators/lead.validator';

const router = Router();

router.use(protect);

router.get('/stats', leadController.getDashboardStats);
router.get('/export', restrictTo('Admin'), validate(leadQuerySchema, 'query'), leadController.exportLeads);
router.get('/', validate(leadQuerySchema, 'query'), leadController.getLeads);
router.get('/:id', validate(leadIdParamSchema, 'params'), leadController.getLead);
router.post('/', validate(createLeadSchema), leadController.createLead);
router.put(
  '/:id',
  validate(leadIdParamSchema, 'params'),
  validate(updateLeadSchema),
  leadController.updateLead
);
router.delete(
  '/:id',
  restrictTo('Admin'),
  validate(leadIdParamSchema, 'params'),
  leadController.deleteLead
);

export default router;
