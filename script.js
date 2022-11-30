class Reminder {
    constructor(title, priority="high", completed = false) {
        this.title = title;
        this.priority = priority;
        this.date = Date.now();
        this.completed = completed
    }

    getTitle() {
        return this.title;
    }

    getPriority() {
        return this.priority;
    }

    getDate() {
        return this.date;
    }

    getCompleted() {
        return this.completed;
    }
}

// Si existe el local storage, lo metemos en el array, si no, lo creamos vacío
if(localStorage.reminders != null)
    var reminders = JSON.parse(localStorage.getItem('reminders'))
else
    var reminders = [];


$(document).ready(function() {

    if (localStorage.getItem('reminders') != null) {
        writeLocalStorage();
    }

    // Pa darle al enter y que añada el recordatorio

    $("input").keyup(function(e) {
        if (e.keyCode == 13) {
            addToContainer();
        }
    });

    var contadorNotCompleted = 0;

    // Pa eliminar el recordatorio
    $("#remindersContainer").on("click", ".fa-square-minus", function() {
        $(this).parent().parent().remove();
        reminders.splice($(this).parent().parent().index(), 1);
        localStorage.reminders = JSON.stringify(reminders);
    });


    // Pa marcar el recordatorio como completado
    $("#remindersContainer").on("click", ".fa-circle", function() {
        $(this).toggleClass("fa-circle fa-check-circle");
        $(this).siblings("h2").toggleClass("checked");

        var index = $(this).parent().parent().index();
        reminders[index].completed = true;

        localStorage.reminders = JSON.stringify(reminders);

        contadorNotCompleted --;
    });

    // Pa desmarcar el recordatorio como completado
    $("#remindersContainer").on("click", ".fa-check-circle", function() {
        $(this).toggleClass("fa-check-circle fa-circle");
        $(this).siblings("h2").removeClass("checked");
        var index = $(this).parent().parent().index();
        reminders[index].completed = false;

        localStorage.reminders = JSON.stringify(reminders);

        contadorNotCompleted ++;
    });

    // Pa cambiar borrar todos los recordatorios completados
    $("#deleteAll").click(function() {
        $(".fa-check-circle").parent().parent().remove();
        for (var i = 0; i < reminders.length; i++) {
            if (reminders[i].completed) {
                reminders.splice(i, 1);
                i--;
            }
        }
        localStorage.reminders = JSON.stringify(reminders);
    });

    $("h2:not(.checked)").each(function() {
        contadorNotCompleted++;
    });
    
    $("#pendientes").text(`${contadorNotCompleted} pendientes de un total de ${reminders.length}`);

    // Pa cambiar la prioridad del recordatorio

    $("#remindersContainer").on("click", "#low", function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();
        reminders[index].priority = "low";
        localStorage.reminders = JSON.stringify(reminders);
    });

    $("#remindersContainer").on("click", "#medium", function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();
        reminders[index].priority = "medium";
        localStorage.reminders = JSON.stringify(reminders);
    });

    $("#remindersContainer").on("click", "#high", function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();
        reminders[index].priority = "high";
        localStorage.reminders = JSON.stringify(reminders);
    });
});


function addToContainer(createdReminder){
    var inputValue = $('#reminder').val();
    var container = $('#remindersContainer');
    var createdReminder = new Reminder(inputValue);

    // Mete dentro del contenedor el div con el recordatorio correspondiente al crear el objeto

    var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${createdReminder.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Date.now() - createdReminder.getDate()}</p></div></div>`);
    if(inputValue != ''){
        container.append(newReminder);
        $('#reminder').val('');
        reminders.push(createdReminder);
        localStorage.reminders = JSON.stringify(reminders);
    } else {
        $("#reminder").attr("placeholder", "No puedes añadir un recordatorio vacío");
    }
}


function writeLocalStorage() {
    var reminders = JSON.parse(localStorage.getItem('reminders'));
    var container = $('#remindersContainer');

    for (var i = 0; i < reminders.length; i++) {

        var createdReminder = new Reminder(reminders[i].title, reminders[i].priority, reminders[i].completed);

        if(createdReminder.getCompleted() == false){
            if(createdReminder.getPriority() == "low"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${createdReminder.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Added ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutes ago</p></div></div>`);
            } else if(createdReminder.getPriority() == "medium"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${createdReminder.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Added ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutes ago</p></div></div>`);
            } else if(createdReminder.getPriority() == "high"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${createdReminder.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Added ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutes ago</p></div></div>`);
            }
        } else {
            if(createdReminder.getPriority() == "low"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${createdReminder.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Added ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutes ago</p></div></div>`);
            } else if(createdReminder.getPriority() == "medium"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${createdReminder.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Added ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutes ago</p></div></div>`);
            } else if(createdReminder.getPriority() == "high"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${createdReminder.getTitle()}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Added ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutes ago</p></div></div>`);
            }
        }
        container.append(newReminder);
    }
}