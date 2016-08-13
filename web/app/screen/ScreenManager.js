function ScreenManager() {
    
    
   this.screens = new Array(
        "researchIntroduction",
        "consentForm",
        "register",
        "keystrokeExtraction",
        "questions",    
        "endQuestions"
    );

    this.currentScreenIndex = 0;
    
    
    
    this.init = function() {
        // Esconde todas as telas
        this.hideAll();
        
        // Exibe a primeira tela da aplicação
        currentScreenIndex = 0;
        var screenId = this.getScreenIdByIndex(currentScreenIndex);
        this.showScreen(screenId);
    };
    
    
    this.getScreenIdByIndex = function(screenIndex) {
        if ((screenIndex >= 0) && (screenIndex < this.screens.length)) {
            return this.screens[screenIndex];
        }
        return null;
    };

    this.showScreen = function(screenId) {
        if (this.currentScreenIndex > 0) {
            var previousScreenIndex = (this.currentScreenIndex - 1);
            var previousScreenId = this.getScreenIdByIndex(previousScreenIndex);
            this.hideScreen(previousScreenId);
        }    

        var screen = document.getElementById(screenId);
        if (screen != null) {
            screen.className = "";
        } else {
            console.log("[Main]: {showElement} Screen " + screenId + " não encontrada.");
        }
    };

    this.hideScreen = function(screenId) {
        var screen = document.getElementById(screenId);
        if (screen != null) {
            screen.className = "ui-hidden";
        } else {
            console.log("[Main]: {hideElement} Screen " + screenId + " não encontrada.");
        }
    };

    this.showNextScreen = function() {
        if (this.currentScreenIndex < (this.screens.length - 1)) {
            this.currentScreenIndex++;
        } else {
            this.currentScreenIndex = 0;
        }    
        var screenId = this.getScreenIdByIndex(this.currentScreenIndex);    
        this.showScreen(screenId);
    };

    this.hideAll = function() {
        for (var i = 0; i < this.screens.length; i++) {
            this.hideScreen(this.screens[i]);
        }
    };
    
    
    
    
}