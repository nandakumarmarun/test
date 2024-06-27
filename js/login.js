// Create a Form object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
if (!this.Form) {
  this.Form = {};
}

(function () {
  "use strict";

  var ContextPath = "";
  var Port = "";
  var API_PATH = "";

    // location.protocol + "//" + location.host;

    $.getJSON("../config.json", function (config) {
      ContextPath = config.HOST;
      Port =  config.PORT;
      API_PATH = ContextPath + ":" + config.PORT
      console.log("properties");
      console.log("HOST:", config.HOST);
    });

  var createEditForm = $("#loginForm");
  var deleteForm = $("#deleteForm");

  var loginModel = {
    login: null,
    password: null,
  };

  // Specify the validation rules
  var validationRules = {
    login: {
      required: true,
      maxlength: 255,
    },

    password: {
      required: true,
      maxlength: 255,
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
    // add the rule here
    $.validator.addMethod(
      "valueNotEquals",
      function (value, element, arg) {
        return arg != value;
      },
      ""
    );

    createEditForm.validate({
      rules: validationRules,
      messages: validationMessages,
      submitHandler: function (form) {
        createUpdateForm();
      },
    });

    deleteForm.submit(function (e) {
      // prevent Default functionality
      e.preventDefault();
      // pass the action-url of the form
      deleteForm1(e.currentTarget.action);
    });
  });



  function createUpdateForm() {
    loginModel.login = $('#form-name').val();
    loginModel.password = $('#form-password').val();
    $.ajax({
      method: 'POST',
      url: API_PATH + "/api/v1/auth/authenticate",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(loginModel),
      success: function (data) {
        localStorage.setItem('token', data.token);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
        setuserName();
      },
      error: function (xhr, error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Check Your Credentials!",
        });
      }
    });
  }

  const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  };

  const sample = async () => {
    let delayres = await delay(2000);
    location.href = ContextPath  + "/HTML/dashboard"
  };

  const adminPage = async () => {
    let delayres = await delay(2000);
    location.href = ContextPath + "/HTML/checklist"
  };

  function setuserName() {
    $.ajax({
      method: "GET",
      url: API_PATH +"/api/v1/user/current-session",
      contentType: "application/json; charset=utf-8",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // Add the Bearer token here
      },
      success: function (data) {
        if (data.roles == "USER") {
          sample();
        } else {
          adminPage();
        }
      },
      error: function (xhr, error) {
      },
    });
  }






  // function onSaveSuccess(result) {
  //   // reloading page to see the updated data
  //   window.location = ContextPath;
  // }

  function onDeleteSuccess(result) {
    // reloading page to see the updated data
    window.location = ContextPath;
  }

  Form.showModalPopup = function (el, id, action, obj) {
    resetForm();
    if (id) {
      switch (action) {
        case 0:
          showForm(id, obj);
          break;
        case 1:
          editForm(id);
          createEditForm.attr("method", "PUT");
          break;
        case 2:
          deleteForm.attr("action", ContextPath + "/" + id);
          break;
        case 3:
          loadQuestions(id);
          break;
      }
    }
    el.modal("show");
  };

  Form.closeModalPopup = function (el) {
    el.modal("hide");
  };

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
