function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://flightlog-backend.herokuapp.com/user/register");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "username": username,
    "password": password
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      console.log(objects);
      if (this.status == 201) {
       // localStorage.setItem("id", objects['id']);
        Swal.fire({
          text: 'Register sucessful',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = './login.html';
          }
        });
      } else {
        Swal.fire({
          text: 'Error',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  return false;
}