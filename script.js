/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
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
 * initializes the application, including adding click handlers and pulling in any data from the server
 */
function initializeApp() {
    addClickHandlersToElements();
    pullFromServer();
}


/***************************************************************************************************
 * addClickHandlerstoElements
 * @params {undefined} 
 * @returns  {undefined}
 *  attaches click handlers to the buttons within the app   
 */
function addClickHandlersToElements() {
    $('.submit-btn').on('click', handleSubmitClicked);
    $('.close-modal, .cancel-edit').on('click', closeEditModal);
    $('.close-modal, .cancel-delete').on('click', closeDeleteModal);
    $('#phone, #edit_phone').mask('(000) 000-0000');
    $('.confirm-edit').on('click', updateServerContact);
    $('.confirm-delete').on('click', deleteFromServer);
    
    $('.edit-input').keypress(function (event) {
     var key = event.which;
     if(key === 13)  // the enter key code
      {
        $('.confirm-edit').click();
        return false;  
      }
    });   
    window.onscroll = function() {fixTableHead()};
}

function fixTableHead(){
    if (window.pageYOffset > 300) {
        $('.tableHead').addClass("fixed");
    } else {
        $('.tableHead').removeClass("fixed");
  }
}

/***************************************************************************************************
 * closeEditModal and closeDeleteModal - attaches hide modal class and removes show modal class to modals
 * @param: none
 * @return: 
       none
 */

function closeEditModal(){
    $(".confirm-modal").addClass('hide-modal');
    $(".confirm-modal").removeClass('show-modal');
}

function closeDeleteModal(){
    $(".delete-modal").addClass('hide-modal');
    $(".delete-modal").removeClass('show-modal');
}

function handleSubmitClicked(event) {
    event.preventDefault();
    addContact();
}

/***************************************************************************************************
 * addContact - creates a contact object based on input fields in the form and performs form validation
 * @param {undefined} none
 * @return undefined
 * @calls addToServer
 */
function addContact() {
    var firstName = $('#first_name').val();
    var lastName = $('#last_name').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    
    var phoneRegex = /^\(\d{3}\)\s?\d{3}-\d{4}$/;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!/\S/.test(firstName)) {
        $( ".form-response" ).text( "Please enter a valid first name" );
    } else if(!/\S/.test(lastName)){
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
 * clearAddContactForm - clears out the form values based on inputIds variable
 */
function clearAddContactFormInputs() {
    $('#first_name').val("");
    $('#last_name').val("");
    $('#email').val("");
    $('#phone').val("");
}
/***************************************************************************************************
 * renderContactOnDom - take in a contact index, creates html elements from the values and then appends the elements
 * into the table tbody
 * @param index for a single contact object
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
            $(".delete-modal").addClass("show-modal");
            $(".delete-modal").removeClass('hide-modal');
            
            for(var j =0; j<contact_array.length; j++){
                if(contact_array[j].id === contactId){
                    console.log('deleteIndex', deleteIndex);
                    deleteIndex = j;
                    var name = contact_array[j].firstName + " " + contact_array[j].lastName+"?";
                    $( ".remove-contact" ).text( "Remove contact "+name );
                }
            }
            
            
        });
        $(editButton).click(function (event) {
            contactId = $(event.target).attr('rowIndex');
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
 * updateContactList - centralized function to update the contact array list
 * @param type {string} checkif rendering all contacts or a single added contact
 * @returns {undefined} none
 * @calls renderContactOnDom
 */
function updateContactList(string) {
    var length = contact_array.length - 1;
    if(contact_array.length === 0){
        $("tbody").text("No Contacts Available!");
    }
    if (string === 'add') {
        if(contact_array.length === 1){
            $("tbody").text("");
        }
        renderContactOnDom(length);
    } else {
        for (var i = 0; i < contact_array.length; i++) {
            renderContactOnDom(i);
        }
    }
}

/***************************************************************************************************
 * updateServerContact - updates server when contact is edited
 * @param  {event} 
 * @returns {undefined} none
 * @calls ajax call to update the database table
 */
function updateServerContact(event){
    event.preventDefault();
    
    var firstName = $('#edit_first_name').val();
    var lastName = $('#edit_last_name').val();
    var email = $('#edit_email').val();
    var phone = $('#edit_phone').val();
    
    var phoneRegex = /^\(\d{3}\)\s?\d{3}-\d{4}$/;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!/\S/.test(firstName)) {
        $( ".edit-form-response" ).text( "Please enter a valid first name" );
    } else if(!/\S/.test(lastName)){
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
        closeEditModal();
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

/***************************************************************************************************
 * removeContact - deletes contact from DOM
 * @param  {event} 
 * @returns {undefined} none
 * @none
 */
function removeContact() {
    contact_array.splice(deleteIndex, 1);
    $(".delete-btn[rowIndex=" + contactId + ']').parent().parent().remove();
    
    if(contact_array.length === 0){
        $("tbody").text("No Contacts Available!");
    }
}

/***************************************************************************************************
 * pullFromServer - reads data from server
 * @param  {none} 
 * @returns {undefined} none
 * @calls ajax call to reaD the database table
 */

function pullFromServer() {
    $.ajax({
        dataType: 'json',
        url: 'php/read.php',
        method: 'post',
        success: successfulPull,
        error: errorFromServer

    });

}

/***************************************************************************************************
 * successfulUpdate - updates the contact array after pulling from server
 * @param  {event} 
 * @returns {undefined} none
 * @calls renderEditContact
 */
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

/***************************************************************************************************
 * renderEditContact - updates DOM when contact is edited
 * @param  {index}  
 * @returns {undefined} none
 * @calls none
 */
function renderEditContact(editIndex){
    $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(1)").text(contact_array[editIndex].firstName);
    
    $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(2)").text(contact_array[editIndex].lastName);

    $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(3)").text(contact_array[editIndex].phone);

    $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(4)").text(contact_array[editIndex].email);
}

/***************************************************************************************************
 * successfulPull - updates contact array when data is pulled from database
 * @param  {data} 
 * @returns {undefined} none
 * @calls updateContactList
 */
function successfulPull(data) {
    dataPull = data.data;
    
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

/***************************************************************************************************
 * errorFromServer - console log for error 
 * @param  {error} 
 * @returns {undefined} none
 * @calls none
 */
function errorFromServer(error) {
    console.log('something went wrong :(', error);
}

/***************************************************************************************************
 * addToServer - adds contact to database 
 * @param  {contact} 
 * @returns {undefined} none
 * @calls ajax call to create new contact
 */
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

/***************************************************************************************************
 * successfulAdd - adds contact to array 
 * @param  {data} 
 * @returns {undefined} none
 * @calls updateContactList, clearAddContactFormInputs
 */
function successfulAdd(data) {
    console.log('successful add: '+ data);
    if (data.success === true) {
        contactObj.id = data.id;
        contact_array.push(contactObj);
        updateContactList('add');
        clearAddContactFormInputs();
    }
}

/***************************************************************************************************
 * deleteFromServer - deletes contact from database 
 * @param  {none} 
 * @returns {undefined} none
 * @calls ajax call to delete contact
 */
function deleteFromServer() {
    closeDeleteModal();
    $.ajax({
        dataType: 'json',
        url: 'php/delete.php',
        data: {
            id: contactId
        },
        method: 'post',
        success: successfulDelete,
        error: errorFromServer
    });
}

/***************************************************************************************************
 * successfulDelete - deletes contact from database response
 * @param  {data} 
 * @returns {undefined} none
 * @calls removeContact
 */

function successfulDelete(data) {
    console.log('successful delete: ' + data.success);
    if (data.success === true) {
        removeContact();
    }

}