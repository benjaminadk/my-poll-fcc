import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'

const typeDefs = `

type Option {
    id: ID
    option: String
    editor: String
    votes: Int
}

type Poll {
    id: ID
    owner: String
    imageUrl: String
    username: String
    title: String
    rawOptions: String
    options: [Option]
}

type User {
    id: ID
    username: String
    email: String
    password: String
    imageUrl: String
    facebookId: String
    jwt: String
    createdOn: String
}

input UserInput {
    username: String
    email: String
    password: String
}

input LoginInput {
    username: String
    password: String
}

input PollInput {
    title: String
    options: [String]
}

input VoteInput {
    pollId: ID
    optionId: ID
}

input PollFilter {
    OR: [PollFilter!]
    title_contains: String
    option_contains: String
}

input OptionInput {
    pollId: ID
    newOption: String
}

type Query {
    allUsers: [User]
    userById(id: ID!): User
    facebookUser(facebookId: String!): User
    pollById(id: ID!): Poll
    allPolls(filter: PollFilter, skip: Int, first: Int): [Poll]
    myPolls: [Poll]
}

type Mutation {
    createUser(input: UserInput!): User
    loginUser(input: LoginInput!): User
    createPoll(input: PollInput!): Poll
    addVote(input: VoteInput!): Poll
    addOption(input: OptionInput!): Poll
    deletePoll(id: ID!): Poll
}

type Subscription {
    voteAdded(id: ID!): Poll
    optionAdded(id: ID!): Poll
}

`

const schema = makeExecutableSchema({ typeDefs, resolvers })
export { schema }