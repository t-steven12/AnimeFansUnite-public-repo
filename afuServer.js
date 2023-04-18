
//The following boilerplate code is based on the helloMysql.js and helloSessions.js boilerplate code from Justin Wolford's "CS290-Server-Side-Examples" @ https://github.com/wolfordj/CS290-Server-Side-Examples/tree/master/express-mysql AND https://github.com/wolfordj/CS290-Server-Side-Examples/tree/master/express-sessions
var mysql = require('./dbcon.js');
var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.set('port', 41989);

//The following app.get, app.post, app.put, and app.delete handlers are adapted from the handlers in the helloMysql.js from Justin Wolford's "CS290-Server-Side-Examples" @ https://github.com/wolfordj/CS290-Server-Side-Examples/blob/master/express-mysql/helloMysql.js
//Additionally, any handlers with nested pool queries are adapted from Derth Adams's answer on Ed for CS290 @ https://edstem.org/us/courses/5175/discussion/477454

//Returns all Users rows
app.get('/users',function(req,res,next){
    console.log("Server: retrieving Users table...");
    var backToRequest;
    mysql.pool.query('SELECT * FROM Users', function(err, rows){
        if(err){
            next(err);
            return;
        }
        console.log(rows);
        backToRequest = JSON.stringify(rows);
        res.send(backToRequest);
    });
});

//Returns all Artists rows
app.get('/artists',function(req,res,next){
    console.log("Server: Artists table...");
    var backToRequest;
    mysql.pool.query('SELECT * FROM Artists', function(err,rows){
       if(err){
           next(err);
           return;
       }
       console.log(rows);
       backToRequest = JSON.stringify(rows);
       res.send(backToRequest);
    });
});

//Returns all Titles rows with the name of their associated Artists
app.get('/titles',function(req,res,next){
    console.log("Server: getting Titles table...");
    var backToRequest;
    mysql.pool.query("SELECT Titles.title_name AS Titles, Artists.f_name AS ArtistFName, Artists.l_name AS ArtistLName FROM Titles LEFT JOIN Artists ON Titles.artist = Artists.artist_id ORDER BY Titles ASC", function(err,rows){
        if(err){
            next(err);
            return;
        }
        //console.log(rows);
        backToRequest = JSON.stringify(rows);
        res.send(backToRequest);
    });
});

//Returns all Anime rows with their associated Titles, Artists, and the anime's air_date
app.get('/animes',function(req,res,next){
    console.log("Server: getting Animes table...");
    var backToRequest;
    mysql.pool.query("SELECT Animes.anime_id AS AnimeID, Titles.title_name AS Title, Artists.f_name AS ArtistFName, Artists.l_name AS ArtistLName, Animes.air_date AS AirDate FROM Animes JOIN Titles ON Animes.title = Titles.title_name LEFT JOIN Artists ON Titles.artist = Artists.artist_id ORDER BY AnimeID ASC", function(err,rows){
        if(err){
            next(err);
            return;
        }
        backToRequest = JSON.stringify(rows);
        res.send(backToRequest);
    });
});

//Returns a specified User's favorite Animes along with the title_name of the Anime.
app.post('/fav_animes',function(req,res,next){
    console.log("Server: getting user's favorite animes...");
    var backToRequest;
    mysql.pool.query("SELECT Fav_animes.user_id AS UserID, Fav_animes.anime_id AS AnimeID, Titles.title_name AS AnimeTitle, Animes.air_date FROM Fav_animes JOIN Animes ON Fav_animes.anime_id = Animes.anime_id JOIN Titles ON Animes.title = Titles.title_name WHERE Fav_animes.user_id = ? ORDER BY AnimeTitle ASC", [req.body.userId], function(err,rows){
        if(err){
            next(err);
            return;
        }
        backToRequest = JSON.stringify(rows);
        res.send(backToRequest);
    });
});

//Favorite an Anime for a User(insertion into the Fav_animes table)
app.post('/favoritingAnime',function(req,res,next){
    console.log("Server: favoriting an anime for user...");
    var backToRequest;
    mysql.pool.query("INSERT INTO Fav_animes (user_id, anime_id) VALUES (?,?)", [req.body.uId, req.body.aId], function(err,result){
        if(err){
            next(err);
            return;
        }
        console.log("ID: " + result.insertId);
        mysql.pool.query("SELECT Fav_animes.user_id AS UserID, Fav_animes.anime_id AS AnimeID, Animes.title AS AnimeTitle FROM Fav_animes JOIN Animes ON Fav_animes.anime_id = Animes.anime_id WHERE Fav_animes.user_id=? AND Fav_animes.anime_id=?", [req.body.uId, req.body.aId], function(err, row){
            backToRequest = JSON.stringify(row);
            console.log(backToRequest);
            res.send(backToRequest);
        });
    });
});

//Adds a new Anime
app.post('/animes',function(req,res,next){
    console.log("Server: inserting new anime...");
    var backToRequest;
    mysql.pool.query("INSERT INTO Animes (title, air_date) VALUES (?,?)", [req.body.title, req.body.air_date], function(err,result){
        if(err){
            next(err);
            return;
        }
        var insertedId = result.insertId;
        console.log(result.insertId);
        mysql.pool.query("SELECT Animes.anime_id AS AnimeID, Animes.air_date AS AirDate, Titles.title_name AS Title, Artists.f_name AS artistFName, Artists.l_name AS artistLName FROM Animes JOIN Titles ON Animes.title = Titles.title_name LEFT JOIN Artists ON Titles.artist = Artists.artist_id WHERE Animes.anime_id=?", [insertedId], function(err,row){
            if(err){
                next(err);
                return;
            }
            backToRequest = JSON.stringify(row);
            console.log(backToRequest);
            res.send(backToRequest);
        });
    });
});

//Adds a new Title
app.post('/titles',function(req,res,next){
    console.log("Server: inserting new title...");
    var backToRequest;
    console.log(req.body.title_name);
    console.log(req.body.artist);
    console.log(req.body);
    if(req.body.artist === '') {
        mysql.pool.query("INSERT INTO Titles (title_name, artist) VALUES (?, NULL)", [req.body.title_name], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            mysql.pool.query("SELECT Titles.title_name AS Titles, Titles.artist AS Artists FROM Titles WHERE Titles.title_name=?", [req.body.title_name], function (err, row) {
                if (err) {
                    next(err);
                    return;
                }
                backToRequest = JSON.stringify(row);
                console.log(backToRequest);
                res.send(backToRequest);
            });
        });
    }
    else
    {
        console.log("You are in the else-statement.");
        mysql.pool.query("INSERT INTO Titles (title_name, artist) VALUES (?, (SELECT artist_id FROM Artists WHERE CONCAT(Artists.f_name, ' ', Artists.l_name)=? OR Artists.f_name=?))", [req.body.title_name, req.body.artist, req.body.artist], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            mysql.pool.query("SELECT Titles.title_name AS Titles, Artists.f_name AS ArtistFName, Artists.l_name AS ArtistLName FROM Titles JOIN Artists ON Titles.artist = Artists.artist_id  WHERE Titles.title_name=?", [req.body.title_name], function (err, row) {
                if (err) {
                    next(err);
                    return;
                }
                backToRequest = JSON.stringify(row);
                console.log(backToRequest);
                res.send(backToRequest);
            });
        });
    }
});

//Adds a new User
app.post('/users',function(req,res,next){
   console.log("Server: inserting new user...");
   var backToRequest;
   mysql.pool.query('INSERT INTO Users (f_name, l_name) VALUES (?, ?)', [req.body.f_name, req.body.l_name], function(err, result){
       if(err){
           next(err);
           return;
       }
       var idFromInsert = result.insertId;
       mysql.pool.query('SELECT * FROM Users WHERE user_id=?', [idFromInsert], function(err, row){
           if(err){
               next(err);
               return;
           }
           backToRequest = JSON.stringify(row);
           console.log(backToRequest);
           res.send(backToRequest);
       });
   });
});

//Adds a new Artist
app.post('/artists',function(req,res,next){
    console.log("Server: inserting new artist...");
    var backToRequest;
    if(req.body.l_name === '')
    {
        mysql.pool.query('INSERT INTO Artists (f_name, l_name) VALUES (?,NULL)', [req.body.f_name], function(err,result){
            if(err){
                next(err);
                return;
            }
            var idFromInsert = result.insertId;
            mysql.pool.query('SELECT * FROM Artists WHERE artist_id=?', [idFromInsert], function(err, row){
                if(err){
                    next(err);
                    return;
                }
                backToRequest = JSON.stringify(row);
                console.log(backToRequest);
                res.send(backToRequest);
            });
        });
    }
    else {
        mysql.pool.query('INSERT INTO Artists (f_name, l_name) VALUES (?,?)', [req.body.f_name, req.body.l_name], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            var idFromInsert = result.insertId;
            mysql.pool.query('SELECT * FROM Artists WHERE artist_id=?', [idFromInsert], function (err, row) {
                if (err) {
                    next(err);
                    return;
                }
                backToRequest = JSON.stringify(row);
                console.log(backToRequest);
                res.send(backToRequest);
            });
        });
    }
});

//Updates the Artist of a Title
app.put('/updateTitlesartist',function(req,res,next){
    console.log("Server: Updating title artist...");
    var backToRequest;
    console.log(req.body.artist_name);
    mysql.pool.query("UPDATE Titles SET artist = (SELECT artist_id FROM Artists WHERE CONCAT(Artists.f_name, ' ', Artists.l_name) = ? OR Artists.f_name = ?) WHERE title_name = ?", [req.body.artist_name, req.body.artist_name, req.body.title_name], function(err,result){
        if(err){
            next(err);
            return;
        }
        if(req.body.artist_name === "")
        {
            mysql.pool.query('SELECT Titles.title_name AS Title, Titles.artist AS Artist FROM Titles WHERE Titles.title_name=?', [req.body.title_name], function(err,row){
                if(err){
                    next(err);
                    return;
                }
                backToRequest = JSON.stringify(row);
                console.log(backToRequest);
                res.send(backToRequest);
            })
        }
        else {
            mysql.pool.query('SELECT Titles.title_name AS Title, Artists.f_name AS artistFName, Artists.l_name AS artistLName FROM Titles JOIN Artists ON Titles.artist = Artists.artist_id  WHERE Titles.title_name=?', [req.body.title_name], function (err, row) {
                if (err) {
                    next(err);
                    return;
                }
                backToRequest = JSON.stringify(row);
                console.log(backToRequest);
                res.send(backToRequest);
            });
        }
    });
});

//Deletes a User
app.delete('/delUsers',function(req,res,next){
    console.log("Server: Deleting user...");
    var backToRequest;
    mysql.pool.query("DELETE FROM Users WHERE user_id=?", [req.body.user_id], function(err, result){
        if(err) {
            next(err);
            return;
        }
        backToRequest = {"user_id": req.body.user_id};
        backToRequest = JSON.stringify(backToRequest);
        console.log(backToRequest);
        res.send(backToRequest);
    });
});

//The following app.listen is based on the app.listen in the helloMysql.js from Justin Wolford's "CS290-Server-Side-Examples" @ https://github.com/wolfordj/CS290-Server-Side-Examples/blob/master/express-mysql/helloMysql.js
app.listen(app.get('port'), function(){
    console.log('Server online @ http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});


