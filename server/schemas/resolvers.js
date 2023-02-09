const { User } = require('../models')
const { signToken } = require('../utils/auth')
const { AuthenticationError } = require('apollo-server-express')



const resolvers = {
    Query: {
        me: async (parent, args, context, info) => {
            await User.findById(args._id).populate('books')
        }
    },

    Mutation: {
        login: async (parent, args, context, info) => {
            const user = await User.findOne(args.email)
            if (!user) {
                throw new AuthenticationError('User not Found')
            }
            const login = await Auth.create(args.email, args.password)
            const isCorrectPassword = await user.isCorrectPassword(ars.password)
            if (!isCorrectPassword){
                throw new AuthenticationError("Wrong Password!")
            }
            const token = signToken(user)
            return(token, user)
        },
        addUser: async (parent, args, context, info) => {
            const user = await User.create(args)
            return user.populate('books')
        },
        saveBook: async (parent, args, context, info) => {
            const book = await Book.create(args)
            if (args.bookId){
                await User.findByIdAndUpdate(args.trainerId, {
                    $addToSet: {
                        book: book._id
                    }
                })
            }
        },
        removeBook: async (parent, args, context, info) => {
            const book = await Book.findByIdAndDelete(args._id)
            console.log(`${book} removed`)
        },
    }
}

module.exports = resolvers