// Create a Form object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
if (!this.Registraion) {
  this.Registraion = {};
}

(function () {
  "use strict";

  // var ContextPath = location.protocol + "//" + location.host;

  var ContextPath = "";
  var API_PATH = "";
  var PORT = "";

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

  // var createEditForm = $("#regForm");
  // var deleteForm = $("#deleteForm");

  var checkListItemDTO = {
    id: null,
    checklistItemName: null,
    value: null,
    priorityLevel: null,
  };

  var checklist = {
    id: null,
    checklistName: null,
    checkListItemDTO: [],
  };

  var checklistCreateDTO = {
    checklistName: null,
    checkListItemDTO: [],
  };

  var checklistUpdateDTO = {
    checklistName: null,
  };

  var MultiCheckListItemCreateDTO = {
    checkListId: null,
    checkListItemCreateDTO: [],
  };

  var CheckListItemCreateDTO = {
    checklistItemName: null,
    value: null,
    priorityLevel: null,
    checkListId: null,
  };

  var checkListItemUpdateDTO = {
    id: null,
    checklistItemName: null,
    value: null,
    priorityLevel: null,
    checkListId: null,
  };

  var rawId;

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
    loadConfig()
      .then(() => {
        console.log(API_PATH);
        checklistBtnChange();
        checkListItemBtnChange();
        checklistItemEditEventListner();
        checkListAddBtnEventListener();
        $("#checklistTable").on("click", ".delete1", function (event) {
          // Access the clicked button's parent table row
          var clickedRow = $(this).closest("tr");
          // Extract the data-id from the table row
          var dataId = clickedRow.data("id");
          deleteCheklist(dataId);
          getAllDataFromServer();
          // deleteRow2(dataId);
          // loadTable();
        });

        $("#checklistTable").on("click", ".delete", function (event) {
          // Access the clicked button's parent table row
          var $clickedRow = $(this).closest("tr");
          // Extract the data-id from the table row
          deleteCheklistitem($clickedRow);
          // deleteRow1($clickedRow);
        });

        $("#checklistcollapse").on(
          "click",
          ".delete-cart-item",
          function (event) {
            // Access the clicked button's parent table row
            var $clickedRow = $(this).closest("tr");
            // Extract the data-id from the table row
            deleteCartItem($clickedRow);
          }
        );

        $("#tbodyCheckListitemCodel").on(
          "click",
          ".delete-cart-item",
          function (event) {
            // Access the clicked button's parent table row
            var $clickedRow = $(this).closest("tr");
            // Extract the data-id from the table row
            deleteCartItem2($clickedRow);
          }
        );

        // offcanvas add
        $("#addclit").on("click", function () {
          console.log("Button clicked");
          if($("#checklistitemName").val() != ""){
            loadToCart();
          }else{
            alert("please Enter Valid ChecklistName");
          }
          
          cartTableLoadOffCanvas();
        });

        // offcanvas add
        $("#modelAddbtn").on("click", function () {
          console.log("Button clicked");
          loadModelToCart();
          cartTableLoadModel();
        });

        //Save checklist
        $("#btnsvecheck").on("click", function () {
          console.log("Button clicked");
          savechecklist();
          getAllDataFromServer();
        });

        // add New checklist item
        $("#addBtnNewitem").on("click", function () {
          console.log("Button clicked");
          addNewItem();
          getAllDataFromServer();
          // loadTable();
        });
        // loadTable();
        getAllDataFromServer();
      })
      .catch((error) => {
        console.error("Initialization failed: ", error);
      });
  });

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  function checklistItemEditEventListner() {
    $("#checklistcollapse").on("click", ".edit", function () {
      const $row = $(this).closest("tr");
      if ($(this).text() === "Edit") {
        checkListToEditTOSaveBtn($row);
      } else {
        UpdateCheklistItem($row);
      }
    });
  }
  function checkListAddBtnEventListener() {
    $("#checklistTable").on("click", ".add", function (event) {
      // Access the clicked button's parent table row
      var clickedRow = $(this).closest("tr");
      // Extract the data-id from the table row
      var dataId = clickedRow.data("id");
      rawId = dataId;
    });
  }
  function checkListItemBtnChange() {
    $("#checklistTable").on("click", ".edit", function () {
      const $row = $(this).closest("tr");
      if ($(this).text() === "Edit") {
        checkListToEditTOSaveBtn($row);
      } else {
        UpdateCheklistItem($row);
        // saveRow($row);
      }
    });
  }
  function checklistBtnChange() {
    $("#checklistTable").on("click", ".edit1", function () {
      const $row = $(this).closest("tr");
      const $icon = $(this).find("i");
      if ($icon.hasClass("fa-pen-to-square")) {
        checklistEditIconTOSaveIcon($row);
        // Optionally change the icon to a save icon here
        $icon.removeClass("fa-pen-to-square").addClass("fa-save");
      } else {
        // saveRow2($row);
        saveUpdateCheckList($row);
        // Optionally change the icon back to edit icon here
        $icon.removeClass("fa-save").addClass("fa-pen-to-square");
      }
    });
  }

  // Fetch All Data From Server
  function getAllDataFromServer() {
    $.ajax({
      method: "GET",
      url: API_PATH + "/api/check-lists",
      contentType: "application/json; charset=utf-8",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Add the Bearer token here
      },
      success: function (data) {
        getAlldata(data);
      },
      error: function (xhr, error) {},
    });
  }
  // SAVE NEW CHECKLSIT
  function savechecklist() {
    console.log("url : " + API_PATH);

    let checklistData1 =
      JSON.parse(localStorage.getItem("checklistData")) || [];

    localStorage.removeItem("checklistData");
    var offcanvasElement = document.getElementById("offcanvasExample");
    var offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) {
      offcanvas.hide();
    }

    checklistCreateDTO.checklistName = checklistData1[0].checklistName;
    checklistCreateDTO.checkListItemDTO = checklistData1[0].checkListItemDTO;

    $.ajax({
      method: "POST",
      url: API_PATH + "/api/check-lists/create",
      contentType: "application/json; charset=utf-8",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Add the Bearer token here
      },
      data: JSON.stringify(checklistCreateDTO),
      success: function (data) {
        getAllDataFromServer();
      },
      error: function (xhr, error) {
        // onError(xhr, error);
        Swal.fire({
          title: xhr.responseText,
        });
      },
    });

    $("#checklistcollapse").html("");
    $("#checklistitemName").val("");
    $("#value").val("");
    $("#priority").val($("#priority option:first").val());
    $("#checklistN").val("");
  }
  // Method For save Update ChecklistList
  function saveUpdateCheckList($row) {
    var hrefId;
    var checklistNamenew;
    $row.find("td").each(function () {
      const $cell = $(this);
      if ($cell.hasClass("actions")) return;

      const columnName = $cell.data("column"); // Get the column name
      hrefId = $row.data("id");

      const collapseButton = $cell.find('[data-bs-toggle="collapse"]').detach();
      const $input = $cell.find("input");
      const newText = $input.val();
      checklistNamenew = newText;
      $cell
        .empty()
        .append(collapseButton)
        .append(document.createTextNode(newText));
    });
    $row.find(".edit").text("Edit");

    checklistUpdateDTO.checklistName = checklistNamenew;
    $.ajax({
      method: "PUT",
      url: API_PATH + "/api/check-lists/" + hrefId,
      contentType: "application/json; charset=utf-8",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Add the Bearer token here
      },
      data: JSON.stringify(checklistUpdateDTO),
      success: function (data) {
        getAllDataFromServer();
      },
      error: function (xhr, error) {
        // onError(xhr, error);
        // Swal.fire({
        //   title: xhr.responseText
        // });
      },
    });
  }
  // Delete Checklist
  function deleteCheklist(id) {
    var hrefId = id;
    $.ajax({
      method: "DELETE",
      url: API_PATH + "/api/check-lists/" + hrefId,
      contentType: "application/json; charset=utf-8",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Add the Bearer token here
      },
      data: JSON.stringify(checkListItemUpdateDTO),
      success: function (data) {
        getAllDataFromServer();
      },
      error: function (xhr, error) {},
    });
  }
  // Method For add Item To Checklist
  function addNewItem() {
    console.log("fetch newly add data", checkListItemDTO);
    let checklistitems = [];
    checklistitems = JSON.parse(localStorage.getItem("checklistData")) || [];
    console.log("find need raw id need  to add new item ");
    var hrefId = rawId;
    console.log("fetch all checklist");
    console.log("push new data to checklist");
   
    let MultiCheckListItemCreateDTO = {
      checkListId: hrefId,
      checkListItemCreateDTO: [],
    };

    // Loop through each item and create a new CheckListItemCreateDTO object for each one
    $.each(checklistitems[0].checkListItemDTO, function (index, value) {
      let CheckListItemCreateDTO = {
        checkListId: hrefId,
        checklistItemName: value.checklistItemName,
        value: value.value,
        priorityLevel: value.priorityLevel,
      };
      MultiCheckListItemCreateDTO.checkListItemCreateDTO.push(
        CheckListItemCreateDTO
      );
    });

    $.ajax({
      method: "POST",
      url: API_PATH + "/api/check-list-items/multi-check-list-items",
      contentType: "application/json; charset=utf-8",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Add the Bearer token here
      },
      data: JSON.stringify(MultiCheckListItemCreateDTO),
      success: function (data) {
        getAllDataFromServer();
      },
      error: function (xhr, error) {
        // onError(xhr, error);
        // Swal.fire({
        //   title: xhr.responseText
        // });
      },
    });
    console.log("save alldata");
    localStorage.removeItem("checklistData");
    $("#exampleModal").modal("hide");
    $("#tbodyCheckListitemCodel").html("");
  }
  // Update Checklist Items
  function UpdateCheklistItem($row) {
    var hrefId = $row.closest(".collapse").attr("id");
    $row.find("td").each(function () {
      const $cell = $(this);
      if ($cell.hasClass("actions")) return;

      const columnName = $cell.data("column");
      // Get the column name
      checkListItemDTO.id = $row.data("id");

      const $select = $cell.find("select");
      if ($select.length) {
        if (columnName === "priorityLevel") {
          checkListItemDTO.priorityLevel = $select.val();
        }
        $cell.text($select.val());
      } else {
        // Otherwise, check for a text input
        const $input = $cell.find("input");
        if ($input.length) {
          if (columnName === "checklistItemName") {
            checkListItemDTO.checklistItemName = $input.val();
          } else if (columnName === "score") {
            checkListItemDTO.value = $input.val();
          }
          $cell.text($input.val());
        }
      }
    });
    $row.find(".edit").text("Edit");
    console.log("Row updated successfully", checkListItemDTO);
    checkListItemUpdateDTO.checkListId = hrefId;
    checkListItemUpdateDTO.id = checkListItemDTO.id;
    checkListItemUpdateDTO.checklistItemName =
      checkListItemDTO.checklistItemName;
    checkListItemUpdateDTO.priorityLevel = checkListItemDTO.priorityLevel;
    checkListItemUpdateDTO.value = checkListItemDTO.value;
    $.ajax({
      method: "PUT",
      url: API_PATH + "/api/check-list-items/" + checkListItemDTO.id,
      contentType: "application/json; charset=utf-8",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Add the Bearer token here
      },
      data: JSON.stringify(checkListItemUpdateDTO),
      success: function (data) {
        getAllDataFromServer();
      },
      error: function (xhr, error) {
        // onError(xhr, error);
        // Swal.fire({
        //   title: xhr.responseText
        // });
      },
    });
  }
  // Delete Check list item
  function deleteCheklistitem($row) {
    var hrefId = $row.closest(".collapse").attr("id");

    $row.find("td").each(function () {
      checkListItemDTO.id = $row.data("id");
    });

    console.log("item.Id", checkListItemDTO.id);

    $.ajax({
      method: "DELETE",
      url: API_PATH + "/api/check-list-items/" + checkListItemDTO.id,
      contentType: "application/json; charset=utf-8",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Add the Bearer token here
      },
      data: JSON.stringify(checkListItemUpdateDTO),
      success: function (data) {
        getAllDataFromServer();
      },
      error: function (xhr, error) {},
    });
  }
  //ADD To Cart
  function loadToCart() {
    let newdata = [];

    let checklistData1 =
      JSON.parse(localStorage.getItem("checklistData")) || [];

    if (checklistData1.length !== 0) {
      checklist = checklistData1[0];
      // Fill registrationModel with values from the form
      checkListItemDTO.id = uuidv4(); // Auto-increment ID based on the existing items count
      checkListItemDTO.checklistItemName = $("#checklistitemName").val();
      checkListItemDTO.value = parseFloat($("#value").val());
      checkListItemDTO.priorityLevel = $("#priority").val();

      checklist.checkListItemDTO.push(checkListItemDTO);
      newdata.push(checklist);
      localStorage.setItem("checklistData", JSON.stringify(newdata));
      // Optional: Save registrationModel to localStorage or handle it accordingly
      console.log("Registration Model Data: ", checklistData1);
    } else {
      checklist = null;
      // Fill registrationModel with values from the form
      checkListItemDTO.id = uuidv4(); // Auto-increment ID based on the existing items count
      checkListItemDTO.checklistItemName = $("#checklistitemName").val();
      checkListItemDTO.value = parseFloat($("#value").val());
      checkListItemDTO.priorityLevel = $("#priority").val();

      checklist = {
        id: uuidv4(),
        checklistName: $("#checklistN").val(),
        checkListItemDTO: [],
      };

      checklist.checkListItemDTO.push(checkListItemDTO);
      newdata.push(checklist);
      localStorage.setItem("checklistData", JSON.stringify(newdata));
      // Optional: Save registrationModel to localStorage or handle it accordingly
      console.log("Registration Model Data: ", checklistData1);
    }
  }
  //ADD To Cart in model Data
  function loadModelToCart() {
    let newdata = [];

    let checklistData1 =
      JSON.parse(localStorage.getItem("checklistData")) || [];

    if (checklistData1.length !== 0) {
      checklist = checklistData1[0];
      // Fill registrationModel with values from the form
      checkListItemDTO.id = uuidv4(); // Auto-increment ID based on the existing items count
      checkListItemDTO.checklistItemName = $("#checklistitemNameModel").val();
      checkListItemDTO.value = parseFloat($("#valueModel").val());
      checkListItemDTO.priorityLevel = $("#priorityModel").val();

      checklist.checkListItemDTO.push(checkListItemDTO);
      newdata.push(checklist);
      localStorage.setItem("checklistData", JSON.stringify(newdata));
      // Optional: Save registrationModel to localStorage or handle it accordingly
      console.log("Registration Model Data: ", checklistData1);
    } else {
      checklist = null;
      // Fill registrationModel with values from the form
      checkListItemDTO.id = uuidv4(); // Auto-increment ID based on the existing items count
      checkListItemDTO.checklistItemName = $("#checklistitemNameModel").val();
      checkListItemDTO.value = parseFloat($("#valueModel").val());
      checkListItemDTO.priorityLevel = $("#priorityModel").val();

      checklist = {
        id: uuidv4(),
        checklistName: $("#checklistN").val(),
        checkListItemDTO: [],
      };

      checklist.checkListItemDTO.push(checkListItemDTO);
      newdata.push(checklist);
      localStorage.setItem("checklistData", JSON.stringify(newdata));
      // Optional: Save registrationModel to localStorage or handle it accordingly
      console.log("Registration Model Data: ", checklistData1);
    }
  }
  // Load Off Canvas Cart Table
  function cartTableLoadOffCanvas() {
    let checklistData1 =
      JSON.parse(localStorage.getItem("checklistData")) || [];
    var length = checklistData1.length - 1;
    var value = checklistData1[length];

    $("#checklistcollapse").html(" ");
    var tbody = "";

    var checklistContent2 = "";

    $.each(value.checkListItemDTO, function (itemIndex, item) {
      checklistContent2 +=
        "<tr id=" +
        item.id +
        '><td class="col-3">' +
        item.checklistItemName +
        '</td><td class="col-3">' +
        item.value +
        '</td><td class="col-3 dropdown-column">' +
        item.priorityLevel +
        "</td>" +
        '<td class="col-3 actions"><div class="cd-center actions">' +
        '<button class="btn btn-danger m-2 delete-cart-item actions">Delete</button></div>' +
        "</td></tr>";
    });

    tbody += checklistContent2;
    $("#checklistcollapse").append(tbody);
    $("#checklistitemName").val("");
    $("#value").val("");
    $("#priority").val($("#priority option:first").val());
  }
  // Model Cart Table
  function cartTableLoadModel() {
    let checklistData1 =
      JSON.parse(localStorage.getItem("checklistData")) || [];
    var length = checklistData1.length - 1;
    var value = checklistData1[length];

    $("#tbodyCheckListitemCodel").html(" ");
    var tbody = "";

    var checklistContent2 = "";

    $.each(value.checkListItemDTO, function (itemIndex, item) {
      checklistContent2 +=
        "<tr id=" +
        item.id +
        '><td class="col-3">' +
        item.checklistItemName +
        '</td><td class="col-3">' +
        item.value +
        '</td><td class="col-3 dropdown-column">' +
        item.priorityLevel +
        "</td>" +
        '<td class="col-3 actions"><div class="cd-center actions">' +
        '<button class="btn btn-danger m-2 delete-cart-item">Delete</button></div>' +
        "</td></tr>";
    });

    // <button class="btn btn-warning m-2 edit">Edit</button>

    tbody += checklistContent2;
    $("#tbodyCheckListitemCodel").append(tbody);
    $("#checklistitemNameModel").val("");
    $("#valueModel").val("");
    $("#priorityModel").val($("#priority option:first").val());
  }

  // load CartItems
  function reloadByDelete(checkListItemDTO, checklistContent2) {
    $.each(checkListItemDTO, function (itemIndex, item) {
      checklistContent2 +=
        '<tr data-id="' +
        item.id +
        '"><td class="col-3" data-column="checklistItemName">' +
        item.checklistItemName +
        '</td><td class="col-3" data-column="score">' +
        item.value +
        '</td><td class="col-3 dropdown-column" data-column="priorityLevel">' +
        item.priorityLevel +
        "</td>" +
        '<td class="col-3 actions"><div class="cd-center actions">' +
        '<button class="btn btn-danger m-2 delete delete-cart-item">Delete</button></div>' +
        "</td></tr>";
    });
    return checklistContent2;
  }

  // Load checklist Table
  function getAlldata(data) {
    console.log(data);
    $("#checklistTable").html(" ");
    let checklist2 = [];
    checklist2 = data;
    var div = "";
    // Use the .each() method to iterate over the array and append content
    $.each(checklist2, function (index, value) {
      var checklistContent2 = "";

      var tableRow =
        '<tr data-id="' +
        value.id +
        '"><td class="col-9" data-column="checklisName"><a class="btn  m-2" data-bs-toggle="collapse" role="button" href="#' +
        value.id +
        '"aria-expanded="false" aria-controls="' +
        value.id +
        '"><i class="fa-regular fa-square-plus"></i></a>' +
        value.checklistName +
        "</td>" +
        '<td class="col-3 actions"><div class="cd-center actions">' +
        '<button class="btn m-1 edit1"><i class="fa-regular fa-pen-to-square"></i></button>' +
        '<button class="btn m-1 delete1 actions"><i class="fa-solid fa-trash"></i></button>' +
        '<button class="btn m-1 add actions" data-bs-toggle="modal" data-bs-target="#exampleModal" ><i class="fa-solid fa-circle-plus"></i></button>' +
        "</td></tr>";

      div += tableRow;

      var innerrows =
        '<tr class="collapse"' +
        'id="' +
        value.id +
        '">' +
        '<td colspan="2">' +
        '<table class="table table-collapse table-striped col-12">' +
        "<thead><tr>" +
        '<th class="col-3">Question</th>' +
        '<th class="col-3">Value</th>' +
        '<th class="col-3">Priority</th>' +
        '<th class="col-3 cd-center">Actions</th></tr></thead><tbody id ="cotbody">';

      div += innerrows;

      $.each(value.checkListItemDTO, function (itemIndex, item) {
        checklistContent2 +=
          '<tr data-id="' +
          item.id +
          '"><td class="col-3" data-column="checklistItemName">' +
          item.checklistItemName +
          '</td><td class="col-3" data-column="score">' +
          item.value +
          '</td><td class="col-3 dropdown-column" data-column="priorityLevel">' +
          item.priorityLevel +
          "</td>" +
          '<td class="col-3 actions"><div class="cd-center actions"><button class="btn btn-primary m-2 edit">Edit</button>' +
          '<button class="btn btn-danger m-2 delete actions">Delete</button></div>' +
          "</td></tr>";
      });

      div += checklistContent2;
      div += "</tbody></table></td>";
    });

    $("#checklistTable").append(div);
  }
  // Delete From cart
  function deleteCartItem($clickedRow) {
    var hrefId = $clickedRow.attr("id");
    let checklistData1 = [];
    checklistData1 = JSON.parse(localStorage.getItem("checklistData")) || [];
    console.log("item", checklistData1);
    let itemIndex1 = checklistData1[0].checkListItemDTO.findIndex(
      (item) => item.id === hrefId
    );
    console.log("item.Index", itemIndex1);
    var itemdata = checklistData1[0].checkListItemDTO;
    console.log("delete Berfore", itemdata);
    itemdata.splice(itemIndex1, 1);
    console.log("After", itemdata);
    checklistData1[0].checkListItemDTO = itemdata;

    console.log("final", checklistData1);

    localStorage.setItem("checklistData", JSON.stringify(checklistData1));
    let Data1 = [];
    Data1 = JSON.parse(localStorage.getItem("checklistData")) || [];
    $("#checklistcollapse").html(" ");
    var tbody = "";
    var checklistContent2 = " ";
    checklistContent2 = reloadByDelete(
      Data1[0].checkListItemDTO,
      checklistContent2
    );
    tbody += checklistContent2;
    $("#checklistcollapse").append(tbody);
    // }
  }

  function deleteCartItem2($clickedRow) {
    var hrefId = $clickedRow.attr("id");
    let checklistData1 = [];
    checklistData1 = JSON.parse(localStorage.getItem("checklistData")) || [];
    console.log("item", checklistData1);
    let itemIndex1 = checklistData1[0].checkListItemDTO.findIndex(
      (item) => item.id === hrefId
    );
    console.log("item.Index", itemIndex1);
    var itemdata = checklistData1[0].checkListItemDTO;
    console.log("delete Berfore", itemdata);
    itemdata.splice(itemIndex1, 1);
    console.log("After", itemdata);
    checklistData1[0].checkListItemDTO = itemdata;

    console.log("final", checklistData1);

    localStorage.setItem("checklistData", JSON.stringify(checklistData1));
    let Data1 = [];
    Data1 = JSON.parse(localStorage.getItem("checklistData")) || [];
    $("#tbodyCheckListitemCodel").html(" ");
    var tbody = "";
    var checklistContent2 = " ";
    checklistContent2 = reloadByDelete(
      Data1[0].checkListItemDTO,
      checklistContent2
    );
    tbody += checklistContent2;
    $("#tbodyCheckListitemCodel").append(tbody);
    // }
  }

  // Button Change
  function checkListToEditTOSaveBtn(row) {
    row.find("td").each(function () {
      const $cell = $(this);
      if ($cell.hasClass("actions")) return;
      const currentText = $cell.text().trim();

      if ($cell.hasClass("dropdown-column")) {
        // Define options for the dropdown
        const options = [
          { value: "HIGH", text: "HIGH" },
          { value: "MODERATE", text: "MODERATE" },
          { value: "LOW", text: "LOW" },
        ];

        const $select = $("<select>", {
          class: "form-control",
        });

        // Populate dropdown with options
        options.forEach((option) => {
          const $option = $("<option>", {
            value: option.value,
            text: option.text,
          });
          $select.append($option);
        });
        $select.val(currentText);
        $cell.empty().append($select);
      } else {
        const $input = $("<input>", {
          type: "text",
          value: currentText,
          class: "form-control",
        });
        $cell.empty().append($input);
      }
    });
    row.find(".edit").text("Save");
  }
  // Button Change
  function checklistEditIconTOSaveIcon(row) {
    row.find("td").each(function () {
      const $cell = $(this);
      if ($cell.hasClass("actions")) return;

      const collapseButton = $cell.find('[data-bs-toggle="collapse"]').detach();
      const currentText = $cell.text();
      const $input = $("<input>", {
        type: "text",
        value: currentText,
      });
      $cell.empty().append(collapseButton).append($input);
    });
    row.find(".edit").text('<i class="fa-solid fa-check"></i>');
  }
})();
