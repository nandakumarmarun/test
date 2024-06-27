


// function loadTable() {
//   $("#checklistTable").html(" ");
//   let checklist2 = [];
//   checklist2 = JSON.parse(localStorage.getItem("ChecklistDataList"));
//   var div = "";
//   // Use the .each() method to iterate over the array and append content
//   $.each(checklist2, function (index, value) {
//     var checklistContent2 = "";

//     var tableRow =
//       '<tr data-id="' +
//       value.id +
//       '"><td class="col-9" data-column="checklisName"><a class="btn  m-2" data-bs-toggle="collapse" role="button" href="#' +
//       value.id +
//       '"aria-expanded="false" aria-controls="' +
//       value.id +
//       '"><i class="fa-regular fa-square-plus"></i></a>' +
//       value.checklistName +
//       "</td>" +
//       '<td class="col-3 actions"><div class="cd-center actions">' +
//       '<button class="btn m-1 edit1"><i class="fa-regular fa-pen-to-square"></i></button>' +
//       '<button class="btn m-1 delete1 actions"><i class="fa-solid fa-trash"></i></button>' +
//       '<button class="btn m-1 add actions" data-bs-toggle="modal" data-bs-target="#exampleModal" ><i class="fa-solid fa-circle-plus"></i></button>' +
//       "</td></tr>";

//     div += tableRow;

//     var innerrows =
//       '<tr class="collapse"' +
//       'id="' +
//       value.id +
//       '">' +
//       '<td colspan="2">' +
//       '<table class="table table-collapse table-striped col-12">' +
//       "<thead><tr>" +
//       '<th class="col-3">Question</th>' +
//       '<th class="col-3">Value</th>' +
//       '<th class="col-3">Priority</th>' +
//       '<th class="col-3 cd-center">Actions</th></tr></thead><tbody id ="cotbody">';

//     div += innerrows;

//     $.each(value.checkListItemDTO, function (itemIndex, item) {
//       checklistContent2 +=
//         '<tr data-id="' +
//         item.id +
//         '"><td class="col-3" data-column="checklistItemName">' +
//         item.checklistItemName +
//         '</td><td class="col-3" data-column="score">' +
//         item.value +
//         '</td><td class="col-3 dropdown-column" data-column="priorityLevel">' +
//         item.priorityLevel +
//         "</td>" +
//         '<td class="col-3 actions"><div class="cd-center actions"><button class="btn btn-primary m-2 edit">Edit</button>' +
//         '<button class="btn btn-danger m-2 delete actions">Delete</button></div>' +
//         "</td></tr>";
//     });

//     div += checklistContent2;
//     div += "</tbody></table></td>";
//   });

//   $("#checklistTable").append(div);
// }



// function deleteRow2(id) {
//   var hrefId = id;
//   let checklistData1 = [];
//   checklistData1 =
//     JSON.parse(localStorage.getItem("ChecklistDataList")) || [];

//   let itemIndex1 = checklistData1.findIndex((item) => item.id === hrefId);
//   if (itemIndex1 !== -1) {
//     checklistData1.splice(itemIndex1, 1);
//     // Update the local storage with the modified array
//     localStorage.setItem("ChecklistDataList", JSON.stringify(checklistData1));
//   }
// }




// function deleteCheklistitem($row) {
//   var hrefId = $row.closest(".collapse").attr("id");

//   $row.find("td").each(function () {
//     checkListItemDTO.id = $clickedRow.data("id");
//   });

//   console.log("item.Id", checkListItemDTO.id);

//   $.ajax({
//     method: "DELETE",
//     url: API_PATH + "/api/check-list-items" + checkListItemDTO.id,
//     contentType: "application/json; charset=utf-8",
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"), // Add the Bearer token here
//     },
//     data: JSON.stringify(checkListItemUpdateDTO),
//     success: function (data) {
//       getAllDataFromServer();
//     },
//     error: function (xhr, error) {},
//   });
// }






// function deleteCheklistitem($row) {
//   var hrefId = $row.closest(".collapse").attr("id");

//   $row.find("td").each(function () {
//     checkListItemDTO.id = $clickedRow.data("id");
//   });

//   console.log("item.Id", checkListItemDTO.id);

//   $.ajax({
//     method: "DELETE",
//     url: API_PATH + "/api/check-list-items" + checkListItemDTO.id,
//     contentType: "application/json; charset=utf-8",
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"), // Add the Bearer token here
//     },
//     data: JSON.stringify(checkListItemUpdateDTO),
//     success: function (data) {
//       getAllDataFromServer();
//     },
//     error: function (xhr, error) {},
//   });
// }




