const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getallplaylists = async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const decoded = await jwt.verify(token, "secretKey"); // Replace 'your_jwt_secret_key' with your actual secret key
    const userId = decoded.userId;
    console.log("userId: ", userId);
    let query = `SELECT * FROM public.playlists where user_id = $1`;
    const result = await db.query(query, [userId]);
    console.log("ahead");
    if (result.rows.length === 0) {
      return res.status(201).json({ message: "No Playlist" });
    }
    const data = result.rows;
    return res.status(201).json({ data });
  } catch (error) {
    res.status(401).send({ error: "Invalid authentication token" });
  }
};

const addNewPlaylist = async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const { name, description } = req.body;
    const decoded = await jwt.verify(token, "secretKey"); // Replace 'your_jwt_secret_key' with your actual secret key
    const userId = decoded.userId;
    console.log("userId: ", userId);
    const insertColumns = ["user_id", "name", "description"];
    const insertValues = [userId, name, description];
    const query = `INSERT INTO public.playlists (${insertColumns.join(
      ", "
    )}) VALUES (${insertValues.map((_, index) => `$${index + 1}`).join(", ")})`;

    await db.query(query, insertValues);
    res.status(201).json({ message: "new playlist added successfully" });
  } catch (error) {
    res.status(401).send({ error: "Internal Server Error" });
  }
};

const getMoviesByPlaylist = async (req, res) => {
  const { playlist_id } = req.body;
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    let query = `SELECT m.imdb_id, m.title, m.year, m.rated, m.image, m.genre, m.language, m.imdb_rating, pm.added_at
    FROM playlistmovies pm
    JOIN movies m ON pm.imdb_id = m.imdb_id
    WHERE pm.playlist_id = $1
    ORDER BY pm.added_at;`;
    const result = await db.query(query, [playlist_id]);
    if (result.rows.length === 0) {
      return res.status(201).json({ message: "No Movies" });
    }
    const data = result.rows;
    return res.status(201).json({ data });
  } catch (error) {
    res.status(401).send({ error: "Internal Server Error" });
  }
};

const addmovietoplaylist = async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const {
      imdb_id,
      playlist_id,
      genre,
      image,
      imdb_rating,
      language,
      rated,
      title,
      year,
    } = req.body;
    const decoded = await jwt.verify(token, "secretKey"); // Replace 'your_jwt_secret_key' with your actual secret key
    const userId = decoded.userId;
    console.log("userId: ", userId);

    let query = `SELECT * FROM public.movies WHERE imdb_id=$1`;
    const isAlreadyInMovies = await db.query(query, [imdb_id]);

    if (isAlreadyInMovies.rows.length === 0) {
      console.log("first if")
      const moviescolumns = [
        "imdb_id",
        "title",
        "year",
        "rated",
        "image",
        "genre",
        "language",
        "imdb_rating",
      ];
      const moviesvalues = [
        imdb_id,
        title,
        year,
        rated,
        image,
        genre,
        language,
        imdb_rating,
      ];
      query = `INSERT INTO public.movies (${moviescolumns.join(
        ", "
      )}) VALUES (${moviesvalues
        .map((_, index) => `$${index + 1}`)
        .join(", ")})`;

      await db.query(query, moviesvalues);

      query = `SELECT * FROM public.playlistmovies WHERE playlist_id=$1 AND imdb_id=$2`
      const isAlreadyInPlaylist = await db.query(query, [playlist_id, imdb_id])

        if(isAlreadyInPlaylist.rows.length === 0){

            const playlistmoviescolumns = ["imdb_id", "playlist_id"];
      const playlistmoviesvalues = [imdb_id, playlist_id];
      query = `INSERT INTO public.playlistmovies (${playlistmoviescolumns.join(
        ", "
      )}) VALUES (${playlistmoviesvalues
        .map((_, index) => `$${index + 1}`)
        .join(", ")})`;

      await db.query(query, playlistmoviesvalues);
        return res.status(201).json({message: `${title} added to the playlist`})
        }
        else{
            return res.status(201).json({message: `${title} is already added to this playlist`})
        }
      
    } else {
        query = `SELECT * FROM public.playlistmovies WHERE playlist_id=$1 AND imdb_id=$2`
        const isAlreadyInPlaylist = await db.query(query, [playlist_id, imdb_id])
      
          if(isAlreadyInPlaylist.rows.length === 0){
              const playlistmoviescolumns = ["imdb_id", "playlist_id"];
        const playlistmoviesvalues = [imdb_id, playlist_id];
        query = `INSERT INTO public.playlistmovies (${playlistmoviescolumns.join(
          ", "
        )}) VALUES (${playlistmoviesvalues
          .map((_, index) => `$${index + 1}`)
          .join(", ")})`;
  
        await db.query(query, playlistmoviesvalues);
          return res.status(201).json({message: `${title} added to the playlist`})
    }
    else{
        return res.status(201).json({message: `${title} is already added to this playlist`})
    }
    }
  } catch (error) {
    res.status(401).send({ error: "Internal Server Error" });
  }
};

module.exports = { getallplaylists, addNewPlaylist, getMoviesByPlaylist, addmovietoplaylist };
