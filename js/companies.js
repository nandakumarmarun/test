function getCompanies() {
  $("#dashboard-container").html("");
  var companiesReport = `
        <h1 class="mt-2">Companies</h1>
        <hr>
        <table class="table table-striped table-custom  table-motion-company mt-2">
          <thead>
            <tr>
              <th class="bg-success text-center align-middle text-white" style="height: 54px">Name</th>
              <th class="bg-success text-center align-middle text-white" style="height: 54px">address</th>
              <th class="bg-success text-center align-middle text-white" style="height: 54px">contact</th>
            </tr>
          </thead>
          <tbody id="tbody-comapany">
          </tbody>
        </table>
      `;

  $("#dashboard-container").append(companiesReport);
}



function loadCompanyTable() {
  var image = '<img src="../assets/loading/loading--unscreen.gif" style="width: 200px; height: 200px;" alt="">';
  var loading = '<tr><td colspan="6" align="center">' + image + '</td></tr>';
  $("#tbody-comapany").html(loading);
  $.ajax({
    method: "GET",
    url: API_PATH + "/api/companies",
    contentType: "application/json; charset=utf-8",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
    },
    success: function (data) {
      console.log(data);
      loadCompanyTableData(data)
    },
    error: function (xhr, error) {
    },
  });
}

function loadCompanyTableData(data) {
  $("#tbody-comapany").html(" ");
  var tBody = "";
  $(data).each(function (index, element) {
    var table = '<tr>'
      + '<td Class="text-center align-middle">'
      + element.companyName
      + '</td><td Class="text-center align-middle">'
      + element.address
      + '</td><td Class="text-center align-middle">'
      + element.contact
      + '</td><tr>'

    tBody += table
  });
  $("#tbody-comapany").append(tBody);
}

