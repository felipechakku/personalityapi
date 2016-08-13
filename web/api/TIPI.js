function TIPI() {
    
    // Resposta do usuário
    this.answers = new Array();
    
    /**
     * Método chamado quando uma das perguntas do TIPI é respondida
     * @param {int} questionId
     * @param {int} answerId     
     */
    this.onAnswer = function(questionId, answerId) {
        this.answers[questionId] = answerId;
    };
    
    /**
     * Retorna o Array de respostas do usuário
     * @returns {Array}
     */
    this.getAnswers = function() {
        return this.answers;
    };
    
    this.getJSONData = function() {
        var jsonData = {};
        jsonData.answers = this.answers;
        return jsonData;
    };
    
    
};