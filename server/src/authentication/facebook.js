import passport from 'passport'
import FacebookStrategy from 'passport-facebook'
import jwt from 'jsonwebtoken'
import { User } from '../connectors'

require('dotenv').config()

const PORT = 8081
const HOST = process.env.C9_HOSTNAME
const jwtSecret = process.env.JWT_SECRET
var userId

const facebookOAuth = new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `https://${HOST}:${PORT}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'picture', 'email']
    },
    async (accessToken, refreshToken, profile, cb) => {
        const facebookName = profile.displayName
        const facebookId = profile.id
        const facebookEmail = profile.emails[0].value
        const facebookImage = profile.photos[0].value
        
        const user = await User.findOne({ facebookId: facebookId })
        
        if(!user){
                
            let newUser = new User({
                username: facebookName,
                email: facebookEmail,
                imageUrl: facebookImage,
                facebookId: facebookId
            })
            
            const savedUser = await newUser.save()
                let newToken = jwt.sign({
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                imageUrl: savedUser.imageUrl}, jwtSecret, { expiresIn: '7d'})
            
            savedUser.jwt = newToken
            userId = savedUser._id
            savedUser.save().then( () => console.log('New Facebook User Created')) 
            
        }
        else{
        
            let newToken = jwt.sign({
                id: user._id,
                username: user.username,
                email: user.email,
                imageUrl: user.imageUrl}, jwtSecret, { expiresIn: '7d'})
                
            user.jwt = newToken
            userId = user._id
            user.save().then( () => console.log('Existing Facebook User Gets JWT Token'))
        }
    cb(null, {})      
    }
    )
    
const facebookScope = passport.authenticate('facebook', { scope: ['email']})

const facebookCallback = passport.authenticate('facebook', { failureRedirect: `https://${HOST}/signup`, session: false })

const facebookRedirect = (req, res) => {
  res.redirect(`https://${HOST}/auth/${userId}`)
  }

export { facebookOAuth, facebookScope, facebookCallback, facebookRedirect }