import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const PollSchema = new Schema({
    
    title: String,
    owner: Schema.Types.ObjectId,
    imageUrl: String,
    username: String,
    rawOptions: String,
    createdOn: {
        type: Date,
        default: Date.now()
    },
    options: [{
        option: String,
        editor:  {
            type: String,
            default: ''
        },
        votes: {
            type: Number,
            default: 0
        }
    }]
})