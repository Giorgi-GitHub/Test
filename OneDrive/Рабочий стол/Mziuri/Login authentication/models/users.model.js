const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://giorgi:IeVQvr2ZQanakY2L@database.rwhxbfe.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(() => {
    console.log('Connected to mongoose');
})
.catch((error) => {
    console.log('Error connecting to mongoose', error);
});

const UserSchema = new mongoose.Schema({
    username: String,
    surname: String,
    email: String,
    password: String
  });
  
  const User =  mongoose.model("users", UserSchema);
  
  module.exports = User;
