const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const server = express();
server.use(cors());
server.use(bodyParser.json());

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/register');
  console.log('Connected to MongoDB');
}

const registerSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  password1: String,
});

const bookingSchema = new mongoose.Schema({
  flightId: String,
  date: String,
  email: String,
  
});

const Register = mongoose.model('Register', registerSchema);
const Booking = mongoose.model('Booking', bookingSchema);

server.use(bodyParser.urlencoded({ extended: false }));

main().catch((err) => console.log(err));

server.post('/register', async (req, res) => {
  let register = new Register();
  register.username = req.body.username;
  register.email = req.body.email;
  register.password = req.body.password;
  register.password1 = req.body.password1;

  const doc = await register.save();

  console.log(doc);
  res.json(doc);
});

server.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the database
    const user = await Register.findOne({ email });

    if (user) {
      // Compare the entered password with the password stored in the database
      if (password === user.password) {
        // Passwords match, login successful
        res.status(200).json('Login successful');
      } else {
        // Invalid password
        res.status(401).json('Invalid password');
      }
    } else {
      // User not found
      res.status(404).json('User not found');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

server.post('/bookings', async (req, res) => {
const { flightId, date, email } = req.body;

  try {
    // Create a new booking
    const booking = new Booking({
      flightId,
      date,
      email,
      
    });

    // Save the booking to the database
    const savedBooking = await booking.save();

    res.status(200).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

server.get('/register/:mydata', async(req,res)=>{
    // res.send("hello");
    try{
    const data = req.params.mydata;
    // res.send(data);
    let user= await Register.findOne({email:data});
    res.send(user);
    }
    catch(error){
      res.status(500).json({error: 'Something went Wrong!'});
    }
  })
  server.get('/bookings/:mydata', async(req,res)=>{
    try{
    const data = req.params.mydata;
    let user= await Booking.findOne({email:data});
    res.json(user);
    }
    catch(error){
      res.status(500).json({error: 'Something went Wrong!'});
    }
  })
server.listen(8080, () => {
  console.log('Server started');
});




// const express = require('express');
// const cors=require('cors');
// const bodyParser=require('body-parser');
// const bcrypt = require('bcrypt');

// const mongoose=require('mongoose');
// const server = express();
// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/register');
//     console.log('db connected')
//   }
  
  
//   const registerSchema = new mongoose.Schema({
//       username: String,
//       email: String,
//       password: String,
//       password1: String
      
//     });

// const Register = mongoose.model('Register', registerSchema);
// server.use(bodyParser.urlencoded({ extended: false }));


// server.use(cors());
// server.use(bodyParser.json());

// main().catch(err => console.log(err));



// server.post('/register', async (req,res)=>{

//     let register=new Register();
//     register.username=req.body.username;
//     register.email=req.body.email;
//     register.password = req.body.password;
//     register.password1=req.body.password1;
    

//     const doc = await register.save();
    

//     console.log(doc)
//     res.json(doc);
// })

// server.post('/login', async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       // Check if user exists in the database
//       const user = await Register.findOne({ email });
  
//       if (user) {
//         // Compare the entered password with the password stored in the database
//         if (password === user.password) {
//           // Passwords match, login successful
//           res.status(200).json("Login successful");
//         } else {
//           // Invalid password
//           res.status(400).json("Invalid password");
//         }
//       } else {
//         // User not found
//         res.status(400).json("User not found");
//       }
  
//       // Close the MongoDB connection
      
//       console.log('Disconnected from MongoDB');
//     } catch (error) {
//       console.error('Error during login:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
// server.listen(8080, ()=>{
//     console.log('server started')
// })