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
var contactId = null;
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
    $('.close-modal, .cancel-edit').on('click', closeModal);
    $('#phone, #edit_phone').mask('(000) 000-0000');
    $('.confirm-edit').on('click', updateServerContact);
    
    $('.edit-input').keypress(function (event) {
     var key = event.which;
     if(key === 13)  // the enter key code
      {
        $('.confirm-edit').click();
        return false;  
      }
    });   
    window.onscroll = function() {fixTableHead()};
    //$('.btn-default').on('click', handleCancelClick);
    //$('.btn-primary').on('click', pullFromServer);
}

function fixTableHead(){
    if (window.pageYOffset > 300) {
        $('.tableHead').addClass("fixed");
    } else {
        $('.tableHead').removeClass("fixed");
  }
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */

function closeModal(){
    $(".confirm-modal").addClass('hide-modal');
    $(".confirm-modal").removeClass('show-modal');
}

function handleSubmitClicked(event) {
    event.preventDefault();
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
    
    var phoneRegex = /^\(\d{3}\)\s?\d{3}-\d{4}$/;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (firstName === '') {
        $( ".form-response" ).text( "Please enter a valid first name" );
    } else if(lastName ===''){
        $( ".form-response" ).text( "Please enter a valid last name" );
    } else if(phoneRegex.test(phone) === false){
        $( ".form-response" ).text( "Please enter a valid phone" );
    } else if(emailRegex.test(email) === false){
        $( ".form-response" ).text( "Please enter a valid email" );
    } else {
        contactObj = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone
        };
        addToServer(contactObj);
        $( ".form-response" ).text( "" );
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
    //console.log('indexNum', indexNum);
    var newRow = $("<tr>", {
        class: "tr"
    });
    var newFirstName = $("<td>", {
        class: "td",
        text: contact_array[indexNum].firstName
    });
    var newLastName = $("<td>", {
        class: "td",
        text: contact_array[indexNum].lastName
    });
    var newEmail = $("<td>", {
        class: "td",
        text: contact_array[indexNum].email
    });
    var newPhone = $("<td>", {
        class: "td",
        text: contact_array[indexNum].phone
    });

    var btnCell = $('<td>', {
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

    $('tbody').append(newRow);
    $('tbody > tr:last-child').append(newFirstName);
    $('tbody > tr:last-child').append(newLastName);
    $('tbody > tr:last-child').append(newPhone);
    $('tbody > tr:last-child').append(newEmail);

    btnCell.append(editButton);
    btnCell.append(delButton);


    $('tbody > tr:last-child').append(btnCell);

    (function () {
        $(delButton).click(function (event) {
            contactId = $(event.target).attr('rowIndex');
            for(var j =0; j<contact_array.length; j++){
                if(contact_array[j].id === contactId){
                    console.log('deleteIndex', deleteIndex);
                    deleteIndex = j;
                }
            }
            deleteFromServer(contactId);

        });
        $(editButton).click(function (event) {
            contactId = $(event.target).attr('rowIndex');
            //console.log("EditBtn clicked");
            $(".confirm-modal").addClass("show-modal");
            $(".confirm-modal").removeClass('hide-modal');

            for(var j =0; j<contact_array.length; j++){
                if(contact_array[j].id === contactId){
                    $("#edit_first_name").val(contact_array[j].firstName);
                    $("#edit_last_name").val(contact_array[j].lastName);
                    $("#edit_phone").val(contact_array[j].phone);
                    $("#edit_email").val(contact_array[j].email);
                }
            }
            
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

function updateServerContact(event){
    event.preventDefault();
    
    var firstName = $('#edit_first_name').val();
    var lastName = $('#edit_last_name').val();
    var email = $('#edit_email').val();
    var phone = $('#edit_phone').val();
    
    var phoneRegex = /^\(\d{3}\)\s?\d{3}-\d{4}$/;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (firstName === '') {
        $( ".edit-form-response" ).text( "Please enter a valid first name" );
    } else if(lastName ===''){
        $( ".edit-form-response" ).text( "Please enter a valid last name" );
    } else if(phoneRegex.test(phone) === false){
        $( ".edit-form-response" ).text( "Please enter a valid phone" );
    } else if(emailRegex.test(email) === false){
        $( ".edit-form-response" ).text( "Please enter a valid email" );
    } else {
        contactObj = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone
        };
        closeModal();
        $.ajax({
            dataType: 'json',
            url: 'php/update.php',
            data: {
                id: contactId,
                firstName: contactObj.firstName,
                lastName: contactObj.lastName,
                email: contactObj.email,
                phone: contactObj.phone
            },
            method: 'post',
            success: successfulUpdate,
            error: errorFromServer
    });
        $( ".edit-form-response" ).text( "" );
    }

}

function removeContact() {
    contact_array.splice(deleteIndex, 1);
    $(".delete-btn[rowIndex=" + contactId + ']').parent().parent().remove();
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
function successfulUpdate(data) {
    console.log('successful update: '+ data.success);
    if (data.success === true) {
        for(var j =0; j<contact_array.length; j++){
            if(contact_array[j].id === contactId){
                contact_array[j].firstName = contactObj.firstName;
                contact_array[j].lastName = contactObj.lastName;
                contact_array[j].email = contactObj.email;
                contact_array[j].phone = contactObj.phone;
                renderEditContact(j);
            }
        }
    }
}

function renderEditContact(editIndex){
//    var test =     $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(1)").text();
//    console.log(test);
    
    $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(1)").text(contact_array[editIndex].firstName);
    
    $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(2)").text(contact_array[editIndex].lastName);

    $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(3)").text(contact_array[editIndex].phone);

    $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(4)").text(contact_array[editIndex].email);
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