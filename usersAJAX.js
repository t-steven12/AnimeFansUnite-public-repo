document.addEventListener('DOMContentLoaded', imInABind);

function imInABind() {

    getOverHere();

    //The following AJAX requests are adapted from code present on the "HTTP and Javascript"(https://canvas.oregonstate.edu/courses/1810876/pages/http-and-javascript?module_item_id=20678211) and
    //  "Asynchronous HTTP Requests"(https://canvas.oregonstate.edu/courses/1810876/pages/asynchronous-http-requests?module_item_id=20678215) pages from the online Spring 2021 CS290 course modules
    //  at Oregon State University.

    //AJAX request to retrieve Users table
    function getOverHere(){
        console.log("AJAX to retrieve table");
        var request = new XMLHttpRequest();
        request.open("GET", "http://flip3.engr.oregonstate.edu:41989/users", true);
        request.addEventListener('load', function() {
            if(request.status>= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var usersTabBody = document.getElementById("usersBody");
                for(var i = 0; i < response.length; i++)
                {
                    var row = document.createElement("tr");
                    usersTabBody.appendChild(row);
                    var id = document.createElement("td");
                    id.textContent = response[i]["user_id"];
                    row.appendChild(id);
                    var fName = document.createElement("td");
                    fName.textContent = response[i]["f_name"];
                    row.appendChild(fName);
                    var lName = document.createElement("td");
                    lName.textContent = response[i]["l_name"];
                    row.append(lName);
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
    document.getElementById('addUser').addEventListener('click', function(e) {
        console.log("Adding user...");
        if(document.getElementById("firstName").value === "" || document.getElementById("lastName").value === "")
        {
            alert("Please fill out first name and/or last name fields!");
            e.preventDefault();
            return;
        }
        var request = new XMLHttpRequest();
        var carePackage = {"f_name": document.getElementById("firstName").value, "l_name": document.getElementById("lastName").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("POST","http://flip3.engr.oregonstate.edu:41989/users", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response[0]);
                var row = document.createElement("tr");
                document.getElementById("usersBody").appendChild(row);
                var userId = document.createElement("td");
                userId.textContent = response[0]["user_id"];
                row.appendChild(userId);
                var fName = document.createElement("td");
                fName.textContent = response[0]["f_name"];
                row.appendChild(fName);
                var lName = document.createElement("td");
                lName.textContent = response[0]["l_name"];
                row.appendChild(lName);
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });

    //AJAX to delete user
    document.getElementById('delUser').addEventListener('click', function(e) {
        console.log("AJAX to delete user...");
        var request = new XMLHttpRequest();
        var carePackage = {"user_id": document.getElementById("u_id").value}
        console.log(carePackage);
        carePackage = JSON.stringify(carePackage);
        request.open("DELETE","http://flip3.engr.oregonstate.edu:41989/delUsers", true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function() {
            if(request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                console.log(response);
                var usersBody = document.getElementById("usersBody");
                var usersBodyRows = usersBody.childNodes;
                console.log(usersBodyRows);
                for(var i = 1; i < usersBodyRows.length; i++)
                {
                    console.log(usersBodyRows[i].firstChild.textContent);
                    if(usersBodyRows[i].firstChild.textContent == response.user_id)
                    {
                        usersBodyRows[i].remove();
                        break;
                    }
                }
            }
            else
            {
                console.log("Error: " + request.statusText);
            }
        });
        request.send(carePackage);
        e.preventDefault();
    });
}