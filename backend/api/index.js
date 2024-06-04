const express = require('express')
const app = express()
const PORT = 5000
// const movie = require('./movie')
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes)
app.use('/playlist', playlistRoutes)

app.listen(PORT, () => {console.log(`server is running on ${PORT}`)});

// app.use('/home', movie.getHello)
// app.use('/hi', movie.getHiii)



