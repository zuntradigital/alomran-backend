import { Router } from 'express'
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController'
import { protect, adminOnly } from '../middleware/auth'

const router = Router()
router.get('/',        getProjects)
router.post('/',       protect, adminOnly, createProject)
router.put('/:id',     protect, adminOnly, updateProject)
router.delete('/:id',  protect, adminOnly, deleteProject)
export default router
