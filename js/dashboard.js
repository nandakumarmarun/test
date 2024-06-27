var ContextPath = "";
var API_PATH = "";
var PORT = ""

$.getJSON("../config.json", async function (config) {
  ContextPath = config.HOST;
  PORT = config.PORT
  API_PATH = ContextPath + ":" + PORT;
  console.log("properties" + API_PATH);
  console.log("HOST:", config.HOST);
});


function loadConfig() {
  return new Promise((resolve, reject) => {
    $.getJSON("../config.json", function (config) {
      if (config.HOST && config.PORT) {
        ContextPath = config.HOST;
        PORT = config.PORT;
        API_PATH = ContextPath + ":" + PORT;
        console.log("properties " + API_PATH);
        console.log("HOST:", config.HOST);
        resolve();
      } else {
        console.error("Error: HOST or PORT not found in config.json");
        reject("Invalid config");
      }
    }).fail(function (jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("Request Failed: " + err);
      reject(err);
    });
  });
}



$(document).ready(function () {
  loadConfig().then(() => {
    $("#LoadingModel2").modal("show");

    setuserName();
    dashboardBody();
    loadTable();
    setChartData();
    BtnInitialise();
    $(".nav-link").click(function () {
      $(".nav-link").removeClass("active");
      $(this).addClass("active");
      let content = $(this).data("content");
      loadContent(content);
    });
  }).catch((error) => {
    console.error("Initialization failed: ", error);
  });
});



const redirect = async () => {
  location.href = ContextPath + "/HTML/securitytest.html";
};


function loadContent(data) {
  if (data == "home") {
    $("#LoadingModel2").modal("show");
    dashboardBody();
    loadTable();
    setChartData();
    BtnInitialise();
  } else if (data == "profile") {
    $("#LoadingModel2").modal("show");
    GetProfile();
    setuserData();
  } else if (data == "Companies") {
    getCompanies();
    $('.table-custom').css({
      transform: 'scale(1)',
    });
    loadCompanyTable()
  } else if (data == "Report") {
    getReports();
    $('.table-custom').css({
      transform: 'scale(1)',
    });
    loadTestTable()
    
  } else if (data == "logout") {
  }
}



function dashboardBody() {
  $("#dashboard-container").html("");
  var dashboardHTML = `
<div class="row dashboard-cards d-flex justify-content-around mt-2">
  <div id="success-count" class="dash-board-item-1 card-motion col-sm-12 col-md-4 col-lg-4 col-xl-3 col-xxl-2">
    <span class="fs-3 fw-1 text-white">SUCCESS</span>
    <h1 class="fs-1 text-white">0</h1>
  </div>
  <div id="failed-count" class="dash-board-item-2 card-motion col-sm-12 col-md-4 col-lg-4 col-xl-3 col-xxl-2">
    <span class="fs-3 fw-1 text-white">FAILED</span>
    <h1 class="fs-1 text-white">0</h1>
  </div>
  <div id="moderate-count" class="dash-board-item-3 card-motion col-sm-12 col-md-4 col-lg-4 col-xl-3 col-xxl-2">
    <span class="fs-3 fw-1 text-white">MODERATE</span>
    <h1 class="fs-1 fw-1 text-white">0</h1>
  </div>
  <div id="chart-Container" class="dash-board-item-4 card-motion col-sm-12 col-md-4 col-lg-4 col-xl-11 col-xxl-3">
    <canvas id="chartContainer"></canvas>
  </div>
</div>`;

  dashboardHTML += `<div class="col-12 d-flex justify-content-around mt-3 container">
  <button id="new-test-btn" class="btn btn-success col-12 btnTest">NEW TEST</button>
</div>`;

  dashboardHTML += `<div class="col-12 mt-3 container table-responsive">
  <table class="table table-striped table-custom mt-2 align-middle col-sm-12 col-md-4 col-lg-4 col-xl-3 col-xxl-2">
    <thead class="th-1">
      <tr>
        <th scope="col-1" class="bg-success text-center align-middle text-white" style="height: 54px">Company Name</th>
        <th scope="col-1" class="bg-success text-center align-middle text-white" style="height: 54px">Project Name</th>
        <th scope="col-1" class="bg-success text-center align-middle text-white" style="height: 54px">System NO</th>
        <th scope="col-1" class="bg-success text-center align-middle text-white" style="height: 54px">Security Level</th>
        <th scope="col-1" class="bg-success text-center align-middle text-white" style="height: 54px">Score</th>
        <th scope="col-1" class="bg-success text-center align-middle text-white" style="height: 54px">Status</th>
      </tr>
    </thead>
    <tbody id="table-body">
      
    </tbody>
  </table>
</div>`;
  $("#dashboard-container").html("");
  $("#dashboard-container").append(dashboardHTML);
}


function BtnInitialise() {
  $(".btnTest").click(function () {
    $("#LoadingModel").modal("show");
    redirect();
  });

  $(".view-details-btn").click(function () {
    var id = $(this).data("id");
    getSavedTestData(id)
    $("#LoadingModel2").modal("show");
  });
}



function loadchart(data) {
  const ctx = document.getElementById("chartContainer");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["SUCESS", "FAILED", "MODERATE"],
      datasets: [
        {
          label: 'Security Rate',
          data: data,
          borderWidth: 1,
          backgroundColor: [
            'rgba(16, 222, 177, 0.8)', // Color for SUCCESS
            'rgba(209, 16, 62, 0.8)', // Color for FAILED
            'rgba(9, 125, 204, 0.8)'  // Color for MODERATE
          ],
        },
      ],
    },
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
          from: 1,
          to: 0,
          loop: true,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 20,
        },
      },
    },
  });
}

// loading Data to Table 
function loadTable() {
  var image = '<img src="../assets/loading/loading--unscreen.gif" style="width: 100px; height: 100px;" alt="">';
  var loading = '<tr><td colspan="6" align="center">' + image + '</td></tr>';
  $("#table-body").html(loading);
  $.ajax({
    method: "GET",
    url: API_PATH + "/api/dashboard/topten",
    contentType: "application/json; charset=utf-8",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
    },
    success: function (data) {
      console.log(data);
      appendTableData(data)
      $("#LoadingModel2").modal("hide");
    },
    error: function (xhr, error) {
    },
  });
}

// Setting Chart
function setChartData() {
  $.ajax({
    method: "GET",
    url: API_PATH + "/api/dashboard/chart",
    contentType: "application/json; charset=utf-8",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
    },
    success: function (data) {
      $('.card-motion').css({
        transform: 'scale(1)',
      });
      $('.table-custom').css({
        transform: 'scale(1)',
      });
      $('.btnTest').css({
        transform: 'scale(1)',
      });
      $('#success-count h1').text(data.sucessCount);
      $('#moderate-count h1').text(data.moderateCount)
      $('#failed-count h1').text(data.failedcount);
      var chartData = [data.sucessCount, data.failedcount, data.moderateCount]
      loadchart(chartData)
    },
    error: function (xhr, error) {
    },
  });
}





function appendTableData(data) {
  $("#table-body").html(" ");
  var tBody = "";
  $(data).each(function (index, element) {
    var table = '<tr>'
      + '<td Class="text-center align-middle">'
      + element.companyName
      + '</td><td Class="text-center align-middle">'
      + element.applicationName
      + '</td><td Class="text-center align-middle">'
      + element.systemNo
      + '</td><td Class="text-center align-middle">'
      + element.securityLevel
      + '</td><td Class="text-center align-middle">'
      + element.testScore
      + '</td><td Class="text-center align-middle">'
      + element.testStatus
      + '</td><tr>'

    tBody += table
  });
  $("#table-body").append(tBody);
}
