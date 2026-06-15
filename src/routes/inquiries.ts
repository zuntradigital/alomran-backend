import { Router } from 'express'
import { createInquiry, getInquiries, updateInquiryStatus, getStats } from '../controllers/inquiryController'
import { protect } from '../middleware/auth'

const router = Router()
router.post('/',           createInquiry)
router.get('/',            protect, getInquiries)
router.get('/stats',       protect, getStats)
router.put('/:id/status',  protect, updateInquiryStatus)
export default router
