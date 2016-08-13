// Frase inicialmente exibida para homens
var maleInitialPhrase = "Eu me vejo como um homem...";

// Perguntas feitas para homens
var maleQuestions = new Array(
        "Extrovertido, entusiasta.",
        "Crítico, conflituoso.",
        "De confiança, com auto-disciplina.",
        "Ansioso, que se chateia/aborrece facilmente.",
        "Aberto a experiências novas, complexo / difícil / complicado.",
        "Reservado, calado.",
        "Compreensivo/solidário, afetuoso.",
        "Desorganizado, descuidado.",
        "Calmo, emocionalmente estável.",
        "Convencional, pouco criativo."
        );

// Frase inicialmente exibida para mulheres
var femaleInitialPhrase = "Eu me vejo como uma mulher...";

// Perguntas feitas para mulheres
var femaleQuestions = new Array(
        "Extrovertida, entusiasta.",
        "Crítica, conflituosa.",
        "De confiança, com auto-disciplina.",
        "Ansiosa, que se chateia/aborrece facilmente.",
        "Aberta a experiências novas, complexa / difícil / complicada.",
        "Reservada, calada.",
        "Compreensiva/solidária, afetuosa.",
        "Desorganizada, descuidada.",
        "Calma, emocionalmente estável.",
        "Convencional, pouco criativa."
        );

// Identifica se a aplicação utilizará ou não modo debug
var DEBUG_MODE = false;

// KeyCode das teclas que NÃO são aceitas (para evitar que o usuário digite o texto de forma incorreta)
// Workaround para navegadores que retornam valores diferentes para o código das teclas no onKeyDown
var invalidKeyCodes = new Array(8, 9, 20, 16, 27, 17, 18, 46, 34, 33, 36, 35, 45, 112, 113, 114, 115, 117, 118, 119, 120, 121, 37, 38, 39, 40);





// Frase inicialmente exibida para o participante
// antes de cada pergunta "Eu me vejo como..."
var initialPhrase;

// Perguntas utilizadas no questionário atual
var questions;

// Índice da questão atual
var currentQuestionIndex;





var targetText = "b";//ao digitar este pequeno texto estou auxiliando no desenvolvimento de uma pesquisa, permitindo que os dados do meu modo de digitar possam ser analisados para o desenvolvimento de novas tecnologias";

// Total de vezes que o usuário digitou o texto completo
var typedCount = 0;

// Total de vezes que o usuário terá que digitar o texto completo
var totalTypingRepetition = 2;

// Índice do caracter atual do texto que deve ser digitado
// (Até onde o usuário já digitou)
var currentCharacterIndex = 0;






var screenManager = new ScreenManager();





function init() {
    // Inicializa a API sem 
    PersonalityAPI.init(false);
    
    // Habilita/Desabilita o modo de debug
    PersonalityAPI.showDebug(DEBUG_MODE); 
    // Seta a API para ignorar teclas que NÃO são LETRAS
    //PersonalityAPI.setIgnoreNoncharacter(true);
    
    // Seta o método de validação da tecla pressionada
    PersonalityAPI.validateKeyMethod = isValidCharacter;
    // Seta o ID do keystroke inicial
    PersonalityAPI.currentKeystroke = 1;
    
    // Inicializa o ScreenManager
    screenManager.init();
    
    var now = new Date();
    PersonalityAPI.startTime = now.getTime();
}


function onKeyPress(event) {
    var keyCode = (event.which ? event.which : event.charCode);        
    
    // Caso seja um caracter válido para a posição
    // atual do texto (apenas o character correto é aceito)
    if (isValidCharacter(keyCode)) {
        currentCharacterIndex++;        
    } else {
        if (event.preventDefault) {
            event.preventDefault();  
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
        }        
    }
}

/**
 * Método chamado sempre que uma tecla é pressionada
 * Verifica se nenhuma tecla inválida foi pressionada
 * @param {type} event
 * @returns {undefined}
 */
function onKeyDown(event) {
    console.log("onKeyDown");
    var textArea = document.getElementById("aboutYourSelfText");
    moveCursorToTheEndOfTheText(textArea);
    
    var keyCode = (event.which ? event.which : event.charCode); 
    for (var i = 0; i < invalidKeyCodes.length; i++) {
        if (keyCode == invalidKeyCodes[i]) {
            if (event.preventDefault) {
                event.preventDefault();  
            }
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            }
            break;
        }
    }
}

/**
 * Identifica se o character pressionado é valido
 * para a posição atual do texto. Apenas o character
 * ATUAL do texto é aceito.
 * @param {integer} keyCode
 * @returns {boolean}
 */
function isValidCharacter(keyCode) {
    if (currentCharacterIndex < targetText.length) {        
        var currentCharacterCode = targetText[currentCharacterIndex].charCodeAt(0);
        var lowerCaseKeyCode = PersonalityAPI.getLowerCaseKeycode(keyCode);
        //if (keyCode == currentCharacterCode) {
        if (lowerCaseKeyCode == currentCharacterCode) {
            //console.log("keyCode " + keyCode + " digitado corretamente.");
            return true;
        } else {
            //console.log(keyCode + " esperado " + targetText[currentCharacterIndex].charCodeAt(0));            
        }
    } else {
        //console.log("Texto completamente digitado.");
    }
    return false;
}



/**
 *  Botão de confirmação da tela de introdução foi pressionado
 */
function onIntroductionConfirmButtonClick () {
    screenManager.showNextScreen();
}

/**
 * Botão de confirmação na pesquisa foi pressionado 
 */
function onConsentFormConfirmButtonClick() {
    var acceptTermElement = document.getElementById("acceptTerm");
    if (acceptTermElement != null) {
        var accepted = acceptTermElement.checked;
        if (accepted) {
            screenManager.showNextScreen();
        } else {
            alert("Atenção\n\nÉ necessário aceitar o termo de consentimento para continuar.");
        }
    }    
}


/**
 * Método chamado quando um click ocorre na TextArea
 * @param {type} textArea
 * @returns {undefined}
 */
function onTextAreaClick(textArea) {
    moveCursorToTheEndOfTheText(textArea);
}

/**
 * Move o cursor do mouse para o fim do texto
 * @param {type} textArea
 * @returns {undefined}
 */
function moveCursorToTheEndOfTheText(textArea) {
    if (typeof textArea.selectionStart == "number") {
        textArea.selectionStart = textArea.selectionEnd = textArea.value.length;
    } else if (typeof textArea.createTextRange != "undefined") {
        textArea.focus();
        var range = textArea.createTextRange();
        range.collapse(false);
        range.select();
    }
}

/**
 * Um gênero foi selecionado
 * @param {boolean} male - TRUE masculino, FALSE feminino
 */
function onRegisterButtonClick() {
    // Idade
    var ageField = document.getElementById("ageField");
    var age = parseInt(ageField.value);
    var isValidAge = true;
    if (isNaN(age) || (age <= 0)) {
        isValidAge = false;
        alert("Idade inválida (" + ageField.value + ").");
        ageField.value = "";        
    }
    
    // Caso seja valor válido para idade
    if (isValidAge) {    
        // Nome
        var nameField = document.getElementById("nameField");        
        
        // E-mail
        var emailField = document.getElementById("emailField");        

        // Gênero        
        var genderElements = document.getElementsByName("genderRadio");
        var gender;
        for ( var i = 0; i < genderElements.length; i++) {
            if (genderElements[i].checked) {            
                gender = genderElements[i].value;                                
                break;
            }
        }
        
        // Seta as propriedades do usuário
        PersonalityAPI.user.setName(nameField.value);
        PersonalityAPI.user.setEmail(emailField.value);
        PersonalityAPI.user.setAge(age);
        PersonalityAPI.user.setGender(gender);
        
        // Gênero foi selecionado
        onGenderSelected(gender);                
        
        // Exibe a primeira pergunta
        currentQuestionIndex = 0;
        var question = getCurrentQuestion();
        showQuestion(question);

        // Ativa a captura de keystroke
        PersonalityAPI.setActive(true);
        
        
        var targetTextElement = document.getElementById("targetText");
        targetTextElement.innerHTML = targetText;
        
        var textArea = document.getElementById("aboutYourSelfText");
        textArea.value = "";		
        
        var typedCountElement = document.getElementById("typedCount");
        typedCountElement.innerHTML = ((typedCount + 1) + "/" + totalTypingRepetition);        			
		        
        screenManager.showNextScreen();
        textArea.focus();
		
		// Adiciona o listener para eventos de teclado
        addKeyboardListeners();
		
		var now = new Date();
        PersonalityAPI.keystrokeStartTime = now.getTime();       
    }
}

function onGenderSelected(gender) {
    var isMale = (gender == "M" ? true : false);
    // Define as perguntas de acordo com o gênero do participante
    if (isMale) {
        initialPhrase = maleInitialPhrase;
        questions = maleQuestions;
    } else {
        initialPhrase = femaleInitialPhrase;
        questions = femaleQuestions;
    }

    // Seta a frase inicial das perguntas
    var initialPhraseContainer = document.getElementById("initialPhrase");
    initialPhraseContainer.innerHTML = initialPhrase;
}



function onKeystrokeExtractionSendButtonClick() {
    // TODO: Verificar se texto foi digitado corretamente
    // (completametne digitado)
    
    var textArea = document.getElementById("aboutYourSelfText");  
    var typedText = textArea.value;
    
    // Caso o texto tenha sido completamente digitado
    if (currentCharacterIndex >= targetText.length){
        // Caso o texto tenha sido corratamente digitado
        if (typedText.toLowerCase() == targetText.toLowerCase()) {       
            typedCount++;
            // Para para o próximo keystroke
            PersonalityAPI.currentKeystroke++;
            
            // Digitou a quantidade de vezes necessária
            if (typedCount >= totalTypingRepetition) {
                var now = new Date();
                PersonalityAPI.keystrokeEndTime = now.getTime();
                PersonalityAPI.tipiStartTime = now.getTime();
                
                // Desativa a captura de keystroke
                PersonalityAPI.setActive(false);
                
                // Remove o listener para eventos de teclado
                removeKeyboardListeners();
                
                // Mostra próxima tela da aplicação
                screenManager.showNextScreen();                
            } else {
                // Ainda não digitou o número necessário de vezes
                currentCharacterIndex = 0;
                textArea.value = "";            
                alert("Texto digitado corretamente.\n\nSerá necessário digitá-lo apenas mais " + (totalTypingRepetition - typedCount) + " vez.");
                textArea.focus();

                var typedCountElement = document.getElementById("typedCount");
                typedCountElement.innerHTML = ((typedCount + 1) + "/" + totalTypingRepetition);
            }
        } else {
            // Ocorreu algum erro. Reiniciar teste
            alert("Ocorreu um erro no processo de análise do seu ritmo de digitação. O teste será reiniciado.");
            // Recarrega a página
            location.reload();
        }
    } else {
        alert("Você ainda não digitou o texto totalmente.\n\nPor favor, digite todo o texto antes de passar para a próxima etapa.");
    }    
}


function onAnswerButtonClick() {
    var answers = document.getElementsByName("answer");
    var answerId;
    var found = false;
    for (i = 0; i < answers.length; i++) {
        // Caso encontre um radio selecionado
        if (answers[i].checked) {            
            // Desmarca a opção selecionada
            answers[i].checked = false;
            // Obtem o valor da resposta
            answerId = parseInt(answers[i].value);
            //console.log("[" + getCurrentQuestionIndex() + "] " + getCurrentQuestion() + " -> " + answerId);

            PersonalityAPI.onTIPIAnswer(getCurrentQuestionIndex(), answerId);

            
            // Passa para a prõxima questão
            var nextQuestion = getNextQuestion();
            if (nextQuestion != null) {
                showQuestion(nextQuestion);
            } else {
                var now = new Date();
                PersonalityAPI.endTime = now.getTime();
                PersonalityAPI.tipiEndTime = now.getTime();                
                
                // Salva as informações do usuário no banco de dados
                //PersonalityAPI.save();
                
                
                showPersonalityTraits();
                screenManager.showNextScreen();
            }
            found = true;
            break;
        }
    }
    
    // Caso nenhuma resposta tenha sido encontrada
    if (!found) {
        alert("Por favor, selecione a alternativa que mais se adequa à sua personalidade.");
    }
}

function getCurrentQuestion() {
    if (questions != null) {
        if (currentQuestionIndex < questions.length) {
            return questions[currentQuestionIndex];
        }
    }
    return null;
}

function getCurrentQuestionIndex() {
    return currentQuestionIndex;
}

function getNextQuestion() {
    if (questions != null) {
        if (currentQuestionIndex < questions.length) {
            currentQuestionIndex++;
            var currentQuestion = questions[currentQuestionIndex];            
            return currentQuestion;
        }
    }
    return null;
}

function showQuestion(question) {
    var questionContainer = document.getElementById("question");
    questionContainer.innerHTML = question;

    // Desmarca todas as opções
    var answer = document.getElementsByName("answer");
    for (i = 0; i < answer.length; i++) {
        answer[i].checked = false;
    }
    var questionCounter = document.getElementById("questionCounter");
    questionCounter.innerHTML = ((currentQuestionIndex + 1) + "/" + questions.length);
}

function onFinishTestButtonClick() {
    window.location.reload();
    //window.open(window.location, '_self').close();
}

// Retorna o valor inverso da resposta do TIPI
function getReverseResponse(response) {
    return (8 - response);    
}

function showPersonalityTraits() {
    var user = PersonalityAPI.getUser();
    var tipi = user.getTIPI().getAnswers();
    
    // Soma das respostas do tipi
    var extraversion = ((tipi[0] + getReverseResponse(tipi[5])) / 2);
    var agreeableness = ((getReverseResponse(tipi[1]) + tipi[6]) / 2);
    var conscientiousness = ((tipi[2] + getReverseResponse(tipi[7])) / 2);
    var emotionalStability = ((getReverseResponse(tipi[3]) + tipi[8]) / 2);
    var opennessToExperiences = ((tipi[4] + getReverseResponse(tipi[9])) / 2);
    
    var data = google.visualization.arrayToDataTable([
      ['Traço', 'Valor'],
      ['Extroversão', extraversion],
      ['Socialização', agreeableness],
      ['Realização', conscientiousness],
      ['Neuroticismo', emotionalStability],
      ['Abertura', opennessToExperiences]
    ]);

    var title;    
    var userName = user.getName();

    if ((userName != null) && (userName.length > 0)) {
        title = ("Traços da personalidade de " + userName);
    } else {
        title = "Traços da sua personalidade";
    }

    var options = {
        title: title,
        pieHole: 0.4,        
        width: 900,
        height: 500
    };
    var chart = new google.visualization.PieChart(document.getElementById('personalityData'));
    chart.draw(data, options);
    
    // Adiciona o botão de share com Facebook
    showShareButton(extraversion, agreeableness, conscientiousness, emotionalStability, opennessToExperiences);
}

function showShareButton(extraversion, agreeableness, conscientiousness, emotionalStability, opennessToExperiences) {    
    var shareURL = ("http://www.felipegoulart.com/personalityapi/personality.php?extraversion=" + extraversion + "&agreeableness=" + agreeableness + "&conscientiousness=" + conscientiousness + "&emotionalStability=" + emotionalStability + "&opennessToExperiences=" + opennessToExperiences);
    var shareButton = document.createElement("div");
    shareButton.setAttribute("id", "facebookShareButton");
    shareButton.setAttribute("class", "fb-share-button");
    shareButton.setAttribute("data-href", shareURL);
    shareButton.setAttribute("data-layout", "button");

    var personalityDataContainer = document.getElementById("personalityDataContainer");
    alert(shareButton);
    alert(personalityDataContainer);
    personalityDataContainer.parentNode.insertBefore(shareButton, personalityDataContainer);
    FB.XFBML.parse();
}


function addKeyboardListeners() {
    if (window.addEventListener) {        
        document.addEventListener("keypress", onKeyPress, true);
        document.addEventListener("keydown", onKeyDown, true);
    } else {
        if (window.attachEvent) {            
            document.attachEvent("onkeypress", onKeyPress);
            document.attachEvent("onkeydown", onKeyDown);
        }
    }
}

function removeKeyboardListeners() {
    if (window.addEventListener) {        
        document.removeEventListener("keypress", onKeyPress, true);
        document.removeEventListener("keydown", onKeyDown, true);
    } else {
        if (window.attachEvent) {            
            document.detachEvent("onkeypress", onKeyPress);
            document.detachEvent("onkeydown", onKeyDown);
        }
    }
}

if (window.addEventListener) {
    window.addEventListener('load', init, true);    
} else {
    if (window.attachEvent) {
        window.attachEvent('onload', init);        
    } else {
        console.log("[Main]: O método init() NÃO será executado pois addEventListener e attachEvent NÃO são suportados.");
    }
}
