const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "music.db"
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if(err){
        console.log(err.message)
        throw err
    }
    else{
        console.log('Connected to the SQlite database.')
    }
})

app.get("/", (req, res) => {
    res.send('hej')
})

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get("/hmm", (req, res) => {
    var sql = `SELECT artist.name, song.songname, artist.id, artist_song.id3, song.id2
    FROM artist
    LEFT JOIN artist_song
    ON artist.id = artist_song.artist_id
    LEFT JOIN song
    ON artist_song.song_id = song.id2
    WHERE songname IS NOT NULL`
    var params = []
    db.all(sql, params, (err, rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    })
})

app.get("/delete/:id/:id2", (req, res, next) => {
    var id = req.params.id
    var id2 = req.params.id2
    console.log(id)
 
    db.run(`DELETE FROM artist_song WHERE id3=?`, id, function(err) {
     if (err) {
       return console.error(err.message);
     }
     db.run(`DELETE FROM song WHERE id2=?`, id2, function(err) {
        if (err) {
          return console.error(err.message);
        }
   
      });
   });
 
    res.json({
      "message":"deleted song "+id
    })
  })

app.post("/add", function(req, res){
    console.log(req.body)
    var artist = req.body.artist;
    var song = req.body.song;
    var id1;
    var id2;


    db.run(`INSERT INTO artist (name) VALUES('${artist}')`, function(err){
        if (err){
            return console.log(err.message);
        }
        id1 = this.lastID;
        console.log(`1 inserted rowId: ${this.lastID}`)
        db.run(`INSERT INTO song (songname) VALUES('${song}')`, function(err){
            if(err){
                return console.log(err.message);
            }
            id2 = this.lastID;
            console.log(`2 inserted rowId: ${this.lastID}`);
            db.run(`INSERT INTO artist_song (artist_id, song_id) VALUES('${id1}', '${id2}')`, function(err){
                if(err){
                    return console.log(err.message);
                }
                console.log(`3 inserted rowId: ${this.lastID}`);
                res.send('hej')
            })
        })
    })

})

app.listen(port, () => console.log(`hmm ${port}`))