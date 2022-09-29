const mongoose = require('mongoose')


 const connnectDB = (url) => {
    mongoose.connect(url)
}

module.exports = connnectDB