import passport from 'passport'
import jwt from 'jsonwebtoken'
import { User } from '../connectors'
import GoogleStrategy from 'passport-google-oauth2'
require('dotenv').config()

const PORT = 8081
const HOST = process.env.C9_HOSTNAME
const jwtSecret = process.env.JWT_SECRET
var userId

const googleOAuth = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET,
        callbackURL: `https://${HOST}:${PORT}/auth/google/callback`,
        passReqToCallback: true
    },
     async (request, accessToken, refreshToken, profile, done) => {
            const googleName = profile.displayName
            const googleId = profile.id
            const googleEmail = profile.email
            const googleImage = profile._json.image.url
            
            const user = await User.findOne({ googleId: googleId })
            
            if(!user){
                
                let newUser = new User({
                    username: googleName,
                    email: googleEmail,
                    imageUrl: googleImage,
                    googleId: googleId
                })
                
                const savedUser = await newUser.save()
                    let newToken = jwt.sign({
                        id: savedUser._id,
                        username: savedUser.username,
                        email: savedUser.email,
                        imageUrl: savedUser.imageUrl}, jwtSecret, { expiresIn: '7d'})
                        
                    savedUser.jwt = newToken
                    userId = savedUser._id
                    savedUser.save().then( () => console.log('NEW GOOGLE USER CREATED'))
            }
            else{
                
                let newToken = jwt.sign({
                id: user._id,
                username: user.username,
                email: user.email,
                imageUrl: user.imageUrl}, jwtSecret, { expiresIn: '7d'})
            
            user.jwt = newToken
            userId = user._id
            user.save().then( () => console.log('Existing Google User Gets JWT Token'))
            }
        return done(null,{})
    }
    )
    
const googleScope = passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login',
  	  'https://www.googleapis.com/auth/plus.profile.emails.read' ]})

const googleCallback = passport.authenticate('google', { 
    failureRedirect: `https://${HOST}`, 
    session: false 
})

const googleRedirect = (req, res) => {
  res.redirect(`https://${HOST}/auth/${userId}`)
  }
  
export { googleOAuth, googleScope, googleCallback, googleRedirect }