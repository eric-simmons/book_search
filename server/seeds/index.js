const connection = require('../config/connection')
const { Book, User } = require('../models')

connection.once('open', async () => {
    await Book.create({
        bookId: 1,
        authors: ["Author1", "Author2", "Author3"],
        description: "Book Description",
        image: "Image String",
        link: "Link String",
        title: "Book Title",
    })

    await User.create({
        username: "User1",
        email: "User1@gmail.com",
        password: "User1password",
        savedBooks: ["Book1","Book2"]
    })
    console.log('seeded')
})
