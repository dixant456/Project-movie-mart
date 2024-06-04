const playlistController = require('../controllers/playlistController');
const express = require('express');
const router = express.Router();

router.get('/getallplaylists', playlistController.getallplaylists);
router.post('/addnewplaylist', playlistController.addNewPlaylist);
router.post('/playlistdetails', playlistController.getMoviesByPlaylist);
router.post('/addmovietoplaylist', playlistController.addmovietoplaylist);

module.exports = router;