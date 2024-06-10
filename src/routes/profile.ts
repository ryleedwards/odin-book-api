import { Router } from 'express';
import { getProfile } from '../handlers/profile';

// need { mergeParams: true } in order to get params from parent router
const router = Router({ mergeParams: true });

router.get('/', getProfile);

export default router;
