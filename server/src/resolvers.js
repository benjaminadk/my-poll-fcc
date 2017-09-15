import { User, Poll } from './connectors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { PubSub, withFilter } from 'graphql-subscriptions'
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET
const pubsub = new PubSub()

function buildFilters({OR = [], title_contains, option_contains}) {
  const filter = (title_contains || option_contains) ? {} : null;
  if (title_contains) {
    filter.title = {$regex: `.*${title_contains}.*`, $options: 'i'};
  }
  if (option_contains) {
    filter.rawOptions = {$regex: `.*${option_contains}.*`, $options: 'i'};
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildFilters(OR[i]));
  }
  return filters;
}

export const resolvers = {
    
    Query: {
        
        allUsers: async (root, args) => {
            const users = await User.find({})
            return users
        },
        
        userById: async (root, { id }) => {
            const user = await User.findById(id)
            return user
        },
        
        facebookUser: async (root, { facebookId }) => {
            const user = await User.findOne({ facebookId: facebookId })
            return user
        },
        
        pollById : async (root, { id }) => {
            const poll = await Poll.findById(id)
            return poll
        },
        
        allPolls: async (root, {filter, first, skip}, context) => {
            let query = filter ? {$or: buildFilters(filter)} : {};
            const cursor = await Poll.find(query);
            if (first) {
                cursor.limit(first);
             }
            if (skip) {
                cursor.skip(skip);
            }
            return cursor
        },
        
        myPolls: async (root, args, context) => {
            const polls = await Poll.find({ owner: context.user.id })
            return polls
        }
    },
    
    Mutation: {
        
        createUser: async (root, { input }) => {
            const newUser = new User({
                username: input.username,
                email: input.email,
                password: input.password
            })
            await newUser.save()
            return newUser
        },
        
        loginUser: async (root, { input }) => {
            const user = await User.findOne({ username: input.username })
            if(!user){ return new Error('User Does Not Exist')}
            const password = user.password
            const isMatch = await bcrypt.compare(input.password, password)
            if(!isMatch){ return new Error('Password Does Not Match')}
            const newToken = jwt.sign({
                id: user._id,
                username: user.username,
                email: user.email}, jwtSecret, { expiresIn: '7d'})
            user.jwt = newToken
            await user.save()
            return user
        },
        
        createPoll: async (root, { input }, context ) => {
            let optionsArray = []
            let rawArray = []
            input.options.forEach(op => {
                let obj = {option: op, editor: context.user.username, votes: 0}
                optionsArray.push(obj)
                rawArray.push(op)
            })
            
            let optionsString = rawArray.join(' ')
            
            let newPoll = new Poll({ title: input.title, 
                                     owner: context.user.id,
                                     username: context.user.username,
                                     imageUrl: context.user.imageUrl,
                                     rawOptions: optionsString,
                                     options: optionsArray })
            newPoll.save()
            return newPoll
        },
        
        addVote: async (root, { input }, context) => {
            const poll = await Poll.findById(input.pollId)
            const option = await poll.options.find(op => input.optionId == op._id)
            option.votes++
            await pubsub.publish('voteAdded', { voteAdded: poll, id: input.pollId })
            await poll.save()
            return poll
        },
        
        addOption: async (root, { input }, context) => {
            const poll = await Poll.findById(input.pollId)
            const newOption = { option: input.newOption, editor: context.user.username, votes: 1 }
            poll.options.push(newOption)
            poll.rawOptions = poll.rawOptions.concat(` ${input.newOption}`)
            await pubsub.publish('optionAdded', { optionAdded: poll, id: input.pollId })
            await poll.save()
            return poll
        },
        
        deletePoll: async(root, { id }) => {
            const poll = await Poll.remove({ _id: id })
            return poll
        }
    },
    
    Subscription: {
        
        voteAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('voteAdded'),
                (payload, variables) => {
                    return payload.voteAdded._id == variables.id
                })
        },
        
        optionAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('optionAdded'),
                (payload, variables) => {
                    return payload.optionAdded._id == variables.id
                })
        }
    }
        

}