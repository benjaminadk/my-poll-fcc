import passport from 'passport'
import TwitterStrategy from 'passport-twitter'
import jwt from 'jsonwebtoken'
import { User } from '../connectors'

require('dotenv').config()

const PORT = 8081
const HOST = process.env.C9_HOSTNAME
const jwtSecret = process.env.JWT_SECRET
var userId

const twitterOAuth = new TwitterStrategy(
    {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `https://${HOST}:${PORT}/auth/twitter/callback`
    },
    async (token, tokenSecret, profile, cb) => {
        console.log(profile)
        const twitterName = profile.username
        const twitterId = profile.id
        const twitterImage = profile.photos[0].value
        
        const user = await User.findOne({ twitterId: twitterId })
        
        if(!user) {
            let newUser = new User({
                username: twitterName,
                email: '',
                imageUrl: twitterImage,
                twitterId: twitterId
            })
            
            const savedUser = await newUser.save()
                let newToken = jwt.sign({
                    id: savedUser._id,
                    username: savedUser.username,
                    imageUrl: savedUser.imageUrl}, jwtSecret, { expiresIn: '7d'})
            
            savedUser.jwt = newToken
            userId = savedUser._id
            savedUser.save().then( () => console.log('New Twitter User Saved'))
        }
        else {
            
            let newToken = jwt.sign({
                id: user._id,
                username: user.username,
                imageUrl: user.imageUrl}, jwtSecret, { expiresIn: '7d' })
                
            user.jwt = newToken
            userId = user._id
            user.save().then( () => console.log('Existing Twitter User Gets JWT Token'))
        }
        cb(null, {})
    }
    )
    
const twitterScope = passport.authenticate('twitter')

const twitterCallback = passport.authenticate('twitter', { failureRedirect: `https://${HOST}/signup`, session: false })

const twitterRedirect = (req, res) => {
    res.redirect(`https://${HOST}/auth/${userId}`)
}

export { twitterOAuth, twitterScope, twitterCallback, twitterRedirect }