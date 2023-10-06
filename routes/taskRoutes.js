import express from 'express'
const router = express.Router()
import {
    createTask,
    getTasks,
    editTask,
    deleteTask,
} from '../controllers/taskController.js'

import { protect } from '../middleware/authMiddleware.js'

router.route('/').get(protect, getTasks).post(protect, createTask)
router.route('/:id').delete(protect, deleteTask).put(protect, editTask)
export default router
