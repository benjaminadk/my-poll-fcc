import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import jwt from 'jsonwebtoken'
import { User } from '../connectors'

require('dotenv').config()

const PORT = 8081
const HOST = process.env.C9_HOSTNAME
const jwtSecret = process.env.JWT_SECRET
var userId

const githubOAuth = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_APP_ID,
        clientSecret: process.env.GITHUB_APP_SECRET,
        callbackURL: `https://${HOST}:${PORT}/auth/github/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        const githubName = profile.username
        const githubId = profile.id
        const githubEmail = profile.emails[0].value
        const githubImage = profile._json.avatar_url
        
        const user = await User.findOne({ githubId: githubId })
        
        if(!user){
            
            let newUser = new User({
                username: githubName,
                email: githubEmail,
                imageUrl: githubImage,
                githubId: githubId
            })
            
            const savedUser = await newUser.save()
                let newToken = jwt.sign({
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                    imageUrl: savedUser.imageUrl}, jwtSecret, { expiresIn: '7d'})
                
                savedUser.jwt = newToken
                userId = savedUser._id
                savedUser.save().then( () => console.log('New Github User Created'))
        }
        else{
            
            let newToken = jwt.sign({
                id: user._id,
                username: user.username,
                email: user.email,
                imageUrl: user.imageUrl}, jwtSecret, { expiresIn: '7d'})
            
            user.jwt = newToken
            userId = user._id
            user.save().then( () => console.log('Existing Github User Gets JWT Token'))
        }
        done(null, {})
    }
    )
    
const githubScope = passport.authenticate('github', { scope: ['email']})

const githubCallback = passport.authenticate('github', { failureRedirect: `https://${HOST}`, session: false })

const githubRedirect = (req, res) => {
  res.redirect(`https://${HOST}/auth/${userId}`)
  }
  
export { githubOAuth, githubScope, githubCallback, githubRedirect }