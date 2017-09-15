import mongoose from 'mongoose'
import UserSchema from './models/user'
import { PollSchema } from './models/poll'
require("dotenv").config()

const URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds127564.mlab.com:27564/passport-examples`
const options = {useMongoClient: true}
const callback = (err) => {
    if(err){return new Error(err)}
    console.log("Connected to mLab....")
}

mongoose.connect(URI, options, callback)
mongoose.Promise = global.Promise
mongoose.set('debug', true)

const User = mongoose.model("Users", UserSchema)
const Poll = mongoose.model("Polls", PollSchema)
export { User, Poll }