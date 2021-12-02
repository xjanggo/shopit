const mongoose = require('mongoose')

const producerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter producer name'],
        trim: true,
        maxLength: [100, 'Producer name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter producer email'],
    },
    
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Producer', producerSchema);