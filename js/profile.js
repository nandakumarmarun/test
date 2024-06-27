
$.getJSON("../config.json", function (config) {
  ContextPath = config.HOST;
  API_PATH = ContextPath + ":" + config.PORT;
  console.log("properties");
  console.log("HOST:", config.HOST);
});




function GetProfile() {
  $("#dashboard-container").html("");
  var formHTML = `
  <div class="c-1 p-5">
    <label class="d-block ">
      <h3>PROFILE</h3>
    </label>
    <hr class="mb-3">
    <form id="regForm">
      <div class="form-row">
        <div class="form-group mt-2">
          <label for="inputfirstname">First Name</label>
          <input
            type="text"
            class="form-control"
            id="inputfirstname"
            name="firstname"
            placeholder="Enter First Name " disabled
          />
        </div>
        <div class="form-group mt-2">
          <label for="inputLastname">Last Name</label>
          <input
            type="text"
            class="form-control"
            id="inputLastname"
            name="lastname"
            placeholder="Enter Last Name " disabled
          />
        </div>
        <div class="form-group mt-2">
          <label for="inputEmail">Email</label>
          <input
            type="email"
            class="form-control"
            id="inputEmail"
            name="email"
            placeholder="Enter Email" disabled
          />
        </div>
      </div>
   
    </form>
  </div>
`;
  $("#dashboard-container").append(formHTML);
}

function setuserData() {
  console.log(API_PATH)
  $.ajax({
    method: "GET",
    url: API_PATH + "/api/v1/user/current-session",
    contentType: "application/json; charset=utf-8",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
    },
    success: function (data) {
      console.log(data.firstName)
      $("#inputfirstname").val(data.firstName);
      $("#inputLastname").val(data.lastName);
      $("#inputEmail").val(data.email);
      $("#LoadingModel2").modal("hide");
    },
    error: function (xhr, error) {
    },
  });
}

function setuserName() {
  console.log(API_PATH)
  $.ajax({
    method: "GET",
    url: API_PATH + "/api/v1/user/current-session",
    contentType: "application/json; charset=utf-8",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
    },
    success: function (data) {
      console.log(data)
      $(".c-user-name").html(data.firstName +" "+ data.lastName);
    },
    error: function (xhr, error) {
    },
  });
}


{/* <div class="form-group mt-3">
<button
  type="submit"
  class="btn btn-success btn-lg btn-block col-12 mt-5">
  UPDATE
</button>
</div> */}