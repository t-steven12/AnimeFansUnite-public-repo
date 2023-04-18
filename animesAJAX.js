document.addEventListener('DOMContentLoaded', imInABind);

function imInABind() {

    getAnimes();
    getTitles();

    //The following AJAX requests are adapted from code present on the "HTTP and Javascript"(https://canvas.oregonstate.edu/courses/1810876/pages/http-and-javascript?module_item_id=20678211) and
    //  "Asynchronous HTTP Requests"(https://canvas.oregonstate.edu/courses/1810876/pages/asynchronous-http-requests?module_item_id=20678215) pages from the online Spring 2021 CS290 course modules
    //  at Oregon State University.

    //AJAX request to retrieve table
    function getAnimes(){
        console.log("AJAX to retrieve Animes table");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41989/animes", true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var animeList = document.getElementById("animeList");
                for(var i = 0; i < response.length; i++)
                {
                    var row = document.createElement("tr");
                    document.getElementById("animeList").appendChild(row);
                    var id = document.createElement("td");
                    id.textContent = response[i]["AnimeID"];
                    row.appendChild(id);
                    var title = document.createElement("td");
                    title.textContent = response[i]["Title"];
                    row.appendChild(title);
                    var artist = document.createElement("td");
                    if(response[i]["ArtistFName"] === null)
                    {
                        artist.textContent = "NULL/No Artist";
                    }
                    else if(response[i]["ArtistFName"] != null && response[i]["ArtistLName"] === null)
                    {
                        artist.textContent = response[i]["ArtistFName"];
                    }
                    else
                    {
                        artist.textContent = response[i]["ArtistFName"] + " " + response[i]["ArtistLName"];
                    }
                    row.appendChild(artist);
                    var airDate = document.createElement("td");
                    airDate.textContent = response[i]["AirDate"];
                    airDate.textContent = airDate.textContent.slice(0, 10);
                    row.appendChild(airDate);
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(null);
    }

    //AJAX request for to populate dropdown with Titles
    function getTitles(){
        console.log("AJAX to retrieve Titles table...");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41989/titles", true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var titlesDropDown = document.getElementById("titleOptions");
                for(var i = 0; i < response.length; i++)
                {
                    var newTitleOption = document.createElement("option");
                    newTitleOption.value = response[i]["Titles"];
                    titlesDropDown.appendChild(newTitleOption);
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(null);
    }

    //AJAX request to add an Anime
    document.getElementById('addAnime').addEventListener('click', function(e) {
        console.log("Adding anime...");
        var request = new XMLHttpRequest();
        console.log(document.getElementById("airDate").value);
        var carePackage = {"title": document.getElementById("titlesList").value, "air_date": document.getElementById("airDate").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41989/animes", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response[0]);
                var row = document.createElement("tr");
                document.getElementById("animeList").appendChild(row);
                var id = document.createElement("td");
                id.textContent = response[0]["AnimeID"];
                row.appendChild(id);
                var title = document.createElement("td");
                title.textContent = response[0]["Title"];
                row.appendChild(title);
                var artist = document.createElement("td");
                if(response[0]["artistFName"] === null)
                {
                    artist.textContent = "NULL/No Artist";
                }
                else if(response[0]["artistFName"] != null && response[0]["artistLName"] === null)
                {
                    artist.textContent = response[0]["artistFName"];
                }
                else
                {
                    artist.textContent = response[0]["artistFName"] + " " + response[0]["artistLName"];
                }
                row.appendChild(artist);
                var airDate = document.createElement("td");
                airDate.textContent = response[0]["AirDate"];
                airDate.textContent = airDate.textContent.slice(0, 10);
                row.appendChild(airDate);
            }
            else
            {
                alert("Title may not exist, Air Date not entered, or Anime already exists!");
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });
}