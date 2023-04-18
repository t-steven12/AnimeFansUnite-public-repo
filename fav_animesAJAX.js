document.addEventListener('DOMContentLoaded', imInABind);

function imInABind(){

    getOverHere();
    getAnimes();

    //The following AJAX requests are adapted from code present on the "HTTP and Javascript"(https://canvas.oregonstate.edu/courses/1810876/pages/http-and-javascript?module_item_id=20678211) and
    //  "Asynchronous HTTP Requests"(https://canvas.oregonstate.edu/courses/1810876/pages/asynchronous-http-requests?module_item_id=20678215) pages from the online Spring 2021 CS290 course modules
    //  at Oregon State University.


    //AJAX request to view user's favorite animes
    document.getElementById('viewFavs').addEventListener('click', function(e) {
        console.log("AJAX to view user's favorite animes...");
        var request = new XMLHttpRequest();
        var carePackage = {"userId": document.getElementById("userId").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41989/fav_animes", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                if(response.length === 0)
                {
                    alert("No user with the given user ID found.");
                }
                var favAnimesTabBody = document.getElementById("userFavAnimes");
                while(favAnimesTabBody.childNodes.length > 0){
                    //Removal of first child of favAnimesTabBody based on code at W3Schools's removeChild() page: https://www.w3schools.com/jsref/met_node_removechild.asp
                    favAnimesTabBody.removeChild(favAnimesTabBody.childNodes[0]);
                }
                for(var i = 0; i < response.length; i++)
                {
                    var row = document.createElement("tr");
                    favAnimesTabBody.appendChild(row);
                    var userId = document.createElement("td");
                    userId.textContent = response[i]["UserID"];
                    row.appendChild(userId);
                    var animeId = document.createElement("td");
                    animeId.textContent = response[i]["AnimeID"];
                    row.appendChild(animeId);
                    var title = document.createElement("td");
                    title.textContent = response[i]["AnimeTitle"];
                    row.appendChild(title);
                    var airDate = document.createElement("td");
                    airDate.textContent = response[i]["air_date"].slice(0, 10);
                    row.appendChild(airDate);
                }
            }
            else
            {
                alert("User not found!");
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });

    //AJAX request to favorite an anime
    document.getElementById('favoriteAnAnime').addEventListener('click', function(e) {
        console.log("AJAX to favorite an anime...");
        var request = new XMLHttpRequest();
        var carePackage = {"uId": document.getElementById("userIdFav").value, "aId": document.getElementById("animeIdToFav").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41989/favoritingAnime", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response[0]);
                var uId = response[0]["UserID"];
                var aId = response[0]["AnimeID"];
                var animeTitle = response[0]["AnimeTitle"];
                alert("UserID: " + uId + "\n\n" + "Successfully favorited...\n" + "Anime ID: " + aId + "\n" + "Anime Title: " + animeTitle +"\n\nEnter the User ID in 'View a User's Favorite Animes' and submit to see updated list.");
            }
            else
            {
                alert("Anime could not be favorited!\nAnime may already be favorited, or User/Anime may not exist!");
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });

    //AJAX request to populate dropdown for Users
    function getOverHere(){
        console.log("AJAX to retrieve table");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41989/users", true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var userList1 = document.getElementById("uIdList1");
                var userList2 = document.getElementById("uIdList2");
                for(var i = 0; i < response.length; i++)
                {
                    var newUserOption1 = document.createElement("option");
                    userList1.appendChild(newUserOption1);
                    newUserOption1.value = response[i]["user_id"];
                    newUserOption1.textContent = response[i]["f_name"] + " " + response[i]["l_name"];
                    var newUserOption2 = document.createElement("option");
                    userList2.appendChild(newUserOption2);
                    newUserOption2.value = response[i]["user_id"];
                    newUserOption2.textContent = response[i]["f_name"] + " " + response[i]["l_name"];
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(null);
    }

    //AJAX request to populate dropdown for Animes
    function getAnimes(){
        console.log("AJAX to retrieve Animes table");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41989/animes", true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var animeIdList = document.getElementById("animeIdList");
                for(var i = 0; i < response.length; i++)
                {
                    var newAnimeIdOption = document.createElement("option");
                    document.getElementById("animeIdList").appendChild(newAnimeIdOption);
                    newAnimeIdOption.value = response[i]["AnimeID"];
                    newAnimeIdOption.textContent = "Title: " + response[i]["Title"] + "; " + "Air Date: " + response[i]["AirDate"].slice(0,10);
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(null);
    }
}