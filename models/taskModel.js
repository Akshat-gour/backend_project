import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        required: true,
    },
    dueDate: {
        type: Date,
        default: Date.now,
    }
})

const Task = mongoose.model('Task', taskSchema)

export default Task
