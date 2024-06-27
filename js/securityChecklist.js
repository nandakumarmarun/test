// Create a Form object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
if (!this.Registraion) {
  this.Registraion = {};
}

(function () {
  "use strict";

  var ContextPath = "";
  var API_PATH = "";
  var PORT = ""

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
  var createEditForm = $("#regForm");
  var deleteForm = $("#deleteForm");



  const SecurityTestCreateDTO = {
    applicationName: null,
    systemNo: null,
    department: null,
    testStatus: null,
    testScore: null,
    securityLevel: null,
    testCheckLists: [],
    userId: null,
    companyId: null
  };



  const SecurityTestUpdateDTO = {
    id: null,
    applicationName: null,
    systemNo: null,
    department: null,
    testStatus: null,
    testScore: null,
    securityLevel: null,
    testCheckLists: [],
    userId: null,
    companyId: null
  };



  var testCheckLists = {
    marked: false,
    testCheckListItems: []
  }



  var testCheckListItems = {
    marked: false,
    checklistitemId: null
  }



  var CompanyCreateDTO = {
    companyName: null,
    address: null,
    contact: null
  }



  // Specify the validation rules
  var validationRules = {
    firstname: {
      required: true,
    },
    email: {
      required: true,
    },
    email: {
      required: true,
    },
    login: {
      required: true,
    },
    password: {
      required: true,
      maxlength: 8,
    },
  };



  // Specify the validation error messages
  var validationMessages = {
    login: {
      required: "This field is required.",
      maxlength: "This field cannot be longer than 255 characters.",
    },
    password: {
      required: "This field is required.",
      maxlength: "This field cannot be longer than 255 characters.",
    },
  };




  $(document).ready(function () {
    loadConfig().then(() => {
      $("#LoadingModel2").modal("show");
      getAllDataFromServer();
      // disableBackButton();
      $("#multiStepForm").submit(function (event) {
        event.preventDefault();
        $("#LoadingModel").modal("show");
        if (SecurityTestUpdateDTO.id == null) {
          SUbmitTest();
        } else {
          UpdateTest();
        }

      });
      saveAlert();
    }).catch((error) => {
      console.error("Initialization failed: ", error);
    });





  });


  function saveAlert() {
    window.addEventListener("beforeunload", function (e) {
      // Custom message for the popup
      var confirmationMessage = "Are you sure you want to leave? Your data will be saved.";

      // Save data to the server
      this.alert(confirmationMessage);

      // Show the popup
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
      return confirmationMessage;
    });
  }


  function getAllDataFromServer() {
    $.ajax({
      method: "GET",
      url: API_PATH + "/api/check-lists",
      contentType: "application/json; charset=utf-8",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
      },
      success: function (data) {
        loadQuetions(data);
        intializeButtons();
        loadCompanies();
      },
      error: function (xhr, error) {
      },
    });
  }




  function loadCompanies() {
    $('#priority').html('');
    $.ajax({
      method: "GET",
      url: API_PATH + "/api/companies",
      contentType: "application/json; charset=utf-8",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
      },
      success: function (data) {
        data.forEach(element => {
          $('#priority').append('<option value="' + element.id + '">' + element.companyName + '</option>');
        });
      },
      error: function (xhr, error) {
      },
    });
  }





  function CreateCompanies() {
    CompanyCreateDTO.companyName = $("#checklistitemNameModel").val();
    CompanyCreateDTO.address = $("#systemNo").val();
    CompanyCreateDTO.contact = $("#projectName").val();
    $.ajax({
      method: "POST",
      url: API_PATH + "/api/companies",
      contentType: "application/json; charset=utf-8",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
      },
      data: JSON.stringify(CompanyCreateDTO),
      success: function (data) {
        loadCompanies();
        $("#exampleModal").modal("hide");
      },
      error: function (xhr, error) {
      },
    });
  }






  function SUbmitTest() {
    SecurityTestCreateDTO.applicationName = $('#projectName').val();
    SecurityTestCreateDTO.systemNo = parseInt($('#systemNo').val());
    SecurityTestCreateDTO.companyId = parseInt($('#priority').val());

    const checkLists = {};

    $('.form-check-input').each(function () {
      const checkListId = $(this).data('checklistid');
      const checkListItemId = $(this).data('checklistitemid');
      const isChecked = $(this).is(':checked');

      if (!checkLists[checkListId]) {
        checkLists[checkListId] = [];
      }

      checkLists[checkListId].push({
        marked: isChecked,
        checklistitemId: checkListItemId
      });
    });

    const testCheckLists = Object.keys(checkLists).map(checkListId => ({
      checkListId: parseInt(checkListId),
      testCheckListItems: checkLists[checkListId]
    }));

    SecurityTestCreateDTO.testCheckLists = testCheckLists;

    console.log(SecurityTestCreateDTO)


    $.ajax({
      method: "POST",
      url: API_PATH + "/api/test",
      contentType: "application/json; charset=utf-8",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
      },
      data: JSON.stringify(SecurityTestCreateDTO),
      success: function (data) {
        console.log(data)
        reset();
        if (data.securityLevel == "EXCELLENT") {
          Excellent(data);
        } else if (data.securityLevel == "MODERATE") {
          Moderate(data)
        } else {
          Critcal(data)
        }
      },
      error: function (xhr, error) {
      },
    });
  }





  function UpdateTest() {
    SecurityTestUpdateDTO.applicationName = $('#projectName').val();
    SecurityTestUpdateDTO.systemNo = parseInt($('#systemNo').val());
    SecurityTestUpdateDTO.companyId = parseInt($('#priority').val());

    const checkLists = {};

    $('.form-check-input').each(function () {
      const checkListId = $(this).data('checklistid');
      const checkListItemId = $(this).data('checklistitemid');
      const isChecked = $(this).is(':checked');
      const testCheckListId = $(this).data('testchecklist');
      const testCheckListItemId = $(this).data('testcheklistitem');


      if (!checkLists[checkListId]) {
        checkLists[checkListId] = [];
      }

      checkLists[checkListId].push({
        id: testCheckListItemId,
        marked: isChecked,
        checklistitemId: checkListItemId,
        testCheckListId: testCheckListId
      });
    });

    const testCheckLists = Object.keys(checkLists).map(checkListId => ({
      id: checkLists[checkListId][0].testCheckListId, // Adjust this according to your actual data structure
      checkListId: parseInt(checkListId),
      testCheckListItems: checkLists[checkListId]
    }));

    SecurityTestUpdateDTO.testCheckLists = testCheckLists;

    console.log(SecurityTestUpdateDTO)


    $.ajax({
      method: "PUT",
      url: API_PATH + "/api/test/" + SecurityTestUpdateDTO.id,
      contentType: "application/json; charset=utf-8",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
      },
      data: JSON.stringify(SecurityTestUpdateDTO),
      success: function (data) {
        console.log(data)
        if (data.securityLevel == "EXCELLENT") {
          Excellent(data);
        } else if (data.securityLevel == "MODERATE") {
          Moderate(data)
        } else {
          Critcal(data)
        }
      },
      error: function (xhr, error) {
      },
    });
  }



  function Excellent(data) {
    $("#LoadingModel").modal("hide");
    Swal.fire({
      title: data.securityLevel,
      text: data.description,
      icon: "success",
      showConfirmButton: true,
      confirmButtonText: "COMPLETED",
      showCancelButton: true,
      cancelButtonText: "RETEST",
      cancelButtonColor: "#dd6b55"
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(data.id);
      } else if (result.isDismissed) {
        getSavedTestData(data.id)
      }
    });

  }

  function Moderate(data) {
    $("#LoadingModel").modal("hide");
    Swal.fire({
      title: data.securityLevel,
      text: data.description,
      icon: "info",
      showConfirmButton: true,
      confirmButtonText: "COMPLETED",
      showCancelButton: true,
      cancelButtonText: "RETEST",
      cancelButtonColor: "#dd6b55"
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(data.id);
        redirect();
      } else if (result.isDismissed) {
        getSavedTestData(data.id)
      }
    });
  }

  function Critcal(data) {
    $("#LoadingModel").modal("hide");
    const { value: done } = Swal.fire({
      title: data.securityLevel,
      text: data.description,
      icon: "error",
      showConfirmButton: true,
      confirmButtonText: "COMPLETED",
      showCancelButton: true,
      cancelButtonText: "RETEST",
      cancelButtonColor: "#dd6b55"
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(data.id);
        redirect();
      } else if (result.isDismissed) {
        getSavedTestData(data.id)
      }
    });
  }



  function getSavedTestData(testId) {
    $.ajax({
      method: "GET",
      url: API_PATH + "/api/test/" + testId,
      contentType: "application/json; charset=utf-8",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      success: function (data) {
        populateForm(data);
      },
      error: function (xhr, error) {
        console.error("Failed to fetch saved test data:", error);
      },
    });
  }




  function updateStatus(testId) {
    $.ajax({
      method: "PUT",
      url: API_PATH + "/api/dashboard/update-status/" + testId,
      contentType: "application/json; charset=utf-8",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      success: function (data) {
        redirect();
      },
      error: function (xhr, error) {
        console.error("Failed to fetch saved test data:", error);
      },
    });
  }


  const redirect = async () => {
    location.href = ContextPath + "/HTML/dashboard"
  };


  function populateForm(data) {
    $('#projectName').val(data.applicationName);
    $('#systemNo').val(data.systemNo);
    $('#priority').val(data.companyId);

    // Clear existing checkboxes
    $('.form-check-input').prop('checked', false);

    // Check the relevant checkboxes
    data.testCheckListResponseDTOS.forEach(checkList => {
      checkList.testCheckListItemResoponseDTOS.forEach(item => {
        // const checkbox = $(`.form-check-input[data-checklistitemId=${item.checklistitemId}][data-testchecklistitemId=${item.id}]`);
        const checkbox = $(`.form-check-input[data-checklistitemId=${item.checklistitemId}]`);
        checkbox.prop('checked', item.marked);
        checkbox.attr('data-testcheklistItem', item.id);
        checkbox.attr('data-testchecklist', checkList.id);
      });
    });

    // Store the test ID for updates
    $('#testId').val(data.id);
    SecurityTestUpdateDTO.id = data.id
  }





  function reset() {
    $('.form-check-input').prop('checked', false);
    $('#projectName').val("");
    $('#systemNo').val("");
    $('#priority').val("");
  }





  function loadQuetions(data) {
    $("#LoadingModel2").modal("hide");
    let checklist2 = [];
    checklist2 = data
    var tabody = ""
    var sideBarItems = ""

    tabody += `<div class="step step-0 active">
        <div class="div">
            <form action="">
            <label class="m-2">Company</label>
            <div class="input-group">
            <select id="priority" class="form-select " id="inputGroupSelect01">
            </select>
            <button class="btn btn-success " id="addclit" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-plus"></i></button></div>
            <label class="m-2">SystemNo</label>
            <input id="systemNo" type="text" class="form-control" placeholder="Enter System Number" aria-label="SystemNo" />
            <label class="m-2">Project Name</label>
            <input id="projectName" type="text" class="form-control " placeholder="Enter Project Name" aria-label="Project Name" />
            </form>
            <div class="row mt-5"><div class="col text-end p-3">
            <button type="button" class="btn btn-success btn-1 m-3 next-step">Next</button></div></div>
        </div></div>`;

    sideBarItems += '<div class="sidebar-item m-3 text-center step-0 active'
      + '">'
      + '<h5>Project</h5></div>'

    $.each(checklist2, function (index, value) {
      var activeClass = (index === 0) ? ' active' : '';
      tabody += '<div class="step step-'
        + (index + 1)
        + '"><h2 class="m-4 fs-3 fw-bold">'
        + value.checklistName
        + '</h2>'

      var loadQu = "";

      var activeClass = (index === 0) ? ' active' : '';

      sideBarItems += '<div class="sidebar-item m-3 text-center step-'
        + (index + 1)
        + '">'
        + '<h5>'
        + value.checklistName
        + '</h5></div>'

      $.each(value.checkListItemDTO, function (itemIndex, item) {
        var prioritylevel = ''
        if (item.priorityLevel === "HIGH") {
          prioritylevel = 'highpriority'
        } else if (item.priorityLevel === "LOW") {
          prioritylevel = 'lowpriority'
        } else {
          prioritylevel = 'moderatepriority'
        }


        loadQu += '<div class="form-check fs-6 m-3">'
          + '<input class="form-check-input" type="checkbox" value="'
          + item.id
          + '" id="flexCheckChecked-'
          + item.id
          + '" data-checklistitemId="'
          + item.id
          + '" data-checklistId="'
          + value.id
          + '">'
          + '<label class="form-check-label '
          + prioritylevel
          + '" for="flexCheckChecked-'
          + item.id
          + '">'
          + item.checklistItemName
          + '</label></div>'
      });
      tabody += loadQu;

      var buttondiv = '<div class="row mt-5"><div class="col text-end p-3">'
      tabody += buttondiv;


      tabody += '<button type="button" class="btn btn-secondary btn-1 m-3 prev-step">Previous</button>'
      if (index < checklist2.length - 1) {
        tabody += '<button type = "button" class="btn btn-success btn-1 m-3 next-step" >Next</button>'
      } else {
        tabody += '<button type="submit" data-bs-target="#LoadingModel" class="btn btn-success m-3 btn-1">Submit</button>'
      }

      tabody += `</div></div></div>`;
    });
    $("#multiStepForm").append(tabody);
    $("#sidebar-inner").append(sideBarItems);
  }




  // const redirect = async () => {
  //   location.href = ContextPath + "/HTML/dashboard"
  // };




  const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  };



  function intializeButtons() {
    var currentStep = 0;
    var totalSteps = $(".step").length;

    $("#BtnAddCompany").on("click", function () {
      console.log("Button clicked");
      CreateCompanies()
    });

    $(".next-step").click(function () {
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
      }
    });

    $(".prev-step").click(function () {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });

    function showStep(step) {
      $(".step").removeClass("active");
      $(".step-" + step).addClass("active");
      $(".sidebar-item").removeClass("active");
      $(".sidebar-item.step-" + step).addClass("active");
    }
  }




  function resetForm() {
    $(".alert").hide();
    createEditForm.trigger("reset"); // clear form fields
    createEditForm.validate().resetForm(); // clear validation messages
    createEditForm.attr("method", "POST"); // set default method
    formModel.pid = null; // reset form model;
  }




  function addErrorAlert(message, key, data) {
    $(".alert > p").html(message);
    $(".alert").show();
  }





  function onError(httpResponse, exception) {
    var i;
    switch (httpResponse.status) {
      // connection refused, server not reachable
      case 0:
        addErrorAlert("Server not reachable", "error.server.not.reachable");
        break;
      case 400:
        var errorHeader = httpResponse.getResponseHeader(
          "X-orderfleetwebApp-error"
        );
        var entityKey = httpResponse.getResponseHeader(
          "X-orderfleetwebApp-params"
        );
        if (errorHeader) {
          var entityName = entityKey;
          addErrorAlert(errorHeader, errorHeader, {
            entityName: entityName,
          });
        } else if (httpResponse.responseText) {
          var data = JSON.parse(httpResponse.responseText);
          if (data && data.fieldErrors) {
            for (i = 0; i < data.fieldErrors.length; i++) {
              var fieldError = data.fieldErrors[i];
              var convertedField = fieldError.field.replace(/\[\d*\]/g, "[]");
              var fieldName =
                convertedField.charAt(0).toUpperCase() +
                convertedField.slice(1);
              addErrorAlert(
                "Field " + fieldName + " cannot be empty",
                "error." + fieldError.message,
                {
                  fieldName: fieldName,
                }
              );
            }
          } else if (data && data.message) {
            addErrorAlert(data.message, data.message, data);
          } else {
            addErrorAlert(data);
          }
        } else {
          addErrorAlert(exception);
        }
        break;
      default:
        if (httpResponse.responseText) {
          var data = JSON.parse(httpResponse.responseText);
          if (data && data.description) {
            addErrorAlert(data.description);
          } else if (data && data.message) {
            addErrorAlert(data.message);
          } else {
            addErrorAlert(data);
          }
        } else {
          addErrorAlert(exception);
        }
    }
  }
})();


