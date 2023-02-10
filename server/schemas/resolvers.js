const { User } = require('../models')
const { signToken } = require('../utils/auth')
const { AuthenticationError } = require('apollo-server-express')

const resolvers = {
    Query: {
        me: async (parent, args, context, info) => {
            return await User.findOne({ _id: context.user._id })
        }
    },

    Mutation: {
        login: async (parent, args, context, info) => {
            const user = await User.findOne(args.email)
            if (!user) {
                throw new AuthenticationError('User not Found')
            }
            const isCorrectPassword = await user.isCorrectPassword(args.password)
            if (!isCorrectPassword) {
                throw new AuthenticationError("Wrong Password!")
            }
            const token = signToken(user)
            return { token, user }
        },
        addUser: async (parent, args, context, info) => {
            // const user = await (await User.create(args)).populate('books') ??
            const user = await User.create(args)
            console.log(user)
            const token = signToken(user)
            return { token, user }
        },
        saveBook: async (parent, { bookData }, context, info) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user_id },
                    { $addToSet: { savedBooks: bookData } },
                    { new: true }
                )
                return user
            }
        },
        removeBook: async (parent, args, context, info) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user_id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                )
                return user
            }
        },
    }
}

module.exports = resolvers