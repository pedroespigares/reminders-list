// Si existe el local storage, lo metemos en el array, si no, lo creamos vacío

if(localStorage.reminders != null)
    var reminders = JSON.parse(localStorage.getItem('reminders'))
else
    var reminders = [];

$(document).ready(function() {

    var contadorNotCompleted = 0;
    var total = reminders.length;

    if (localStorage.getItem('reminders') != null) {
        writeLocalStorage();
    }

    // Para darle al enter y que añada el recordatorio

    $("input").keyup(function(e) {
        if (e.keyCode == 13) {
            addToContainer();
            total ++;
            contadorNotCompleted ++;
            $("#pendientes").text(`${contadorNotCompleted} pendientes de un total de ${total}`);
        }
    });

    // Para eliminar el recordatorio

    $("#remindersContainer").on("click", ".fa-square-minus", function() {
        $(this).fadeOut("normal", function() {
            $(this).parent().parent().remove()
        });
        reminders.splice($(this).parent().parent().index(), 1);
        localStorage.reminders = JSON.stringify(reminders);
        total --;
        contadorNotCompleted --;

        if(contadorNotCompleted > 0){
            $("#pendientes").text(`${contadorNotCompleted} pendientes de un total de ${total}`);
        } else {
            $("#pendientes").text(`0 pendientes de un total de ${total}`);
        }
    });


    // Para marcar el recordatorio como completado

    $("#remindersContainer").on("click", ".fa-circle", function() {
        $(this).toggleClass("fa-circle fa-check-circle");
        $(this).siblings("h2").toggleClass("checked");

        var index = $(this).parent().parent().index();
        reminders[index].completed = true;

        localStorage.reminders = JSON.stringify(reminders);

        contadorNotCompleted --;

        if(contadorNotCompleted > 0){
            $("#pendientes").text(`${contadorNotCompleted} pendientes de un total de ${total}`);
        } else {
            $("#pendientes").text(`0 pendientes de un total de ${total}`);
        }
    });

    // Para desmarcar el recordatorio como completado

    $("#remindersContainer").on("click", ".fa-check-circle", function() {
        $(this).toggleClass("fa-check-circle fa-circle");
        $(this).siblings("h2").removeClass("checked");
        var index = $(this).parent().parent().index();
        reminders[index].completed = false;

        localStorage.reminders = JSON.stringify(reminders);

        contadorNotCompleted ++;
        $("#pendientes").text(`${contadorNotCompleted} pendientes de un total de ${total}`);
    });

    // Para cambiar borrar todos los recordatorios completados

    $("#deleteAll").click(function() {
        var contadorRemoved = 0;
        $(".fa-check-circle").parent().parent().hide("normal", function() {
            $(".fa-check-circle").parent().parent().remove();
            for (var i = 0; i < reminders.length; i++) {
                if (reminders[i].completed) {
                    contadorRemoved ++;
                    reminders.splice(i, 1);
                    i--;
                }
            }
            total -= Math.floor(contadorRemoved/2);
            localStorage.reminders = JSON.stringify(reminders);

            if(contadorNotCompleted > 0){
                $("#pendientes").text(`${contadorNotCompleted} pendientes de un total de ${total}`);
            } else {
                $("#pendientes").text(`0 pendientes de un total de ${total}`);
            }
        });
    });

    $("h2:not(.checked)").each(function() {
        contadorNotCompleted++;
    });

    if(contadorNotCompleted > 0){
            $("#pendientes").text(`${contadorNotCompleted} pendientes de un total de ${total}`);
    } else {
            $("#pendientes").text(`0 pendientes de un total de ${total}`);
    }

    // Para cambiar la prioridad del recordatorio

    changePriority("low");
    changePriority("medium");
    changePriority("high");
});















function addToContainer(){
    var inputValue = $('#reminder').val();
    var container = $('#remindersContainer');

    var createdReminder = {
        title: inputValue,
        priority: 3,
        date: Date.now(),
        completed: false
    }

    // Mete dentro del contenedor el div con el recordatorio correspondiente al crear el objeto

    var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${createdReminder.title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - createdReminder.date)/1000)/60)} minutos</p></div></div>`).hide();
    if(inputValue != ''){
        container.append(newReminder);
        $('#reminder').val('');
        newReminder.show("normal");
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

        // Dependiendo de la prioridad y de si esta completada o no, se hace un div u otro

        if(reminders[i].completed == false){
            if(reminders[i].priority == 1){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            } else if(reminders[i].priority == 2){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            } else if(reminders[i].priority == 3){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            }
        } else {
            if(reminders[i].priority == 1){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            } else if(reminders[i].priority == 2){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            } else if(reminders[i].priority == 3){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            }
        }
        container.append(newReminder);
        newReminder.show(0);
    }
}

function changePriority(priority){
    $("#remindersContainer").on("click", `#${priority}`, function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();

        if(priority == "low"){
            var realPriority = 1;
        } else if(priority == "medium"){
            var realPriority = 2;
        } else if(priority == "high"){
            var realPriority = 3;
        }

        reminders[index].priority = realPriority;
        
        reminders.sort(function(a, b) {
            return b.priority - a.priority;
        });
        
        localStorage.reminders = JSON.stringify(reminders);
        refreshView();
    });
}

function refreshView(){
    $("#remindersContainer").empty();
    writeLocalStorage();
}