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

/***************************************************************************************************
 * initializeApp 
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp() {
    addClickHandlersToElements();
    onLoad();
    //renderContactOnDom();
    //renderGradeAverage();
}

function onLoad() {
    console.log('onLoad');
    //pullFromServer();
}

/***************************************************************************************************
 * addClickHandlerstoElements
 * @params {undefined} 
 * @returns  {undefined}
 *     
 */
function addClickHandlersToElements() {
    $('.submit-btn').on('click', handleSubmitClicked);
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
        var contactObj = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone
        };
        contact_array.push(contactObj);
        updateContactList('add');
        clearAddContactFormInputs();
        //console.log(contact_array);
        //addToServer(studentObj);
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
        'rowIndex': indexNum,
        text: "Delete"
    });
    var editButton = $('<button>', {
        type: 'button',
        class: "edit-btn",
        'rowIndex': indexNum,
        text: "Edit"
    });

    $('.table').append(newRow);
    $('.table > .tr:last-child').append(newFirstName);
    $('.table > .tr:last-child').append(newLastName);
    $('.table > .tr:last-child').append(newEmail);
    $('.table > .tr:last-child').append(newPhone);

    btnCell.append(editButton);
    btnCell.append(delButton);


    $('.table > .tr:last-child').append(btnCell);

    (function () {
        $(delButton).click(function (event) {
            var index = $(event.target).attr('rowIndex');
            console.log("DeleteBtn Index: " + index);
            //deleteIndex = index;
            //deleteFromServer(index);

            //removeStudent(index);

        });
        $(editButton).click(function (event) {
            var index = $(event.target).attr('rowIndex');
            console.log("EditBtn Index: " + index);
            //deleteIndex = index;
            //deleteFromServer(index);
            editContact(index);
            //removeStudent(index);

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
    
}

function removeStudent(index) {
    contact_array.splice(index, 1);
    $(".delete-btn[rowIndex=" + index + ']').parent().parent().remove();
}

function pullFromServer() {
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        data: {
            api_key: 'DgBqwGulF2'
        },
        method: 'post',
        success: successfulPull,
        error: errorPull

    });

}

function successfulPull(data) {
    console.log('success: ' + data);
    dataPull = data.data;
    console.log(dataPull);
    addServerDataToArray();
}

function errorPull() {
    console.log('something went wrong :(');
}

function addServerDataToArray() {
    var dataObj = {};
    contact_array = [];
    for (var j = 0; j < dataPull.length; j++) {

        dataObj = {
            id: dataPull[j].id,
            name: dataPull[j].name,
            course: dataPull[j].course,
            grade: dataPull[j].grade
        };
        //console.log('dataObj: '+ dataObj);
        contact_array.push(dataObj);
    }
    console.log('StudentArray: ' + contact_array);
    updateContactList('server');
}

function addToServer(student) {
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        data: {
            api_key: 'DgBqwGulF2',
            name: student.name,
            course: student.course,
            grade: student.grade
        },
        method: 'post',
        success: successfulAdd,
        error: errorPull
    });
}

function successfulAdd(data) {
    //console.log('successful add: '+ data);
    if (data.success === true) {
        var lastIndex = contact_array.length - 1;
        contact_array[lastIndex].id = data.new_id;
    }

    //console.log(contact_array);
}

function deleteFromServer(index) {
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/delete',
        data: {
            api_key: 'DgBqwGulF2',
            student_id: contact_array[index].id
        },
        method: 'post',
        success: successfulDelete,
        error: errorPull
    });
}

function successfulDelete(data) {
    console.log('successful delete: ' + data.success);
    if (data.success === true) {
        removeStudent(deleteIndex);
    }

}
