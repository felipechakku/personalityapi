// Objeto que representa a API
var PersonalityAPI = {};


/** Código ASCII de telas úteis */

// KeyCode do ENTER
var ENTER_CODE = 13;

// KeyCode do TAB
var TAB_CODE = 9;

// KeyCode do A maiúsculo
var UPPER_CASE_A_CODE = 65;
// KeyCode do Z maiúsculo
var UPPER_CASE_Z_CODE = 90;

// KeyCode do A minúsculo
var LOWER_CASE_A_CODE = 97;
// KeyCode do Z minúsculo
var LOWER_CASE_Z_CODE = 122;




/** Variáveis APENAS para a aplicação de teste **/
PersonalityAPI.validateKeyMethod = null;

PersonalityAPI.currentKeystroke = null;


PersonalityAPI.startTime = null;
PersonalityAPI.endTime = null;

PersonalityAPI.keystrokeStartTime = null;
PersonalityAPI.keystrokeEndTime = null;

PersonalityAPI.tipiStartTime = null;
PersonalityAPI.tipiEndTime = null;
/** Fim das variáveis APENAS para a aplicação de teste**/




PersonalityAPI.HTTP_REQUEST_METHOD = "POST";
PersonalityAPI.HOST_URL = "";





// Usuário que está sendo analisado
PersonalityAPI.user = null;

// Lista de teclas atualmente pressionadas
PersonalityAPI.heldKeys = new Array();

// Identifica se teclas que NÃO são LETRAS devem ser ignoradas (TRUE)
// ou armazenadas normalmente (FALSE)
PersonalityAPI.ignoreNoncharacter = false;

// Identifica se a API está ativa (capturando keystroke) ou desativada
PersonalityAPI.isActive = false;


/**
 * Inicializa a API 
 * @param {boolean} activate - Identifica se API deve ser ativada ao inicializar
 * Ativar a API significa adicionar os listener necessários para seu funcionamento,
 * permitindo o inicio da captura das teclas digitadas
 */
PersonalityAPI.init = function(activate) {
    // Cria a instância do usuário
    PersonalityAPI.user = new User(PersonalityAPI.generateUUID());
    
    // Caso a API deva ser ativada
    if (activate) {
        PersonalityAPI.setActive(true);
    }
    
    console.log("[PersonalityAPI]: {init} API inicializada.");
};

/**
 * Habilita/Desabilita a API
 * @param {boolean} active - Identifica se a API deve ser ativada ou desativada 
 */
PersonalityAPI.setActive = function(active) {
    // Caso a API deva ser ativada
    if (active) {
        // Caso a API ainda NÃO esteja ativa
        if (!PersonalityAPI.isActive) {
            PersonalityAPI.addListeners();
        }
    } else {
        // Caso a API esteja ativa
        if (PersonalityAPI.isActive) {
            PersonalityAPI.removeListeners();
        }
    }
    // Marca a API como ativada/desativada
    PersonalityAPI.isActive = active;
};



/**
 * Método executado quando uma tecla é pressionada
 * @param {type} event 
 */
PersonalityAPI.onKeyDown = function(event) {    
    var keyCode = parseInt(event.keyCode);
    // Caso a tecla já esteja pressionada
    if (PersonalityAPI.heldKeys[keyCode]) {
        return;
    }
    
    // Identifica se a tecla pressionada é válida
    // para a configuração atual da API
    var validKey = PersonalityAPI.isValidKey(keyCode);
    
    // Caso seja uma tecla válida para a aplicação
    if (validKey) {
        // Seta a tecla como pressionada
        PersonalityAPI.heldKeys[keyCode] = true;
        
        // Informa a classe de controle do usuário
        // sobre a ocorrência de um keyDown
        PersonalityAPI.user.onKeyDown(keyCode);
        
        /** Código apenas para aplicação de teste */
        var lowerCaseKeyCode = PersonalityAPI.getLowerCaseKeycode(keyCode);
        if ((PersonalityAPI.validateKeyMethod == null) || ((PersonalityAPI.validateKeyMethod != null) && PersonalityAPI.validateKeyMethod(lowerCaseKeyCode))) {
            if (PersonalityAPI.currentKeystroke == 1) {
                PersonalityAPI.user.onKeystroke01KeyDown(keyCode);
            } else {
                if (PersonalityAPI.currentKeystroke == 2) {
                    PersonalityAPI.user.onKeystroke02KeyDown(keyCode);
                } else {
                    console.log("[PersonalityAPI]: {onKeyDown} Tentando adicionar evento de keyDown em lista desconhecida.");
                }
            }
        }
        /** Fim do código apenas para aplicação de teste */
    }
};

/**
 * Retorna o KeyCode equivalente de uma letra na versão Lower Case
 * (caso não seja letra, ou já seja lower case, o próprio keyCode será retornado)
 * @param {int} keyCode
 * @returns {int} - KeyCode da letra equivalente em lower case
 */
PersonalityAPI.getLowerCaseKeycode = function(keyCode) {    
    if ((keyCode >= UPPER_CASE_A_CODE) && (keyCode <= UPPER_CASE_Z_CODE)) {
        return (keyCode + 32);
    }
    return keyCode;
};


/**
 * Método executado quando uma tecla deixa de ser pressionada
 * @param {type} event
 */
PersonalityAPI.onKeyUp = function(event) {
    var keyCode = parseInt(event.keyCode);
    //console.log("keyUp: " + keyCode + " " + PersonalityAPI.heldKeys[keyCode]);
    // Caso a tecla esteja pressionada
    if (PersonalityAPI.heldKeys[keyCode]) {        
        // Marca a tecla como NÃO pressionada
        PersonalityAPI.heldKeys[keyCode] = false;
        // Informa a classe de controle do usuário
        // sobre a ocorrência de um keyDown
        PersonalityAPI.user.onKeyUp(keyCode);
        
        /** Código apenas para aplicação de teste */
        //if ((PersonalityAPI.validateKeyMethod == null) || ((PersonalityAPI.validateKeyMethod != null) && PersonalityAPI.validateKeyMethod(keyCode))) {
            if (PersonalityAPI.currentKeystroke == 1) {
                PersonalityAPI.user.onKeystroke01KeyUp(keyCode);
            } else {
                if (PersonalityAPI.currentKeystroke == 2) {
                    PersonalityAPI.user.onKeystroke02KeyUp(keyCode);
                } else {
                    console.log("[PersonalityAPI]: {onKeyDown} Tentando adicionar evento de keyDown em lista desconhecida.");
                }
            }
        //}
        /** Fim do código apenas para aplicação de teste */
    } else {
        var validKey = PersonalityAPI.isValidKey(keyCode);
        if (validKey) {
            console.log("[PersonalityAPI]: {onKeyUp} Recebido keyUp de tecla que não estava pressionada. KeyCode: " + keyCode);
        }
    }
};

PersonalityAPI.onTIPIAnswer = function(questionId, answerId) {
    //console.log("Respondido " + questionId + " " + answerId);
    var user = PersonalityAPI.user;
    if (user != null) {
        user.onTIPIAnswer(questionId, answerId);
    } else {
        console.log("[PersonalityAPI]: {onTIPIAnswer} Não foi possível setar a resposta do usuário. Referência para o usuário é nula.");
    }
};

/**
 * Retorna a representação do usuário 
 */
PersonalityAPI.getUser = function() {
    return PersonalityAPI.user;
};



/**
 * Retorna um objeto que representa os dados da API
 * prontos para a formatação JSON
 * @returns {Object}
 */
PersonalityAPI.getJSONData = function() {
    var jsonData = {};
    jsonData.startTime =  PersonalityAPI.startTime;
    jsonData.endTime = PersonalityAPI.endTime;
    jsonData.keystrokeStartTime = PersonalityAPI.keystrokeStartTime;
    jsonData.keystrokeEndTime = PersonalityAPI.keystrokeEndTime;
    jsonData.tipiStartTime = PersonalityAPI.tipiStartTime;
    jsonData.tipiEndTime = PersonalityAPI.tipiEndTime;    
    jsonData.user = PersonalityAPI.user.getJSONData();
    return jsonData;
};

/**
 * Retorna os dados da API em formato JSON
 * @returns {String}
 */
PersonalityAPI.toJSON = function() {
    return JSON.stringify(this.getJSONData());
};

/**
 * Marca a API para ignorar (ou não) teclas que NÃO são LETRAS
 * @param {boolean} ignore
 */
PersonalityAPI.setIgnoreNoncharacter = function(ignore) {
    PersonalityAPI.ignoreNoncharacter = ignore;
};

/**
 * Identifica se uma determinada tecla é válida, de acordo
 * com as configurações atuais da API
 * @param {int} keyCode
 * @returns {Boolean}
 */
PersonalityAPI.isValidKey = function(keyCode) {    
    // Caso teclas que NÃO são letras devam ser ignoradas
    if (PersonalityAPI.ignoreNoncharacter) {
        // Tecla NÃO está entre "A e "Z" (maiúsculos)
        if ((keyCode >= UPPER_CASE_A_CODE) && (keyCode <= UPPER_CASE_Z_CODE)) {            
            return true;
        } else {
            // Tecla NÃO está entre "a" e "z" (minúculos)
            if ((keyCode >= LOWER_CASE_A_CODE) && (keyCode <= LOWER_CASE_Z_CODE)) {
                return true;
            } else {
                return false;
            }
        }
    }
    return true;
};

/**
 * Habilita/Desabilita o debug
 * @param {boolean} enableDebug 
 */
PersonalityAPI.showDebug = function(enableDebug) {
    if (enableDebug) {
        DebugWindow.show(PersonalityAPI.user);
    } else {
        DebugWindow.hide();
    }
};

/**
 * Efetua uma requisição para o servidor para salvar
 * os dados capturados pela API
 * @param {function(object)} onComplete 
 */
PersonalityAPI.save = function(onComplete) {
    var params = {};
    params.data = PersonalityAPI.toJSON();
    PersonalityAPI.doRequest(params, onComplete);
};

/**
 * Efetua uma requisição genérica para o servidor, de acordo com
 * os dados recebidos por parâmetro
 * @param {object} data
 * @param {function(object)} onComplete
 */
PersonalityAPI.doRequest = function(data, onComplete) {
    var request = null;    
    try {
        request = new XMLHttpRequest();
    } catch(error) {
        try {
            // Internet Explorer
            request = new ActiveXObject("Msxm12.XMLHTTP")
        } catch(error) {
            try {
                // Outras versões do Internet Explorer
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(error) {
                request = null;                
            }
        }
    }
    
    // Monta os dados do POST
    var postData = null;
    for (var param in data) {
        if (postData == null) {
            postData = (param + "=" + data[param]);
        } else {
            postData += ("&" + param + "=" + data[param]);
        }
    }
    
    if (request != null) {
        request.open(PersonalityAPI.HTTP_REQUEST_METHOD, PersonalityAPI.HOST_URL, true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.onreadystatechange = function() {
            if ((request.readyState == 4) && (request.status == 200)) {
                if (onComplete != null) {
                    var data = request.responseText;              
                    onComplete(data);
                }
            }
        }
        
        request.send(postData);        
    } else {
        console.log("[PersonalityAPI]: {createXMLHTTPRequest} Não foi possível criar uma requisição para o Ajax.");
    }
    
};

/**
 * Gera uma nova UUID (identificador único) aleatório
 * @returns {string}
 */
PersonalityAPI.generateUUID = function() {
    var window = null;
    if (document != null) {
        window = document.window;
    }
    return uuid(window);
};


// Adicionar os listeners do teclado
PersonalityAPI.addListeners = function() {
    if (document.addEventListener) {
        // Adiciona os listeners dos evento de teclado em todo o documento HTML		
        document.addEventListener("keydown", PersonalityAPI.onKeyDown, true);
        document.addEventListener("keyup", PersonalityAPI.onKeyUp, true);        
    } else {
        if (document.attachEvent) {
            // Adiciona os listeners dos evento de teclado em todo o documento HTML
            // (Internet Explorer e navegores antigos)
            document.attachEvent("keydown", PersonalityAPI.onKeyDown);
            document.attachEvent("keyup", PersonalityAPI.onKeyUp);            
        }
    }
};

// Remove os listeners do teclado
PersonalityAPI.removeListeners = function() {
    if (document.removeEventListener) {
        // Remove os listeners dos evento de teclado em todo o documento HTML		
        document.removeEventListener("keydown", PersonalityAPI.onKeyDown, true);
        document.removeEventListener("keyup", PersonalityAPI.onKeyUp, true);        
    } else {
        if (document.detachEvent) {
            // Remove os listeners dos evento de teclado em todo o documento HTML
            // (Internet Explorer e navegores antigos)
            document.detachEvent("keydown", PersonalityAPI.onKeyDown);
            document.detachEvent("keyup", PersonalityAPI.onKeyUp);            
        }
    }
};