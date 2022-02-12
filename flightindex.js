var jwt = localStorage.getItem("jwt");
if (jwt == null) {
  window.location.href = './login.html'
}

function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("id");
    window.location.href = './login.html'
  }

function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://flightlog-backend.herokuapp.com/flightLog");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization","Bearer "+jwt);
    xhttp.send();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        for (let object of objects) {
          trHTML += '<tr>'; 
          trHTML += '<td>'+object['_id']+'</td>';
          trHTML += '<td>'+object['tailNumber']+'</td>';
          trHTML += '<td>'+object['flightID']+'</td>';
          trHTML += '<td>'+moment(object['takeoff']).format("DD MMM YYYY, HH:mm:ss")+'</td>';
          trHTML += '<td>'+moment(object['landing']).format("DD MMM YYYY, HH:mm:ss")+'</td>';
          trHTML += '<td>'+object['duration']+'</td>';
          trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showEditLog(\''+object['_id']+'\')">Edit</button>';
          trHTML += '<button type="button" class="btn btn-outline-danger" onclick="logDelete(\''+object['_id']+'\')">Del</button></td>';
          trHTML += "</tr>";
        };
        document.getElementById("mytable").innerHTML = trHTML;
      };
    };
  }

  loadTable();
  
  function showCreateBox() {
    Swal.fire({
      title: 'Create Flight Log',
      html:
        '<input id="id" type="hidden">' +
        '<input id="tailNumber" class="swal2-input" placeholder="Tail Number">' +
        '<input id="flightID" class="swal2-input" placeholder="Flight ID">' +
        '<input id="takeoff" class="swal2-input" type="datetime-local" min="1994-01-01T00:00:00">' +
        '<input id="landing" class="swal2-input" type="datetime-local" min="1994-01-01T00:00:00">'+
        '<input id="duration" class="swal2-input" placeholder="duration">',
      focusConfirm: false,
      preConfirm: () => {
        logCreate();
      }
    })
  }
  
  function logCreate() {
    const tailNumber = document.getElementById("tailNumber").value;
    const flightID = document.getElementById("flightID").value;
    const takeoff = document.getElementById("takeoff").value;
    const landing = document.getElementById("landing").value;
    const duration = document.getElementById("duration").value;
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://flightlog-backend.herokuapp.com/flightLog");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization","Bearer "+jwt);
    xhttp.send(JSON.stringify({ 
        "tailNumber": tailNumber,
        "flightID": flightID,
        "takeoff": takeoff,
        "landing": landing,
        "duration": duration
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 201) {
        const objects = JSON.parse(this.responseText);
        Swal.fire({
            text: 'New Flight Log Created'
        });
        loadTable();
      }
    };
  }
  
  function logDelete(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "https://flightlog-backend.herokuapp.com/flightLog/"+id);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", "Bearer "+jwt);
    xhttp.send(JSON.stringify({ 
      "id": id
    }));
    xhttp.onreadystatechange = function() {
        Swal.fire({
            text: 'Log Deleted'
        });
        loadTable();
      } 
    }
  
  function showEditLog(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://flightlog-backend.herokuapp.com/flightLog");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", "Bearer "+jwt);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        for(let object of objects){
          if(object['_id']==id){
            Swal.fire({
            title: 'Edit Flight Log',
            html:
          '<input id="id" type="hidden" value="'+id+'">' +
          '<input id="tailNumber" class="swal2-input" value="'+object['tailNumber']+'">' +
          '<input id="flightID" class="swal2-input" value="'+object['flightID']+'">' +
          '<input id="takeoff" class="swal2-input" type="datetime-local" value="'+moment(object['takeoff']).format("YYYY-MM-DDTHH:mm:ss")+'" min="1994-01-01T00:00:00">' +
          '<input id="landing" class="swal2-input" type="datetime-local" value="'+moment(object['landing']).format("YYYY-MM-DDTHH:mm:ss")+'" min="1994-01-01T00:00:00">'+
          '<input id="duration" class="swal2-input" value="'+object['duration']+'">',
            focusConfirm: false,
            preConfirm: () => {
              logEdit();
            }
          }) 
        }
      }
    };
  }
}
  
  function logEdit() {
    const id = document.getElementById("id").value
    const tailNumber = document.getElementById("tailNumber").value;
    const flightID = document.getElementById("flightID").value;
    const takeoff = document.getElementById("takeoff").value;
    const landing = document.getElementById("landing").value;
    const duration = document.getElementById("duration").value;
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "https://flightlog-backend.herokuapp.com/flightLog/"+id);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", "Bearer "+jwt);
    xhttp.send(JSON.stringify({ 
        "tailNumber": tailNumber,
        "flightID": flightID,
        "takeoff": takeoff,
        "landing": landing,
        "duration": duration
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 201) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
      }
      loadTable();
    };
  }
  