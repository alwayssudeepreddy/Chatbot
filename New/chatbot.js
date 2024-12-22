const firebaseConfig = {
    apiKey: "AIzaSyAKTl-sKUZbFggk6m-VXIBA6PMIUGPBExk",
    authDomain: "chatbot-140e4.firebaseapp.com",
    databaseURL: "https://chatbot-140e4-default-rtdb.firebaseio.com",
    projectId: "chatbot-140e4",
    storageBucket: "chatbot-140e4.appspot.com",
    messagingSenderId: "651676130309",
    appId: "1:651676130309:web:812c4c14b9e2919dab106c",
    measurementId: "G-WKJ6JMC1TF"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const chatMessages = document.getElementById('chat-messages');
const optionsContainer = document.getElementById('options');
const userInput = document.getElementById('user-input');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');

let currentLanguage = 'en';
let currentState = 'initial';
let ticketInfo = {};
let ticketCounter = 1000;
let isRegistering = false;
let registrationStep = '';

const ticketPrices = {
    adult: 50,
    child: 25,
    senior: 30
};

const translations = {
    en: {
        welcome: "Welcome to the Tech Titans Ticketing Chatbot! How can I assist you today?",
        options: "Please select an option:",
        bookTicket: "Great! Let's book a ticket. What type of ticket would you like?",
        askName: "Please provide your name.",
        askUserId: "Please provide your user ID.",
        askPassword: "Please provide your password.",
        invalidPassword: "Invalid password. Please try again.",
        confirmation: "Your ticket has been booked. Your ticket number is: ",
        status: "Please provide your ticket number to check the status.",
        cancel: "Please provide your ticket number to cancel the ticket.",
        thankYou: "Thank you for using our service!",
        changeLang: "Please select your language:",
        createUserId: "Please create a user ID.",
        createPassword: "Please create a password for your account.",
        userCreated: "User created successfully. You can now book tickets.",
        userExists: "User ID already exists. Please choose a different user ID.",
        askAdults: "How many adult tickets do you need? (₹50 each)",
        askChildren: "How many child tickets do you need? (₹25 each)",
        askSeniors: "How many senior citizen tickets do you need? (₹30 each)",
        totalPrice: "The total price for your tickets is ₹",
        confirmBooking: "Do you want to confirm this booking? (Yes/No)"
    },
    fr: {
        welcome: "Bienvenue sur le chatbot de billetterie Tech Titans ! Comment puis-je vous aider aujourd'hui ?",
    options: "Veuillez sélectionner une option :",
    bookTicket: "Parfait ! Réservons un billet. Quel type de billet souhaitez-vous ?",
    askName: "Veuillez fournir votre nom.",
    askUserId: "Veuillez fournir votre identifiant utilisateur.",
    askPassword: "Veuillez fournir votre mot de passe.",
    invalidPassword: "Mot de passe invalide. Veuillez réessayer.",
    confirmation: "Votre billet a été réservé. Votre numéro de billet est : ",
    status: "Veuillez fournir votre numéro de billet pour vérifier le statut.",
    cancel: "Veuillez fournir votre numéro de billet pour annuler le billet.",
    thankYou: "Merci d'utiliser notre service !",
    changeLang: "Veuillez sélectionner votre langue :",
    createUserId: "Veuillez créer un identifiant utilisateur.",
    createPassword: "Veuillez créer un mot de passe pour votre compte.",
    userCreated: "Utilisateur créé avec succès. Vous pouvez maintenant réserver des billets.",
    userExists: "L'identifiant utilisateur existe déjà. Veuillez choisir un identifiant différent.",
    askAdults: "Combien de billets adultes souhaitez-vous ? (50 ₹ chacun)",
    askChildren: "Combien de billets enfants souhaitez-vous ? (25 ₹ chacun)",
    askSeniors: "Combien de billets senior souhaitez-vous ? (30 ₹ chacun)",
    totalPrice: "Le prix total de vos billets est de ₹",
    confirmBooking: "Voulez-vous confirmer cette réservation ? (Oui/Non)"
  },
    te: {welcome: "టెక్ టైటాన్స్ టికెట్ బుకింగ్ చాట్‌బాట్‌కు స్వాగతం! నేను మీకు ఈరోజు ఎలా సహాయపడగలను?",
    options: "దయచేసి ఒక ఎంపికను ఎంచుకోండి:",
    bookTicket: "బాగుంది! టికెట్ బుక్ చేద్దాం. మీకు ఏ రకమైన టికెట్ కావాలి?",
    askName: "దయచేసి మీ పేరును అందించండి.",
    askUserId: "దయచేసి మీ వినియోగదారు IDని అందించండి.",
    askPassword: "దయచేసి మీ పాస్‌వర్డ్‌ను అందించండి.",
    invalidPassword: "చెల్లని పాస్‌వర్డ్. దయచేసి మళ్లీ ప్రయత్నించండి.",
    confirmation: "మీ టికెట్ బుక్ చేయబడింది. మీ టికెట్ సంఖ్య: ",
    status: "టికెట్ స్థితిని తనిఖీ చేయడానికి దయచేసి మీ టికెట్ సంఖ్యను అందించండి.",
    cancel: "టికెట్‌ను రద్దు చేయడానికి దయచేసి మీ టికెట్ సంఖ్యను అందించండి.",
    thankYou: "మా సేవను ఉపయోగించినందుకు ధన్యవాదాలు!",
    changeLang: "దయచేసి మీ భాషను ఎంచుకోండి:",
    createUserId: "దయచేసి ఒక వినియోగదారు IDని సృష్టించండి.",
    createPassword: "దయచేసి మీ ఖాతా కోసం పాస్‌వర్డ్‌ను సృష్టించండి.",
    userCreated: "వినియోగదారు విజయవంతంగా సృష్టించబడ్డారు. మీరు ఇప్పుడు టికెట్లను బుక్ చేసుకోవచ్చు.",
    userExists: "వినియోగదారు ID ఇప్పటికే ఉంది. దయచేసి వేరొక IDని ఎంచుకోండి.",
    askAdults: "మీకు ఎన్ని పెద్దల టికెట్లు కావాలి? (ఒక్కొక్కటి ₹50)",
    askChildren: "మీకు ఎన్ని పిల్లల టికెట్లు కావాలి? (ఒక్కొక్కటి ₹25)",
    askSeniors: "మీకు ఎన్ని వృద్ధుల టికెట్లు కావాలి? (ఒక్కొక్కటి ₹30)",
    totalPrice: "మీ టికెట్ల మొత్తం ధర ₹",
    confirmBooking: "మీరు ఈ బుకింగ్‌ను నిర్ధారించాలనుకుంటున్నారా? (అవును/కాదు)"
  }
};


function showLanguageOptions() {
    addMessage('bot', translations[currentLanguage].changeLang);
    showOptions([
        { text: 'English', handler: () => changeLanguage('en') },
        { text: 'Français', handler: () => changeLanguage('fr') },
        { text: 'తెలుగు', handler: () => changeLanguage('te') }
    ]);
}

function changeLanguage(lang) {
    currentLanguage = lang;
    addMessage('bot', translations[currentLanguage].welcome);
    showInitialOptions();
}

function showInitialOptions() {
    userInput.style.display = 'none';
    showOptions([
        { text: 'Register New User', handler: () => handleInitialState('Register New User') },
        { text: 'Book a Ticket', handler: () => handleInitialState('Book a Ticket') },
        { text: 'Check Ticket Status', handler: () => handleInitialState('Check Ticket Status') },
        { text: 'Cancel Ticket', handler: () => handleInitialState('Cancel Ticket') },
        { text: 'Recommend Nearby Museums', handler: () => recommendMuseums() },
        { text: 'Guide', handler: () => openGuide() },
        { text: 'Change Language', handler: () => handleInitialState('Change Language') }
    ]);
}

function handleInitialState(option) {
    switch (option) {
        case 'Register New User':
            isRegistering = true;
            registrationStep = 'askUserId';
            addMessage('bot', translations[currentLanguage].createUserId);
            userInput.style.display = 'flex';
            break;
        case 'Book a Ticket':
            currentState = 'askUserId';
            addMessage('bot', translations[currentLanguage].askUserId);
            userInput.style.display = 'flex';
            break;
        case 'Check Ticket Status':
            currentState = 'checkStatus';
            addMessage('bot', translations[currentLanguage].status);
            userInput.style.display = 'flex';
            break;
        case 'Cancel Ticket':
            currentState = 'cancelTicket';
            addMessage('bot', translations[currentLanguage].cancel);
            userInput.style.display = 'flex';
            break;
        case 'Change Language':
            showLanguageOptions();
            break;
    }
}

function handleUserInput() {
    const message = messageInput.value.trim();
    if (message !== '') {
        addMessage('user', message);
        messageInput.value = '';

        if (isRegistering) {
            handleRegistration(message);
        } else {
            handleNormalFlow(message);
        }
    }
}

function handleRegistration(message) {
    switch (registrationStep) {
        case 'askUserId':
            ticketInfo.userId = message;
            registrationStep = 'askPassword';
            addMessage('bot', translations[currentLanguage].createPassword);
            break;
        case 'askPassword':
            createUser(ticketInfo.userId, message);
            break;
    }
}

function handleNormalFlow(message) {
    switch (currentState) {
        case 'askUserId':
            ticketInfo.userId = message;
            currentState = 'askPassword';
            addMessage('bot', translations[currentLanguage].askPassword);
            break;
        case 'askPassword':
            verifyUser(ticketInfo.userId, message);
            break;
        case 'askTicketType':
            ticketInfo.type = message;
            currentState = 'askAdults';
            addMessage('bot', translations[currentLanguage].askAdults);
            break;
        case 'askAdults':
            ticketInfo.adults = parseInt(message);
            currentState = 'askChildren';
            addMessage('bot', translations[currentLanguage].askChildren);
            break;
        case 'askChildren':
            ticketInfo.children = parseInt(message);
            currentState = 'askSeniors';
            addMessage('bot', translations[currentLanguage].askSeniors);
            break;
        case 'askSeniors':
            ticketInfo.seniors = parseInt(message);
            calculateTotalPrice();
            break;
        case 'confirmBooking':
            if (message.toLowerCase() === 'yes' || message.toLowerCase() === 'oui' || message.toLowerCase() === 'అవును') {
                bookTicket();
            } else {
                addMessage('bot', translations[currentLanguage].welcome);
                showInitialOptions();
            }
            break;
        case 'checkStatus':
            checkTicketStatus(message);
            break;
        case 'cancelTicket':
            cancelTicket(message);
            break;
    }
}

function createUser(userId, password) {
    firebase.database().ref('users/' + userId).once('value', (snapshot) => {
        if (snapshot.exists()) {
            addMessage('bot', translations[currentLanguage].userExists);
            registrationStep = 'askUserId';
            addMessage('bot', translations[currentLanguage].createUserId);
        } else {
            firebase.database().ref('users/' + userId).set({
                password: password
            }, (error) => {
                if (error) {
                    addMessage('bot', 'Error creating user. Please try again.');
                } else {
                    addMessage('bot', translations[currentLanguage].userCreated);
                    isRegistering = false;
                    showInitialOptions();
                }
            });
        }
    });
}

function verifyUser(userId, password) {
    firebase.database().ref('users/' + userId).once('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.password === password) {
            currentState = 'askTicketType';
            addMessage('bot', translations[currentLanguage].bookTicket);
        } else {
            addMessage('bot', translations[currentLanguage].invalidPassword);
            currentState = 'askPassword';
        }
    });
}

function calculateTotalPrice() {
    const total = (ticketInfo.adults * ticketPrices.adult) +
                  (ticketInfo.children * ticketPrices.child) +
                  (ticketInfo.seniors * ticketPrices.senior);
    ticketInfo.totalPrice = total;
    addMessage('bot', `${translations[currentLanguage].totalPrice}${total}`);
    currentState = 'confirmBooking';
    addMessage('bot', translations[currentLanguage].confirmBooking);
}

function bookTicket() {
    ticketCounter++;
    ticketInfo.ticketNumber = `TKT${ticketCounter}`;
    firebase.database().ref('tickets/' + ticketInfo.ticketNumber).set(ticketInfo);
    addMessage('bot', translations[currentLanguage].confirmation + ticketInfo.ticketNumber);
    addMessage('bot', `${translations[currentLanguage].totalPrice}${ticketInfo.totalPrice}`);
    showInitialOptions();
}

function checkTicketStatus(ticketNumber) {
    firebase.database().ref('tickets/' + ticketNumber).once('value', (snapshot) => {
        const ticketData = snapshot.val();
        if (ticketData) {
            addMessage('bot', `Ticket ${ticketNumber} is valid for ${ticketData.name}.`);
        } else {
            addMessage('bot', `Ticket ${ticketNumber} not found.`);
        }
        showInitialOptions();
    });
}

function cancelTicket(ticketNumber) {
    firebase.database().ref('tickets/' + ticketNumber).remove((error) => {
        if (error) {
            addMessage('bot', `Error cancelling ticket ${ticketNumber}.`);
        } else {
            addMessage('bot', `Ticket ${ticketNumber} has been cancelled.`);
        }
        showInitialOptions();
    });
}

function recommendMuseums() {
    const museums = [
        'Visvesvaraya Industrial and Technological Museum',
        'National Gallery of Modern Art (NGMA)',
        'Bangalore Palace',
        'The HAL Aerospace Museum'
    ];
    const recommendationsHtml = museums.map(museum => `<div class="museum-recommendation">${museum}</div>`).join('');
    chatMessages.innerHTML += recommendationsHtml;
    showInitialOptions();
}

function openGuide() {
    window.open('guide.html', '_blank');
}

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender + '-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showOptions(options) {
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.classList.add('option-button');
        button.onclick = option.handler;
        optionsContainer.appendChild(button);
    });
}

sendButton.addEventListener('click', handleUserInput);
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Initialize the chatbot
addMessage('bot', translations[currentLanguage].welcome);
showInitialOptions();