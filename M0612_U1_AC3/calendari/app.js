// ==========================================================================
// PRÀCTICA: CALENDARI I AGENDA EN JAVASCRIPT VANILLA
// ==========================================================================

// --- ESTAT GLOBAL I ELEMENTS DEL DOM ---

let currentDate = new Date(); // Data actual que es mostra al calendari
let selectedDateKey = null;   // Data seleccionada en format 'YYYY-MM-DD'

// En la Fase 1 i 2 farem servir aquest objecte en memòria.
// En la Fase 3 el connectarem amb LocalStorage!
let events = {};

// Selecció d'elements del DOM (Ja completat)
const monthYearDisplay = document.getElementById('month-year-display');
const daysGrid = document.getElementById('days-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const selectedDateDisplay = document.getElementById('selected-date-display');
const eventForm = document.getElementById('event-form');
const eventInput = document.getElementById('event-input');
const eventsList = document.getElementById('events-list');

const notifyBtn = document.getElementById('notify-btn');
const shareBtn = document.getElementById('share-btn');

const monthNames = [
  "Gener", "Febrer", "Març", "Abril", "Maig", "Juny", 
  "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
];


// ==========================================================================
// FASE 1: RENDERITZAT DEL CALENDARI I NAVEGACIÓ (DATE + DOM)
// ==========================================================================

/**
 * Retorna una data en format YYYY-MM-DD amb zeros a l'esquerra si cal.
 */
function formatDateKey(year, month, day) {
    // TODO: Converteix el mes (+1) i el dia, respectivament, a String i omple amb zeros a l'esquerra amb .padStart(2, '0')

    const formattedMonth = String(month + 1).padStart(2, '0');

    const formattedDay = String(day).padStart(2, '0');
    // TODO: Retorna data en format YYYY-MM-DD
    return `${year}-${formattedMonth}-${formattedDay}`;
}

/**
 * Genera i dibuixa la graella de dies del mes actual.
 */
function renderCalendar() {
  // TODO 1: Neteja el contingut actual de 'daysGrid'

  // TODO 2: Obtén l'any i el mes de 'currentDate' i actualitza el text de '#monthYearDisplay'
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0 = Gener, 11 = Desembre
    
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;    
    // Neteja el contingut actual de 'daysGrid'
    daysGrid.innerHTML = '';

  // TODO 3: Càlcul de caselles buides inicials (padding):
  //  - Obtén el primer dia de la setmana del mes: new Date(year, month, 1).getDay()
      const firstDayIndex = new Date(year, month, 1).getDay();
  //  - Ajusta-ho perquè la setmana comenci en Dilluns (Dilluns = 0, Diumenge = 6)
      const paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  //  - Crea les caselles buides (<div class="day empty"></div>) i afegeix-les a 'daysGrid' (appendChild)
      for (let i = 0; i < paddingDays; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'day empty';
      daysGrid.appendChild(emptyDiv);
    }
  // TODO 4: Càlcul de dies totals del mes:
  //  - Utilitza el truc: new Date(year, month + 1, 0).getDate()
    const totalDays = new Date(year, month + 1, 0).getDate();


  // TODO 5: Bucle per dibuixar cada dia (1..totalDays):
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    for (let day = 1; day <= totalDays; day++) {

  //  - Crea un div amb la classe .day i el text del número de dia
      const dayElement = document.createElement('div');
      dayElement.className = 'day';
      dayElement.textContent = day; 
  //  - Genera la clau 'dateKey' fent servir formatDateKey()
      const dateKey = formatDateKey(year, month, day);

  //  - Afegeix la classe .today si el dia, mes i any coincideixen amb la data actual d'avui (new Date())
      if (day === todayDay && month === todayMonth && year === todayYear) {
      dayElement.classList.add('today');
    }
  //  - Afegeix la classe .has-events si existeix events[dateKey] amb elements
      if (events && events[dateKey] && events[dateKey].length > 0) {
      dayElement.classList.add('has-events');
    }
  //  - Afegeix la classe .selected si dateKey === selectedDateKey
      if (dateKey === selectedDateKey) {
      dayElement.classList.add('selected');
    }
  //  - Assigna l'esdeveniment click per cridar a selectDate(dateKey, dayElement) ALERTA, FUNCIÓ NO IMPLEMENTADA ENCARA
      dayElement.addEventListener('click', () => {
      if (typeof selectDate === 'function') {
        selectDate(dateKey, dayElement);
      } else {
        // Temporalment guardem la selecció i refresquem per veure l'efecte visual
        selectedDateKey = dateKey;
        renderCalendar();
      }
    });
  //  - Afegeix la casella a 'daysGrid' (appendChild)
     daysGrid.appendChild(dayElement);
  }
    
}

// TODO: Escoltadors d'esdeveniments per als botons de navegació prevBtn i nextBtn
// (Sumar o restar 1 mes a 'currentDate' i tornar a cridar renderCalendar())
  prevBtn.addEventListener('click', () => {
  // Retrocedim un mes en l'objecte currentDate
  currentDate.setMonth(currentDate.getMonth() - 1);
  
  // Després de modificar la data, tornem a cridar sempre renderCalendar()
  renderCalendar();
});

// Botó per anar al mes següent (endavant)
  nextBtn.addEventListener('click', () => {
  // Avancem un mes en l'objecte currentDate
  currentDate.setMonth(currentDate.getMonth() + 1);
  
  // Després de modificar la data, tornem a cridar sempre renderCalendar()
  renderCalendar();
});

// ==========================================================================
// FASE 2: SELECCIÓ DE DIA I GESTIÓ D'ESDEVENIMENTS EN MEMÒRIA
// ==========================================================================

/**
 * Selecciona un dia del calendari i actualitza la interfície.
 */
function selectDate(dateKey, element) {
  // TODO 1: Elimina la classe .selected de tots els dies (.day)
  const allDays = document.querySelectorAll('.day');
  allDays.forEach(day => {
    day.classList.remove('selected');
  });
  // TODO 2: Afegeix la classe .selected al dia clicat i actualitza 'selectedDateKey'
  element.classList.add('selected');
  selectedDateKey = dateKey;
  // TODO 3: Actualitza el títol 'selectedDateDisplay' i crida a renderEvents()
  selectedDateDisplay.textContent = `Data: ${dateKey}`;

  renderEvents();
}

function renderEvents() {
  console.log(`Renderitzant esdeveniments per a la data: ${selectedDateKey}`);
}

/**
 * Renderitza la llista d'esdeveniments del dia seleccionat.
 */
function renderEvents() {
  // TODO 1: Neteja 'eventsList'
    eventsList.innerHTML = '';
  // TODO 2: Si no hi ha 'selectedDateKey', surt de la funció
    if (!selectedDateKey) return;
  // TODO 3: Obtén els esdeveniments de 'selectedDateKey' o un array buit
    const dayEvents = events[selectedDateKey] || [];
  // TODO 4: Recorre els esdeveniments i crea els <li> amb un <span> (✕) per eliminar-los
    dayEvents.forEach((eventText, index) => {
    // 1. Crea l'element de la llista <li> i assigna-li el text de la tasca
    const li = document.createElement('li');
    li.textContent = eventText;

    // 2. Crea l'element <span> per al botó d'eliminar (✕)
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = ' ✕';
    deleteBtn.className = 'delete-btn'; // Aplica el teu estil CSS vermell

    // 3. Assigna l'escoltador de clic que cridarà a removeEvent(index)
    deleteBtn.addEventListener('click', () => {
      removeEvent(index);
    });

    // 4. Afegeix el botó d'eliminar al <li> i el <li> a la llista ul del DOM
    li.appendChild(deleteBtn);
    eventsList.appendChild(li);
  });

}

/**
 * Afegir un nou esdeveniment a la data seleccionada.
 */
function addEvent(e) {
  e.preventDefault();
  // TODO 1: Valida que hi hagi un dia seleccionat (selectedDateKey) i text a l'input
  if (!selectedDateKey) {
    alert("Per favor, selecciona un dia al calendari abans d'afegir una tasca.");
    return;
  }
  const text = eventInput.value.trim();
  if (text === '') return;

  // TODO 2: Si no existeix events[selectedDateKey], inicialitza-ho com un array buit []
  if (!events[selectedDateKey]) {
    events[selectedDateKey] = [];
  }
  // TODO 3: Afegeix el text a l'array d'esdeveniments de la data
  events[selectedDateKey].push(text);
  // TODO 4: Neteja l'input i torna a cridar renderEvents() i renderCalendar()
  saveEvents();
  eventInput.value = '';
  
  renderEvents();   // Actualitza la llista visual inferior de tasques
  renderCalendar();


  sendNotification(
    'Nova tasca creada',
    'La tasca s\'ha afegit correctament.'
);

}

/**
 * Elimina un esdeveniment per la seva posició (índex).
 */
function removeEvent(index) {
  // TODO 1: Elimina l'element de l'array amb splice(index, 1)
  events[selectedDateKey].splice(index, 1);
  // TODO 2: Si l'array es queda buit, elimina la clau de l'objecte 'events' amb 'delete'
  if (events[selectedDateKey].length === 0) {
    delete events[selectedDateKey];
  }
  // TODO 3: Torna a cridar renderEvents() i renderCalendar()
  renderEvents();
  renderCalendar();
  saveEvents();
}

// TODO: Escoltador d'esdeveniment per al formulari eventForm (submit -> addEvent)
eventForm.addEventListener('submit', addEvent);

// ==========================================================================
// FASE 3: PERSISTÈNCIA DE DADES (LOCALSTORAGE I JSON)
// ==========================================================================

/**
 * Desa l'objecte 'events' a LocalStorage convertit a text JSON.
 */
function saveEvents() {
  // TODO: Utilitza JSON.stringify(events) i localStorage.setItem('calendar_events', ...)
  localStorage.setItem('calendar_events', JSON.stringify(events));
}

/**
 * Carrega els esdeveniments de LocalStorage en iniciar l'aplicació.
 */
function loadEvents() {
  // TODO: Utilitza localStorage.getItem('calendar_events') i JSON.parse()
  const saved = localStorage.getItem('calendar_events');
  // Retorna l'objecte obtingut o un objecte buit {} si no hi havia res guardat.
  return saved ? JSON.parse(saved) : {};
}

// TODO: Modifica addEvent() i removeEvent() perquè cridin a saveEvents() després de modificar dades.
function removeEvent(index) {

    // Remove the event
    events[selectedDateKey].splice(index, 1);

    // Delete the date if there are no events left
    if (events[selectedDateKey].length === 0) {
        delete events[selectedDateKey];
    }

    // Save the changes
    saveEvents();

    // Update the screen
    renderEvents();
    renderCalendar();
}

// ==========================================================================
// FASE 4: RESTA D'APIS DEL NAVEGADOR (NOTIFICATION I WEB SHARE)
// ==========================================================================

/**
 * Mostra una notificació del sistema si tenim permís concedit.
 */
function sendNotification(title, body) {
  // TODO: Comprova si Notification.permission === 'granted' i crea una new Notification()
  // Mira a la pràctica AC2 com es fa!
      if ('Notification' in window) {

      if (Notification.permission === 'granted') {
          new Notification(title, {
            body: body
        });

    }
}
}
// TODO: Escoltador d'esdeveniment per a 'notifyBtn' (Sol·licitar permisos de notificació)
// Mira a la pràctica AC2 com es fa!

notifyBtn.addEventListener('click', function () {

    if ('Notification' in window) {

        Notification.requestPermission().then(function (permission) {

            if (permission === 'granted') {

                sendNotification(
                    'Welcome!',
                    'Notifications are now enabled.'
                );

            }

        });

    }
});



// TODO: Escoltador d'esdeveniment per a 'shareBtn' (Web Share API amb fallback a clipboard)
// Mira a la pràctica AC2 com es fa!


shareBtn.addEventListener('click', async function () {

    // Prepare the summary of the selected day's tasks
    let textSummary = 'Tasques del dia ' + selectedDateKey + '\n\n';

    if (events[selectedDateKey]) {
        events[selectedDateKey].forEach(function (event) {
            textSummary += '- ' + event.title + '\n';
        });
    } else {
        textSummary += 'No hi ha tasques per aquest dia.';
    }

    // if (navigator.share) { ----------------------------error----que l'usuari ha cancel·lat el menú de compartició-----

    //     await navigator.share({
    //         title: `Agenda del dia ${selectedDateKey}`,
    //         text: textSummary
    //     });

    // } else {

    //     await navigator.clipboard.writeText(textSummary);

    //     alert('El resum s\'ha copiat al porta-retalls.');
    // }                      -----------------------------error-----que l'usuari ha cancel·lat el menú de compartició-----

      if (navigator.share) {

    try {
        await navigator.share({
            title: `Agenda del dia ${selectedDateKey}`,
            text: textSummary
        });

    } catch (error) {

        if (error.name === 'AbortError') {
            // The user cancelled sharing
            console.log('Compartició cancel·lada.');
        } else {
            console.error('Error en compartir:', error);
        }
    }

} else {

    // Fallback: copy the text to the clipboard
    try {
        await navigator.clipboard.writeText(textSummary);
        alert('El resum s\'ha copiat al porta-retalls.');

    } catch (error) {
        console.error('Error en copiar el text:', error);
        alert('No s\'ha pogut copiar el resum.');
    }
}

});


// ==========================================================================
// INICIALITZACIÓ DE L'APLICACIÓ
// ==========================================================================

function initApp() {
  // TODO 1: Carrega els esdeveniments des de LocalStorage cridant loadEvents()
  // TODO 2: Crida inicial a renderCalendar() per dibuixar la interfície inicial
  events = loadEvents();
  const today = new Date();

    selectedDateKey = formatDateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    // Display the selected date
    selectedDateDisplay.textContent = `Data: ${selectedDateKey}`;
  renderCalendar();
  renderEvents();

}

initApp();
