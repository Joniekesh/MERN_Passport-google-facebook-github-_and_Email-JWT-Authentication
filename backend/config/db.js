const mongoose = require('mongoose')

const connectDB = async() => {
    try {
       const conn = await mongoose.connect(process.env.MONGO_URI, {
           useNewUrlParser: true,
           useUnifiedTopology: true
       }) 
       console.log(`MongoDB connection SUCCESS: ${conn.connection.host}`)
    } catch (err) {
        console.log('MongoDB connection FAIL')
        console.error(err.message)
        process.exit(1)
        
    }
}

module.exports = connectDB