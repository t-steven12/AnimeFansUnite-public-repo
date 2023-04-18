document.addEventListener('DOMContentLoaded', imInABind);

function imInABind(){

    getTitles();
    populateDropDownForArtists();

    //The following AJAX requests are adapted from code present on the "HTTP and Javascript"(https://canvas.oregonstate.edu/courses/1810876/pages/http-and-javascript?module_item_id=20678211) and
    //  "Asynchronous HTTP Requests"(https://canvas.oregonstate.edu/courses/1810876/pages/asynchronous-http-requests?module_item_id=20678215) pages from the online Spring 2021 CS290 course modules
    //  at Oregon State University.

    //AJAX request to retrieve Titles table
    function getTitles(){
        console.log("AJAX to retrieve Titles table...");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41989/titles", true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var titlesTabBody = document.getElementById("titlesBody");
                for(var i = 0; i < response.length; i++)
                {
                    var row = document.createElement("tr");
                    titlesTabBody.appendChild(row);
                    var titleName = document.createElement("td");
                    titleName.textContent = response[i]["Titles"];
                    row.appendChild(titleName);
                    var artistName = document.createElement("td");
                    if(response[i]["ArtistFName"] === null)
                    {
                        artistName.textContent = "NULL/No Artist";
                    }
                    else if(response[i]["ArtistFName"] != null && response[i]["ArtistLName"] === null)
                    {
                        artistName.textContent = response[i]["ArtistFName"];
                    }
                    else
                    {
                        artistName.textContent = response[i]["ArtistFName"] + " " + response[i]["ArtistLName"];
                    }
                    row.appendChild(artistName);
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(null);
    }

    //AJAX request to populate drop downs with Artists
    function populateDropDownForArtists(){
        console.log("AJAX to retrieve populate drop down with Artists...");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41989/artists", true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var artistsDropDown1 = document.getElementById("artistOptions");
                for(var i = 0; i < response.length; i++)
                {
                    var op = document.createElement("option");
                    var nameString = response[i]["f_name"];
                    if(response[i]["l_name"] != null)
                    {
                        nameString = nameString + " " + response[i]["l_name"];
                    }
                    op.value = nameString;
                    artistsDropDown1.appendChild(op);
                }
                var artistsDropDown2 = document.getElementById("newArtistOptions");
                for(var j = 0; j < response.length; j++)
                {
                    var op2 = document.createElement("option");
                    var nameString2 = response[j]["f_name"];
                    if(response[j]["l_name"] != null)
                    {
                        nameString2 = nameString2 + " " + response[j]["l_name"];
                    }
                    op2.value = nameString2;
                    artistsDropDown2.appendChild(op2);
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(null);
    }

    //AJAX request to insert a user
    document.getElementById('addTitles').addEventListener('click', function(e) {
        console.log("Adding title...");
        var request = new XMLHttpRequest();
        var carePackage = {"title_name": document.getElementById("title").value, "artist": document.getElementById("artistName").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41989/titles", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response[0]);
                var row = document.createElement("tr");
                if(response[0] === undefined)
                {
                    alert("Artist does not exist!\n" + document.getElementById("title").value + "'s artist will be 'NULL/No Artist'.");
                    document.getElementById("titlesBody").appendChild(row);
                    var title = document.createElement("td");
                    title.textContent = document.getElementById("title").value;
                    row.appendChild(title);
                    var artist = document.createElement("td");
                    artist.textContent = "NULL/No Artist";
                    row.appendChild(artist);
                    return;
                }
                document.getElementById("titlesBody").appendChild(row);
                var theTitle = document.createElement("td");
                theTitle.textContent = response[0]["Titles"];
                row.appendChild(theTitle);
                var theArtist = document.createElement("td");
                if(response[0]["Artists"] === null)
                {
                    theArtist.textContent = "Null/No Artist";
                }
                else
                {
                    if(response[0]["ArtistLName"] === null)
                    {
                        theArtist.textContent = response[0]["ArtistFName"];
                    }
                    else
                    {
                        theArtist.textContent = response[0]["ArtistFName"] + " " + response[0]["ArtistLName"];
                    }
                }
                row.appendChild(theArtist);
            }
            else
            {
                alert("Title could not be added!\n" + "Title may already exist!");
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });

    //AJAX request to update the artist of a Title
    document.getElementById("editArtist").addEventListener('click', function(e){
        console.log("AJAX request to title artist...");
        var request = new XMLHttpRequest();
        var carePackage = {"title_name": document.getElementById("titleToEdit").value, "artist_name": document.getElementById("newArtist").value};
        carePackage = JSON.stringify(carePackage);
        console.log(carePackage);
        request.open("PUT", "http://flip3.engr.oregonstate.edu:41989/updateTitlesartist", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function(){
            if(request.status >= 200 && request.status < 400)
            {
                var response = JSON.parse(request.responseText);
                console.log(response[0]);
                var titlesChildNodes = document.getElementById("titlesBody").childNodes;
                if(response[0] === undefined)
                {
                    alert("Artist does not exist!\n" + document.getElementById("titleToEdit").value + "'s artist will be set to 'NULL/No Artist'.");
                    for(var a = 0; a < titlesChildNodes.length; a++)
                    {
                        if(titlesChildNodes[a].childNodes[0].textContent === document.getElementById("titleToEdit").value)
                        {
                            titlesChildNodes[a].childNodes[1].textContent = "NULL/No Artist";
                            break;
                        }
                    }
                    return;
                }
                else if(document.getElementById("newArtist").value === "")
                {
                    console.log("New artist is null!");
                    for(var i = 0; i < titlesChildNodes.length; i++)
                    {
                        if(titlesChildNodes[i].childNodes[0].textContent === response[0]["Title"])
                        {
                            titlesChildNodes[i].childNodes[1].textContent = "NULL/No Artist";
                            break;
                        }
                    }
                }
                else {
                    for (var i = 0; i < titlesChildNodes.length; i++) {
                        if (titlesChildNodes[i].childNodes[0].textContent === response[0]["Title"]) {
                            if (response[0]["artistFName"] === null) {
                                titlesChildNodes[i].childNodes[1].textContent = "NULL/No Artist";
                            } else if (response[0]["artistFName"] != null && response[0]["artistLName"] === null) {
                                titlesChildNodes[i].childNodes[1].textContent = response[0]["artistFName"];
                            } else {
                                titlesChildNodes[i].childNodes[1].textContent = response[0]["artistFName"] + " " + response[0]["artistLName"];
                            }
                            break;
                        }
                    }
                }
            }
            else
            {
                alert("Title artist could not be edited!");
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });
}