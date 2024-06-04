const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Signup = async (req, res) => {
    try {
        const { name, username, password, email } = req.body;
    
        const existingUser = await db.query('SELECT * FROM public.users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        const existingUserName = await db.query('SELECT * FROM public.users WHERE username = $1', [username]);
        if(existingUserName.rows.length > 0) {
            return res.status(400).json({message: 'Username already taken'});
        }

        bcrypt.genSalt(10, async (err, salt) => {
          if (err) {
            throw err;
          }
          bcrypt.hash(password, salt, async (err, hashedPassword) => {
            if (err) {
              throw err;
            }
    
            // Store user data in the database
            const query = `
              INSERT INTO public.users (name, username, password, email) 
              VALUES ($1, $2, $3, $4)
            `;
            await db.query(query, [name, username, hashedPassword, email]);
           

            res.status(201).json({ message: "User created successfully"});
          });
        });
    
      } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Internal Server error" });
      }
}

const Login = async (req, res ) => {
    try{
        const { username, password } = req.body;
        const query = `SELECT * FROM public.users where username = $1`;
        const result = await db.query(query, [username]);
       
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        
        const IsPasswordValid = await bcrypt.compare(password, user.password);
    
        if(!IsPasswordValid){
            return res.status(404).json({message: 'Invalid credentials'});
        }
        const token = await jwt.sign({ userId: user.id, userName: user.username }, process.env.SECRET_KEY || "secretKey", {
            expiresIn: '23h',
        });
        
        res.status(200).json({ message: 'Login successful', token });
    
       } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }

  const profile = async (req, res) => {
    try{
      const token = req.header("Authorization").replace("Bearer ", "");
        if(!token){
           return  res.status(401).json({ message: 'Authorization token is missing '});
        }
        const SECRET_KEY = "secretKey";
        const decodedToken = await jwt.verify(token, SECRET_KEY);
        const userID = decodedToken.userId;
    
        const query = `SELECT username, name, email FROM public.users WHERE id = $1`;
    
        const result = await db.query(query, [userID])
        
        if(result.rows.length === 0){
            return res.status(404).json({ message: 'User not found!'})
        }
    
        const userProfile = result.rows[0];
    
        res.status(200).json(userProfile)
    }
    catch(error){
        console.log("error in fetching user profile: ",error);
        res.status(500).json({message: 'Internal Server Error'});
    }
  
  }

  const verifytoken =  async (req, res) => {
    const token = req.header("Authorization").replace("Bearer ", "");
  
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }
  
    jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY || "secretKey", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        // next();
        return res.status(200).json({message: "logged in"})
    });
  }
  

module.exports = { Signup, Login, profile, verifytoken }