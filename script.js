/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * contact_array - global array to hold student objects
 * @type {Array}
 * example of contact_array after input: 
 * contact_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
var contact_array = [];
var dataPull;
var deleteIndex = null;
var rowIndex = null;
var contactObj;

/***************************************************************************************************
 * initializeApp 
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp() {
    addClickHandlersToElements();
    pullFromServer();
    //renderContactOnDom();
    //renderGradeAverage();
}


/***************************************************************************************************
 * addClickHandlerstoElements
 * @params {undefined} 
 * @returns  {undefined}
 *     
 */
function addClickHandlersToElements() {
    $('.submit-btn').on('click', handleSubmitClicked);
    $('#phone').mask('(000) 000-0000');

    //$('.btn-default').on('click', handleCancelClick);
    //$('.btn-primary').on('click', pullFromServer);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleSubmitClicked() {
    console.log('submit clicked.');
    addContact();
}

/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearaddContactFormInputs
 */
//function handleCancelClick() {
//    console.log('cancel clicked.');
//    clearaddContactFormInputs();
//}
/***************************************************************************************************
 * addContact - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearaddContactFormInputs, updateContactList
 */
function addContact() {
    var firstName = $('#first_name').val();
    var lastName = $('#last_name').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    if (firstName === '') {

    } else {
        contactObj = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone
        };
        addToServer(contactObj);
    }
}

/***************************************************************************************************
 * clearaddContactForm - clears out the form values based on inputIds variable
 */
function clearAddContactFormInputs() {
    $('#first_name').val("");
    $('#last_name').val("");
    $('#email').val("");
    $('#phone').val("");
}
/***************************************************************************************************
 * renderContactOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderContactOnDom(indexNum) {
    //var lastIndex = contact_array.length - 1;
    console.log('indexNum', indexNum);
    var newRow = $("<div>", {
        class: "tr"
    });
    var newFirstName = $("<div>", {
        class: "td",
        text: contact_array[indexNum].firstName
    });
    var newLastName = $("<div>", {
        class: "td",
        text: contact_array[indexNum].lastName
    });
    var newEmail = $("<div>", {
        class: "td",
        text: contact_array[indexNum].email
    });
    var newPhone = $("<div>", {
        class: "td",
        text: contact_array[indexNum].phone
    });

    var btnCell = $('<div>', {
        class: "td buttons"
    });
    var delButton = $('<button>', {
        type: 'button',
        class: "delete-btn",
        'rowIndex': contact_array[indexNum].id,
        text: "Delete"
    });
    var editButton = $('<button>', {
        type: 'button',
        class: "edit-btn",
        'rowIndex': contact_array[indexNum].id,
        text: "Edit"
    });

    $('.table').append(newRow);
    $('.table > .tr:last-child').append(newFirstName);
    $('.table > .tr:last-child').append(newLastName);
    $('.table > .tr:last-child').append(newPhone);
    $('.table > .tr:last-child').append(newEmail);

    btnCell.append(editButton);
    btnCell.append(delButton);


    $('.table > .tr:last-child').append(btnCell);

    (function () {
        $(delButton).click(function (event) {
            rowIndex = $(event.target).attr('rowIndex');
            for(var j =0; j<contact_array.length; j++){
                if(contact_array[j].id === rowIndex){
                    console.log('deleteIndex', deleteIndex);
                    deleteIndex = j;
                }
            }
            deleteFromServer(rowIndex);

        });
        $(editButton).click(function (event) {
            var index = $(event.target).attr('rowIndex');
            
            //deleteIndex = index;
            //deleteFromServer(index);
            //editContact(index);
            //removeContact(index);

        });
    })()


}

/***************************************************************************************************
 * updateContactList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderContactOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateContactList(string) {
    var length = contact_array.length - 1;
    if (string === 'add') {
        renderContactOnDom(length);
    } else {
        for (var i = 0; i < contact_array.length; i++) {
            renderContactOnDom(i);
        }
    }
}

function editContact(index){
    console.log("EditBtn Index: " + index);
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    
}

function removeContact() {
    contact_array.splice(deleteIndex, 1);
    $(".delete-btn[rowIndex=" + rowIndex + ']').parent().parent().remove();
}

function pullFromServer() {
    $.ajax({
        dataType: 'json',
        url: 'php/read.php',
        method: 'post',
        success: successfulPull,
        error: errorFromServer

    });

}

function successfulPull(data) {
    dataPull = data.data;
    addServerDataToArray();
}

function errorFromServer(error) {
    console.log('something went wrong :(', error);
}

function addServerDataToArray() {
    var contactObj = {};
    for (var j = 0; j < dataPull.length; j++) {

        contactObj = {
            id: dataPull[j].id,
            firstName: dataPull[j].firstName,
            lastName: dataPull[j].lastName,
            email: dataPull[j].email,
            phone: dataPull[j].phone
        };
        contact_array.push(contactObj);
    }
    updateContactList();
}

function addToServer(contact) {
    $.ajax({
        dataType: 'json',
        url: 'php/create.php',
        data: {
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone
        },
        method: 'post',
        success: successfulAdd,
        error: errorFromServer
    });
}

function successfulAdd(data) {
    console.log('successful add: '+ data);
    if (data.success === true) {
        contactObj.id = data.id;
        contact_array.push(contactObj);
        updateContactList('add');
        clearAddContactFormInputs();
    }
}

function deleteFromServer(index) {
    $.ajax({
        dataType: 'json',
        url: 'php/delete.php',
        data: {
            id: index
        },
        method: 'post',
        success: successfulDelete,
        error: errorFromServer
    });
}

function successfulDelete(data) {
    console.log('successful delete: ' + data.success);
    if (data.success === true) {
        removeContact();
    }

}



// Get the button that opens the modal

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//    if (event.target == modal) {
//        modal.style.display = "none";
//    }
//}
