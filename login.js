var jwt = localStorage.getItem("jwt");
if (jwt != null) {
  window.location.href = './flightindex.html'
}


function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://flightlog-backend.herokuapp.com/user/authenticate");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "username": username,
    "password": password
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      console.log(objects);
      if (this.status == 200) {
        localStorage.setItem("jwt", objects['accessToken']);
        Swal.fire({
          text: 'Login sucessful',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = './flightindex.html';
          }
        });
      } else {
        Swal.fire({
          text: 'Incorrect Login',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  return false;
}