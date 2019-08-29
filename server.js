const express = require('express')
const app = express()
const port = 8000

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

app.get("/throwers", (req, res) => {
    var sql = `SELECT * FROM thrower`
    var                                                                                                                                                                                           params = []
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

app.get("/hole", (req, res) => {
    var sql = `SELECT * FROM hole`
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


app.get("/hmm", (req, res) => {
    var sql = `SELECT artist.name, song.songname
    FROM artist
    LEFT JOIN artist_song
    ON artist.id = artist_song.artist_id
    LEFT JOIN song
    ON artist_song.song_id = song.id`
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

app.post("/add", function(req, res){

})

app.listen(port, () => console.log(`hmm ${port}`))