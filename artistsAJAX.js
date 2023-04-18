document.addEventListener('DOMContentLoaded', imInABind);

function imInABind(){

    getArtists();

    //The following AJAX requests are adapted from code present on the "HTTP and Javascript"(https://canvas.oregonstate.edu/courses/1810876/pages/http-and-javascript?module_item_id=20678211) and
    //  "Asynchronous HTTP Requests"(https://canvas.oregonstate.edu/courses/1810876/pages/asynchronous-http-requests?module_item_id=20678215) pages from the online Spring 2021 CS290 course modules
    //  at Oregon State University.

    //AJAX request to retrieve Artists table
    function getArtists(){
        console.log("AJAX to retrieve Artists table...");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41989/artists", true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var artistsTabBody = document.getElementById("artistsBody");
                for(var i = 0; i < response.length; i++)
                {
                    var row = document.createElement("tr");
                    artistsTabBody.appendChild(row);
                    var id = document.createElement("td");
                    id.textContent = response[i]["artist_id"];
                    row.appendChild(id);
                    var fName = document.createElement("td");
                    fName.textContent = response[i]["f_name"];
                    row.appendChild(fName);
                    var lName = document.createElement("td");
                    if(response[i]["l_name"] === null)
                    {
                        lName.textContent = "N/A";
                        row.appendChild(lName);
                    }
                    else {
                        lName.textContent = response[i]["l_name"];
                        row.appendChild(lName);
                    }
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(null);
    }

    //AJAX request to add a new Artist
    document.getElementById('addArtists').addEventListener('click', function(e) {
        if(document.getElementById("fname").value === "")
        {
            alert("Please fill out first name field!");
            e.preventDefault();
            return;
        }
        console.log("Adding artist...");
        var request = new XMLHttpRequest();
        var carePackage = {"f_name": document.getElementById("fname").value, "l_name": document.getElementById("lname").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41989/artists", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response[0]);
                var row = document.createElement("tr");
                document.getElementById("artistsBody").appendChild(row);
                var artistId = document.createElement("td");
                artistId.textContent = response[0]["artist_id"];
                row.appendChild(artistId);
                var fName = document.createElement("td");
                fName.textContent = response[0]["f_name"];
                row.appendChild(fName);
                var lName = document.createElement("td");
                if(response[0]["l_name"] === null)
                {
                    lName.textContent = "N/A";
                    row.appendChild(lName);
                }
                else
                {
                    lName.textContent = response[0]["l_name"];
                    row.appendChild(lName);
                }
            }
            else
            {
                alert("Artist could not be added!");
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });
}