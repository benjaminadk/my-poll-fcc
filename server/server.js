import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import passport from 'passport'
import cors from 'cors'
import { createServer } from 'http'
import { schema } from './src/schema'
import { execute, subscribe } from 'graphql'
import { facebookOAuth, facebookScope, facebookCallback, facebookRedirect } from './src/authentication/facebook'
import { githubOAuth, githubScope, githubCallback, githubRedirect } from './src/authentication/github'
import { googleOAuth, googleScope, googleCallback, googleRedirect } from './src/authentication/google'
import { twitterOAuth, twitterScope, twitterCallback, twitterRedirect } from './src/authentication/twitter'
import { authorizeUser } from './src/authorization'
require('dotenv').config()

const PORT = 8081
const HOST = process.env.C9_HOSTNAME
const SECRET = process.env.EXPRESS_SESSION_SECRET

const server = express()
server.use(require('express-session')({ secret: SECRET, resave: true, saveUninitialized: true }))
passport.use(facebookOAuth)
passport.use(githubOAuth)
passport.use(googleOAuth)
passport.use(twitterOAuth)
server.use(passport.initialize())
server.get('/auth/facebook', facebookScope)
server.get('/auth/facebook/callback', facebookCallback, facebookRedirect)
server.get('/auth/github', githubScope)
server.get('/auth/github/callback', githubCallback, githubRedirect)
server.get('/auth/google', googleScope)
server.get('/auth/google/callback', googleCallback, googleRedirect)
server.get('/auth/twitter', twitterScope)
server.get('/auth/twitter/callback', twitterCallback, twitterRedirect)

server.use('*', cors({ origin: `https://${HOST}`}))

server.use(authorizeUser)

server.use('/graphql', bodyParser.json(), graphqlExpress(req => ({
    schema,
    context: {
        user: req.user
    }
})))

server.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `wss://${HOST}:${PORT}/graphql/subscriptions`
}))

const ws = createServer(server)

ws.listen(PORT, () => {
    console.log(`GRAPHQL SERVER UP @ https://${HOST}:${PORT}/graphql`)
    
    new SubscriptionServer({
        execute,
        subscribe,
        schema
    },{
        server: ws,
        path: '/graphql/subscriptions'
    })
})

