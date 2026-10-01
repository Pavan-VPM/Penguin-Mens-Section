import express from 'express';
import { getSiteConfig, updateSiteConfig } from '../controllers/configController.js';

const router = express.Router();

router.get('/', getSiteConfig);
router.put('/', updateSiteConfig);

export default router;
