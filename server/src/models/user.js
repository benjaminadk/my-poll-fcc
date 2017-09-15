import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { User } from '../connectors'


const SALT_WORK_FACTOR = 10
const Schema = mongoose.Schema

const UserSchema = new Schema({
    
    username: {
        type: String
    },
    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    },
    facebookId: {
        type: String,
        default: ''
    },
    githubId: {
        type: String,
        default: ''
    },
    googleId: {
        type: String,
        default: ''
    },
    twitterId: {
        type: String,
        default: ''
    },
    jwt: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
})

//PRE SAVE PASSWORD HASHING
UserSchema.pre('save', function(next) {
    var user = this;

    // RETURN NEXT() IF PASSWORD HASN'T CHANGED
    if (!user.isModified('password')) return next();

    // GENERATE A SALT
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // HASH THE PASSWORD WITH THE SALT
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // OVERRIDE THE PLAIN PASSWORD WITH THE HASHED PASSWORD
            user.password = hash;
            next();
        });
    });
});

//INSTANCE METHOD TO CHECK LOGIN PASSWORD AGAINST HASH
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//STATIC METHODS
UserSchema.static("findByUsername", function(username, cb){
    User.findOne({username: username}, cb)
});

UserSchema.static("findByFbId", function(fbId, cb){
    User.findOne({fbId: fbId}, cb)
});

UserSchema.static("attemptLogin", function(username, password, cb){
  User.findByUsername(username, function(err, user){
    if (err) { return cb(err); }

    if (!user){
      return cb();
    }

    user.comparePassword(password, function(err, isMatch){
      if (err) { return cb(err); }

      if (isMatch){ 
        return cb(null, user);
      } else {
        return cb();
      }

    });

  });
})


export default UserSchema;