![myPoll Logo](https://s3-us-west-1.amazonaws.com/fccmyvote/splash.svg)

# A FreeCodeCamp Full Stack Project

# [myPoll is live on Heroku](https://mypoll-frontend.herokuapp.com)

- This repo contains both the `create-react-app` client code as well as the `graphql` server code
- Both of these went through a build/transpiling process before production use
- I used the standard `npm run build` for the frontend and serve those files from an Express app
- I used `babel-cli` to transpile the backend code (I couldn't get it to work on Heroku otherwise)
- Each one is its own seperate application on Heroku

## Features
- Anyone can Vote on a poll and see results in real-time
- Polls results are displayed visually with Pie and/or Bar Chart
- Authenticated Users can Create Polls
- Each Poll has Unique Shareable Link

## Technology
### Frontend
- Create React App
- React Router
- ReCharts
- Apollo

### Backend
- Node.js
- Express
- MongoDB (mLab & Mongoose)
- Passport (facebook, twitter, google, github - strategies)
- Jsonwebtoken for JSON Web Token user Authorization
- Graphql
