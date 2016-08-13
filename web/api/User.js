function User(uuid) {
    
    // Identificar único do usuário
    this.uuid = uuid;
    
    // Idade do participante    
    this.age = null;
    // Gênero do participante
    this.gender = null;
    // E-mail do participante
    this.email = null;
    // Nome do participante
    this.name = null;
    
    // Representação do conjunto de teclas pressioandas pelo jogador
    this.keySet = new KeySet();
    
    // Keystrokes da aplicação de teste
    this.keystroke01 = new KeySet();
    this.keystroke02 = new KeySet();
    
    // Respostas do questionário TIPI
    this.tipi = new TIPI();
    

/** Métodos apenas para a aplicação de teste **/
    this.onKeystroke01KeyDown = function(keyCode) {
        this.keystroke01.onKeyDown(keyCode);
    };
    
    this.onKeystroke01KeyUp = function(keyCode) {
        this.keystroke01.onKeyUp(keyCode);
    };
    
    this.onKeystroke02KeyDown = function(keyCode) {
        this.keystroke02.onKeyDown(keyCode);
    };
    
    this.onKeystroke02KeyUp = function(keyCode) {
        this.keystroke02.onKeyUp(keyCode);
    };
/** Fim dos métodos apenas para a aplicação de teste **/


    this.onKeyDown = function(keyCode) {
        this.keySet.onKeyDown(keyCode);
    };

    this.onKeyUp = function(keyCode) {
        this.keySet.onKeyUp(keyCode);
    };

    this.getKeySet = function() {
        return this.keySet;
    };
    
    this.getTIPI = function() {
        return this.tipi;
    };
    
    this.onTIPIAnswer = function(questionId, answerId) {
        this.getTIPI().onAnswer(questionId, answerId);
    };
    
	this.getName = function() {
        return this.name;
    };
	
    this.setName = function(name) {
        this.name = name;
    };
    
    this.setEmail = function(email) {
        this.email = email;
    };
    
    this.setAge = function(age) {
        this.age = age;
    };
    
    this.setGender = function(gender) {
        this.gender = gender;
    };

    this.getJSONData = function() {
        var jsonData = {};
        jsonData.uuid = this.uuid;        
        jsonData.name = this.name;
        jsonData.email = this.email;
        jsonData.age = this.age;        
        jsonData.gender = this.gender;
        jsonData.tipi = this.getTIPI().getJSONData();
        jsonData.keySet = this.getKeySet().getJSONData();
        jsonData.keystroke01 = this.keystroke01.getJSONData();
        jsonData.keystroke02 = this.keystroke02.getJSONData();
        return jsonData;
    };

};