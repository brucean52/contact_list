$(document).ready(initializeApp);

function initializeApp() {
    var modelContactList = new ModelContact();
    var viewContactList = new ViewContact(modelContactList);
    var ctrlContactList = new CtrlContact(modelContactList, viewContactList);

    ctrlContactList.clickHandlers();
    ctrlContactList.loadContactsFromServer();
}

class ModelContact {
    constructor() {
        this.contact_array = [];
        this.dataPull;
        this.deleteIndex = null;
        this.contactId = null;
        this.contactObj = {};
        this.sendContact = false;
        this.firstNameSort = 0;
        this.lastNameSort = 0;

        this.createContactObject = this.createContactObject.bind(this);
    }

    pushContactToArray(contactObject) {
        this.contact_array.push(contactObject);
    }

    updateContactArray(index) {
        this.contact_array[index].id = this.contactObj.id;
        this.contact_array[index].firstName = this.contactObj.firstName;
        this.contact_array[index].lastName = this.contactObj.lastName;
        this.contact_array[index].email = this.contactObj.email;
        this.contact_array[index].phone = this.contactObj.phone;
    }

    createContactObject(id, first, last, email, phone) {
        this.contactObj = {
            id: id,
            firstName: first,
            lastName: last,
            email: email,
            phone: phone
        }
    }

    addContactObjId(id) {
        this.contactObj.id = id;
    }

    sendContact() {
        this.sendContact = true;
    }

    removeContactFromArray() {
        this.contact_array.splice(this.deleteIndex, 1);
    }
    compareFirst(a, b) {
        a = a.firstName.toLowerCase();
        b = b.firstName.toLowerCase();
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    }

    compareFirstUp(a, b) {
        a = a.firstName.toLowerCase();
        b = b.firstName.toLowerCase();
        if (b < a)
            return -1;
        if (b > a)
            return 1;
        return 0;
    }
    compareLast(a, b) {
        a = a.lastName.toLowerCase();
        b = b.lastName.toLowerCase();
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    }

    compareLastUp(a, b) {
        a = a.lastName.toLowerCase();
        b = b.lastName.toLowerCase();
        if (b < a)
            return -1;
        if (b > a)
            return 1;
        return 0;
    }
}

class ViewContact {
    constructor(model) {
        this.model = model;

        $('#phone, #edit_phone').mask('(000) 000-0000');

        this.$submitBtn = $('.submit-btn');
        this.$closeEditModal = $('.close-modal, .cancel-edit');
        this.$closeDeleteModal = $('.close-modal, .cancel-delete');
        this.$confirmEdit = $('.confirm-edit');
        this.$confirmDelete = $('.confirm-delete');
        this.$clearBtn = $('.clear-btn');
        this.$firstNameSort = $('.first-name-sort');
        this.$lastNameSort = $('.last-name-sort');
        this.$editInput = $('.edit-input');
        this.$window = $(window);

    }

    fixTable() {
        if (this.$window.scrollTop() > 300) {
            $('.tableHead').addClass("fixed");
        } else {
            $('.tableHead').removeClass("fixed");
        }
    }

    addContact() {
        var firstName = $('#first_name').val();
        var lastName = $('#last_name').val();
        var email = $('#email').val();
        var phone = $('#phone').val();

        var phoneRegex = /^\(\d{3}\)\s?\d{3}-\d{4}$/;
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!/\S/.test(firstName)) {
            $(".form-response").text("Please enter a valid first name");
        } else if (!/\S/.test(lastName)) {
            $(".form-response").text("Please enter a valid last name");
        } else if (phone === "" && email === "") {
            $(".form-response").text("Enter either a phone or email");
        } else if (phone !== "" && phoneRegex.test(phone) === false) {
            $(".form-response").text("Please enter a valid phone");
        } else if (email !== "" && emailRegex.test(email) === false) {
            $(".form-response").text("Please enter a valid email");
        } else {
            this.model.createContactObject(null, firstName, lastName, email, phone);
            this.model.sendContact = true;
        }
    }

    clearAddContactFormInputs() {
        $('#first_name').val("");
        $('#last_name').val("");
        $('#email').val("");
        $('#phone').val("");
    }

    updateContactList(string) {
        var lastIndex = this.model.contact_array.length - 1;
        if (this.model.contact_array.length === 0) {
            $("tbody").text("No Contacts Available!");
        }

        switch (string) {
            case 'add':
                if (this.model.contact_array.length === 1) {
                    $("tbody").text("");
                }
                this.renderContactOnDom(lastIndex);
                break;
            case 'sort':
                $("tbody").empty();
                /** Fall Through**/
            default:
                for (var i = 0; i < this.model.contact_array.length; i++) {
                    this.renderContactOnDom(i);
                }
                break;
        }
    }

    renderContactOnDom(indexNum) {
        var newRow = $("<tr>", {
            class: "tr"
        });
        var newFirstName = $("<td>", {
            class: "td",
            text: this.model.contact_array[indexNum].firstName
        });
        var newLastName = $("<td>", {
            class: "td",
            text: this.model.contact_array[indexNum].lastName
        });
        var newEmail = $("<td>", {
            class: "td",
            text: this.model.contact_array[indexNum].email
        });
        var newPhone = $("<td>", {
            class: "td",
            text: this.model.contact_array[indexNum].phone
        });

        var btnCell = $('<td>', {
            class: "td buttons"
        });
        var delButton = $('<button>', {
            type: 'button',
            class: "delete-btn",
            'rowIndex': this.model.contact_array[indexNum].id,
            text: "Delete"
        });
        var editButton = $('<button>', {
            type: 'button',
            class: "edit-btn",
            'rowIndex': this.model.contact_array[indexNum].id,
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
            var self = this;
            $(delButton).click(function (event) {
                self.model.contactId = $(event.target).attr('rowIndex');
                $(".delete-modal").addClass("show-modal");
                $(".delete-modal").removeClass('hide-modal');

                for (var j = 0; j < self.model.contact_array.length; j++) {
                    if (self.model.contact_array[j].id === self.model.contactId) {
                        self.model.deleteIndex = j;
                        var name = self.model.contact_array[j].firstName + " " + self.model.contact_array[j].lastName + "?";
                        $(".remove-contact").text("Remove contact " + name);
                    }
                }


            });
            $(editButton).click(function (event) {
                self.model.contactId = $(event.target).attr('rowIndex');
                $(".confirm-modal").addClass("show-modal");
                $(".confirm-modal").removeClass('hide-modal');

                for (var j = 0; j < self.model.contact_array.length; j++) {
                    if (self.model.contact_array[j].id === self.model.contactId) {
                        $("#edit_first_name").val(self.model.contact_array[j].firstName);
                        $("#edit_last_name").val(self.model.contact_array[j].lastName);
                        $("#edit_phone").val(self.model.contact_array[j].phone);
                        $("#edit_email").val(self.model.contact_array[j].email);
                    }
                }

            });
        }).bind(this)()
    }

    editContact() {

        var firstName = $('#edit_first_name').val();
        var lastName = $('#edit_last_name').val();
        var email = $('#edit_email').val();
        var phone = $('#edit_phone').val();

        var phoneRegex = /^\(\d{3}\)\s?\d{3}-\d{4}$/;
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!/\S/.test(firstName)) {
            $(".edit-form-response").text("Please enter a valid first name");
        } else if (!/\S/.test(lastName)) {
            $(".edit-form-response").text("Please enter a valid last name");
        } else if (phone === "" && email === "") {
            $(".edit-form-response").text("Enter either a phone or email");
        } else if (phone !== "" && phoneRegex.test(phone) === false) {
            $(".edit-form-response").text("Please enter a valid phone");
        } else if (email !== "" && emailRegex.test(email) === false) {
            $(".edit-form-response").text("Please enter a valid email");
        } else {
            this.model.createContactObject(this.model.contactId, firstName, lastName, email, phone);
            this.model.sendContact = true;
            this.closeEditModal();
            $(".edit-form-response").text("");
        }
    }

    renderEditContact(editIndex) {
        var contactId = this.model.contact_array[editIndex].id;
        $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(1)").text(this.model.contact_array[editIndex].firstName);

        $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(2)").text(this.model.contact_array[editIndex].lastName);

        $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(3)").text(this.model.contact_array[editIndex].phone);

        $(".edit-btn[rowIndex=" + contactId + ']').parent().parent().find(".td:nth-of-type(4)").text(this.model.contact_array[editIndex].email);
    }

    removeContactFromDom() {
        $(".delete-btn[rowIndex=" + this.model.contactId + ']').parent().parent().remove();

        if (this.model.contact_array.length === 0) {
            $("tbody").text("No Contacts Available!");
        }
    }

    closeEditModal() {
        $(".confirm-modal").addClass('hide-modal');
        $(".confirm-modal").removeClass('show-modal');
    }

    closeDeleteModal() {
        $(".delete-modal").addClass('hide-modal');
        $(".delete-modal").removeClass('show-modal');
    }

    firstSortUp() {
        $('.sort-icon-first').removeClass("fa-sort-down");
        $('.sort-icon-first').addClass("fa-sort-up");
    }

    firstSortDown() {
        $('.sort-icon-first').removeClass("fa-sort-up");
        $('.sort-icon-first').addClass("fa-sort-down");
    }

    firstHideIcon() {
        $('.sort-icon-first').addClass("hide-icon");
    }
    
    firstShowIcon(){
        $('.sort-icon-first').removeClass("hide-icon");
    }

    lastSortUp() {
        $('.sort-icon-last').removeClass("fa-sort-down");
        $('.sort-icon-last').addClass("fa-sort-up");
    }

    lastSortDown() {
        $('.sort-icon-last').removeClass("fa-sort-up");
        $('.sort-icon-last').addClass("fa-sort-down");
    }
    lastShowIcon(){
      $('.sort-icon-last').removeClass("hide-icon");  
    }
    lastHideIcon() {
       $('.sort-icon-last').addClass("hide-icon");  
    }
}

class CtrlContact {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    clickHandlers() {
        this.view.$submitBtn.on('click', this.handleSubmitClicked.bind(this));
        this.view.$closeEditModal.on('click', this.view.closeEditModal.bind(this));
        this.view.$closeDeleteModal.on('click', this.view.closeDeleteModal.bind(this));
        this.view.$confirmEdit.on('click', this.updateServerContact.bind(this));
        this.view.$confirmDelete.on('click', this.deleteFromServer.bind(this));
        this.view.$clearBtn.on('click', this.view.clearAddContactFormInputs.bind(this));
        this.view.$firstNameSort.on('click', this.sortFirstName.bind(this));
        this.view.$lastNameSort.on('click', this.sortLastName.bind(this));
        this.view.$window.on('scroll', this.fixTableHead.bind(this));

        this.view.$firstNameSort.hover(this.firstNameHover.bind(this), this.firstNameHoverOff.bind(this));

        this.view.$lastNameSort.hover(this.lastNameHover.bind(this), this.lastNameHoverOff.bind(this));

        this.view.$editInput.keypress(function (event) {

            var key = event.which;
            if (key === 13) // the enter key code
            {
                $('.confirm-edit').click();
                return false;
            }
        });
    }

    fixTableHead() {
        this.view.fixTable();
    }

    firstNameHover() {
        switch (this.model.firstNameSort) {
            case -1:
                this.view.firstSortUp();
                break;
            case 0:
                this.view.firstShowIcon();
                break;
            case 1:
                this.view.firstSortDown();
                break;
            default:
                break;
        }
    }

    firstNameHoverOff() {
        switch (this.model.firstNameSort) {
            case -1:
                this.view.firstSortDown();
                break;
            case 0:
                this.view.firstHideIcon();
                break;
            case 1:
                this.view.firstSortUp();
                break;
            default:
                break;
        }
    }

    lastNameHover() {
        switch (this.model.lastNameSort) {
            case -1:
                this.view.lastSortUp();
                break;
            case 0:
                this.view.lastShowIcon();
                break;
            case 1:
                this.view.lastSortDown();
                break;
            default:
                break;
        }
    }

    lastNameHoverOff() {
        switch (this.model.lastNameSort) {
            case -1:
                this.view.lastSortDown();
                break;
            case 0:
                this.view.lastHideIcon();
                break;
            case 1:
                this.view.lastSortUp();
                break;
            default:
                break;
        }
    }

    loadContactsFromServer() {
        var self = this;
        var model = self.model;
        var view = self.view;
        $.ajax({
            dataType: 'json',
            url: 'php/read.php',
            method: 'post',
            success: function (data) {
                model.dataPull = data.data;
                for (var j = 0; j < model.dataPull.length; j++) {
                    model.createContactObject(model.dataPull[j].id, model.dataPull[j].firstName, model.dataPull[j].lastName, model.dataPull[j].email, model.dataPull[j].phone);

                    model.pushContactToArray(model.contactObj);
                }
                view.updateContactList();
            },
            error: self.errorFromServer
        });
    }

    handleSubmitClicked(event) {
        event.preventDefault();
        this.view.addContact();

        if (this.model.sendContact) {
            var self = this;
            var model = self.model;
            var view = self.view;
            $.ajax({
                dataType: 'json',
                url: 'php/create.php',
                data: {
                    firstName: model.contactObj.firstName,
                    lastName: model.contactObj.lastName,
                    email: model.contactObj.email,
                    phone: model.contactObj.phone
                },
                method: 'post',
                success: function (data) {

                    if (data.success === true) {
                        model.addContactObjId(data.id.toString());
                        model.pushContactToArray(model.contactObj);
                        view.updateContactList('add');
                        view.clearAddContactFormInputs();
                        model.sendContact = false;
                    }
                },
                error: self.errorFromServer
            });
        }
    }


    updateServerContact(event) {
        event.preventDefault();
        this.view.editContact();

        if (this.model.sendContact) {

            var self = this;
            var model = self.model;
            var view = self.view;

            $.ajax({
                dataType: 'json',
                url: 'php/update.php',
                data: {
                    id: model.contactObj.id,
                    firstName: model.contactObj.firstName,
                    lastName: model.contactObj.lastName,
                    email: model.contactObj.email,
                    phone: model.contactObj.phone
                },
                method: 'post',
                success: function (data) {
                    if (data.success === true) {
                        for (var j = 0; j < model.contact_array.length; j++) {

                            if (model.contact_array[j].id === model.contactId) {
                                model.updateContactArray(j);
                                view.renderEditContact(j);
                                model.sendContact = false;
                            }
                        }
                    }
                },
                error: self.errorFromServer
            });
        }

    }

    deleteFromServer() {
        this.view.closeDeleteModal();
        var self = this;
        var model = self.model;
        var view = self.view;
        $.ajax({
            dataType: 'json',
            url: 'php/delete.php',
            data: {
                id: model.contactId
            },
            method: 'post',
            success: function (data) {
                if (data.success === true) {
                    model.removeContactFromArray();
                    view.removeContactFromDom();
                }
            },
            error: self.errorFromServer
        });
    }

    sortFirstName() {
        this.view.lastHideIcon();
        if (this.model.firstNameSort === 0 || this.model.firstNameSort === 1) {         
            this.model.contact_array.sort(this.model.compareFirst);
            this.model.firstNameSort = -1;
            this.model.lastNameSort = 0;
            this.view.firstSortDown();
        } else if(this.model.firstNameSort === -1){
            
            this.model.contact_array.sort(this.model.compareFirstUp);
            this.model.firstNameSort = 1;
            this.model.lastNameSort = 0;
            this.view.firstSortUp();
        }
        this.view.updateContactList("sort");
    }

    sortLastName() {
        this.view.firstHideIcon();
        if (this.model.lastNameSort === 0 || this.model.lastNameSort === 1) { 
            this.model.contact_array.sort(this.model.compareLast);
            this.model.lastNameSort = -1;
            this.model.firstNameSort = 0;
            this.view.lastSortDown();
        } else if(this.model.lastNameSort === -1){
            this.model.contact_array.sort(this.model.compareLastUp);
            this.model.lastNameSort = 1;
            this.model.firstNameSort = 0;
            this.view.lastSortUp();
        }
        this.view.updateContactList("sort");
    }

    errorFromServer() {
        console.log('Error sending to server :(');
    }
}
