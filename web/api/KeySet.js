/*
 1.	Quantidade de caracteres digitados
 2.	Quantidade de erros (backspace + delete)
 3.	Quantidade de dígitos encontrados
 4.	Quantidade de símbolos encontrados
 5.	Quantidade de letras encontradas
 6.	Quantidade total de teclas PRESSIONADAS (não-únicas)
 7.	Código ASCII de cada uma das teclas
 8.	Tempo entre o pressionar de uma tecla e o soltar da mesma tecla (dwell time)
 9.	Duração entre soltar a tecla atual e pressionar a próxima (flight time)
 
 */

// Mínimo, máximo, média, moda, mediana, desvio padrão, variância



function KeySet() {

    // Identificadores das teclas de erro
    var BACKSPACE_CODE = 8;
    var DELETE_CODE = 46;


    // Quantidade de teclas diferentes digitadas
    this.distinctKeysCount = 0;
    // Quantidade total de teclas PRESSIONADAS
    this.keyPressedCount = 0;

    // Teclas atualmente pressionadas
    this.activeKeys = new Array();

    // Informações de teclas já pressionadas
    // Array de Array de KeyObjects
    this.keys = new Array();
    
    // Informações das teclas já pressionadas
    // na ordem em que foram pressionadas
    this.orderedKeys = new Array();

    // Última tecla pressionada
    this.currentKey = null;



    // Primeira tecla pressionada pelo usuário
    // em um "ciclo" de digitação. Utilizada para
    // calcular a velocidade de digitação
    this.firstKey = null;

    // Última tecla pressionada pelo usuário
    // em um "ciclo" de digitação. Utilizada para
    // calcular a velocidade de digitação
    this.lastKey = null;






    // Método chamado quando uma tecla é pressionada
    this.onKeyDown = function(keyCode) {
        var keyObject = new KeyObject(keyCode, this.currentKey);
        keyObject.onKeyDown();
        if (this.currentKey != null) {
            this.currentKey.setNext(keyObject);
        }
        this.currentKey = keyObject;
        this.activeKeys[keyCode] = keyObject;

        if (this.firstKey == null) {
            this.firstKey = keyObject;
        }
        // Incrementa a quantidade de teclas pressionadas
        this.keyPressedCount++;
    };

    // Método chamado quando uma tecla deixa de ser pressionada
    this.onKeyUp = function(keyCode) {
        var keyObject = this.activeKeys[keyCode];
        if (keyObject != null) {
            keyObject.onKeyUp();

            // Mova a tecla para a lista de teclas já pressionadas
            // onde as informações do ritmo de digitação é armazenado
            this.activeKeys[keyCode] = null;
            
            // Adiciona o KeyObject na lista de teclas pressioandas
            this.orderedKeys.push(keyObject);
            
            if (this.keys[keyCode] == null) {
                this.keys[keyCode] = new Array();
                // Incrementa a quantidade de
                // caracteres pressionados
                this.distinctKeysCount++;
            }
            this.keys[keyCode].push(keyObject);
            this.lastKey = keyObject;
        }
    };

    this.getJSONData = function() {
        var jsonData = {};
        // Quantidade de caracteres diferentes digitados
        jsonData.distinctKeysCount = this.getDistinctKeysCount();
        // Quantidade de teclas pressionadas
        jsonData.keyPressedCount = this.getKeyPressedCount();
        // Velocidade de digitaçao (teclas por segundo)
        jsonData.speed = this.getSpeed();
        // Quantidade de erros (soma de BACKSPACE + DELETE)
        jsonData.errorCount = this.getErrorCount();
        // % de erro (proporção de BACKSPACE + DELETE em relaçao à outras teclas)
        jsonData.errorRate = this.getErrorRate();
        
        // Hold Time
        jsonData.minHoldTime = this.getMinHoldTime(keyCode);
        jsonData.maxHoldTime = this.getMaxHoldTime(keyCode);
        jsonData.meanHoldTime = this.getMeanHoldTime(keyCode);
        jsonData.modeHoldTime = this.getModeHoldTime(keyCode);
        jsonData.medianHoldTime = this.getMedianHoldTime(keyCode);
        jsonData.holdTimeStandardDeviation = this.getHoldTimeStandardDeviation(keyCode);
        jsonData.holdTimeVariance = this.getHoldTimeVariance(keyCode);
                
        // Flight Time
        jsonData.minFlightTime = this.getMinFlightTime(keyCode);
        jsonData.maxFlightTime = this.getMaxFlightTime(keyCode);
        jsonData.meanFlightTime = this.getMeanFlightTime(keyCode);
        jsonData.modeFlightTime = this.getModeFlightTime(keyCode);
        jsonData.medianFlightTime = this.getMedianFlightTime(keyCode);
        jsonData.flightTimeStandardDeviation = this.getFlightTimeStandardDeviation(keyCode);
        jsonData.flightTimeVariance = this.getFlightTimeVariance(keyCode);
        
        
        
        // Obtem as informações dos tempo das teclas pressionadas        
        var keys = new Array();
        var keyData;
        for (var i = 0; i < this.orderedKeys.length; i++) {
            keyData = this.orderedKeys[i].getJSONData();
            keys.push(keyData);
        }
        
        // Adiciona as informações estatísticas da tecla 
        /*var keyData;
        var keyCode;
        for (var i = 0; i < keys.length; i++) {
			keyData = keys[i];
            keyCode = keyData.keyCode;
            
            // Índice da tecla dentre as digitadas
            keyData.index = i;
            
            // Hold Time
            keyData.minHoldTime = this.getMinHoldTimeByKey(keyCode);
            keyData.maxHoldTime = this.getMaxHoldTimeByKey(keyCode);
            keyData.meanHoldTime = this.getMeanHoldTimeByKey(keyCode);
            keyData.modeHoldTime = this.getModeHoldTimeByKey(keyCode);
            keyData.medianHoldTime = this.getMedianHoldTimeByKey(keyCode);
            keyData.holdTimeStandardDeviation = this.getHoldTimeStandardDeviationByKey(keyCode);
            keyData.holdTimeVariance = this.getHoldTimeVarianceByKey(keyCode);
            
            // Flight Time
            keyData.minFlightTime = this.getMinFlightTimeByKey(keyCode);
            keyData.maxFlightTime = this.getMaxFlightTimeByKey(keyCode);
            keyData.meanFlightTime = this.getMeanFlightTimeByKey(keyCode);
            keyData.modeFlightTime = this.getModeFlightTimeByKey(keyCode);
            keyData.medianFlightTime = this.getMedianFlightTimeByKey(keyCode);
            keyData.flightTimeStandardDeviation = this.getFlightTimeStandardDeviationByKey(keyCode);
            keyData.flightTimeVariance = this.getFlightTimeVarianceByKey(keyCode);
        }*/
        jsonData.keys = keys;
        
        return jsonData;
    };



    /** Dados brutos */

    // Primeira tecla pressionada
    this.getFirstKey = function() {
        return this.firstKey;
    };

    // Útima tecla pressionada
    this.getLastKey = function() {
        return this.lastKey;
    };

    // Quantidade de CHARACTERS digitados
    // apenas caracteres diferentes são levandos em conta
    this.getDistinctKeysCount = function() {
        return this.distinctKeysCount;
    };

    this.getKeyPressedCount = function() {
        return this.keyPressedCount;
    };





    // Velocidade de digitação em SEGUNDOS
    this.getSpeed = function() {
        if ((this.firstKey == null) || (this.lastKey == null)) {
            return 0;
        }

        var quantity = 0;
        var keys = null;
        for (var i = 0; i < this.keys.length; i++) {
            keys = this.keys[i];
            if ((keys != null) && (keys.length > 0)) {
                // Incrementa o contador da quantidade de teclas
                // pressionadas pelo usuário
                quantity += keys.length;
            }
        }
        var time = (this.lastKey.getUpTime() - this.firstKey.getDownTime());
        return ((quantity / time) * 1000);
    }

    // Quantidade de erros cometidos no processo de digitação
    this.getErrorCount = function() {
        var backspaceCount = 0;
        // Quantidade de vezes que BACKSPACE foi pressionado
        if (this.keys[BACKSPACE_CODE] != null) {
            backspaceCount = this.keys[BACKSPACE_CODE].length;
        }

        var deleteCount = 0;
        // Quantidade de vezes que DELETE foi pressionado
        if (this.keys[DELETE_CODE] != null) {
            deleteCount = this.keys[DELETE_CODE].length;
        }

        return (backspaceCount + deleteCount);
    }

    // Porcentagem de erro
    this.getErrorRate = function() {
        return ((this.getErrorCount() * 100) / this.getKeyPressedCount());
    }









    /** DWell Time / Hold Time */

    // Hold time MÍNIMO de uma tecla específica
    this.getMinHoldTimeByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var min = -1;
            var holdTime;
            for (var i = 0; i < keys.length; i++) {
                holdTime = keys[i].getHoldTime();
                if ((min == -1) || (holdTime < min)) {
                    min = holdTime;
                }
            }
            return min;
        } else {
            console.log("[KeySet]: {getMinHoldTimeByKey} keyCode " + keyCode + " NÃO foi encontrado.");
        }
        return 0;
    }

    // Hold time MÁXIMO de uma tecla específica
    this.getMaxHoldTimeByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var max = -1;
            var holdTime;
            for (var i = 0; i < keys.length; i++) {
                holdTime = keys[i].getHoldTime();
                if ((max == -1) || (holdTime > max)) {
                    max = holdTime;
                }
            }
            return max;
        }
        return 0;
    }

    // MÉDIA do hold time de uma tecla específica
    this.getMeanHoldTimeByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var sum = 0;
            for (var i = 0; i < keys.length; i++) {
                sum += keys[i].getHoldTime();
            }
            return (sum / keys.length);
        }
        return 0;
    }

    // MODA do hold time de uma tecla específica
    this.getModeHoldTimeByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var modes = new Array();
            var holdTimes = new Array();
            var holdTime;
            var holdTimeIndex;
            for (var i = 0; i < keys.length; i++) {
                holdTime = keys[i].getHoldTime();
                holdTimeIndex = holdTimes.indexOf(holdTime);
                // Caso a duração tenha aparecido pela primeira vez
                if (holdTimeIndex == -1) {
                    holdTimes.push(holdTime);
                    modes[(holdTimes.length - 1)] = 1;
                } else {
                    // Incrementa a quantidade de vezes que a duração apareceu
                    modes[holdTimeIndex]++;
                }
            }

            var max = -1;
            var mode;
            for (var i = 0; i < modes.length; i++) {
                mode = modes[i];
                if ((max == -1) || (mode > max)) {
                    max = mode;
                    holdTimeIndex = i;
                }
            }
            return holdTimes[holdTimeIndex];
        }
        return 0;
    }

    // MEDIANA do hold time de uma tecla específica
    this.getMedianHoldTimeByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            // Ordenada a teclas de acordo com a duração
            // (Menor para a maior)
            keys = keys.sort(function(key1, key2) {
                if (key1.getHoldTime() < key2.getHoldTime()) {
                    return 1;
                } else {
                    if (key1.getHoldTime() > key2.getHoldTime()) {
                        return -1;
                    }
                }
                return 0;
            });

            // Caso a quantidade de vezes que a tecla
            // foi pressionada seja um número PAR
            if ((keys.length % 2) == 0) {
                // Índice central do array
                var middleIndex = (keys.length / 2);
                // Letra do imediatamente após o "meio" do array
                var nextKeyHoldTime = keys[middleIndex].getHoldTime();
                // Letra do imediatamente antes do "meio" do array
                var previousKeyHoldTime = keys[(middleIndex - 1)].getHoldTime();
                return ((nextKeyHoldTime + previousKeyHoldTime) / 2);
            } else {
                var medianIndex = parseInt(Math.floor(keys.length / 2));
                return keys[medianIndex].getHoldTime();
            }
        }
    }

    // DESVIO PADRÃO do hold time de uma tecla específica
    this.getHoldTimeStandardDeviationByKey = function(keyCode) {
        return Math.sqrt(this.getHoldTimeVarianceByKey(keyCode));
    }

    // VARIÂNCIA do hold time de uma tecla específica
    this.getHoldTimeVarianceByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var mean = this.getMeanHoldTimeByKey(keyCode);
            var holdTime;
            var variance = 0;
            for (var i = 0; i < keys.length; i++) {
                holdTime = keys[i].getHoldTime();
                variance += Math.pow((holdTime - mean), 2);
            }
            variance = (variance / (keys.length - 1));
            return variance;
        }
        return 0;
    }




    // Hold time MÍNIMO
    this.getMinHoldTime = function() {
        var keys = this.keys;
        var min = -1;
        var currentKeyMin = -1;
        var keyObjects;
        var keyObject;
        for (var i = 0; i < keys.length; i++) {
            keyObjects = keys[i];
            if ((keyObjects != null) && (keyObjects.length > 0)) {
                keyObject = keyObjects[0];
                currentKeyMin = this.getMinHoldTimeByKey(keyObject.getKeyCode());
                if ((min == -1) || (currentKeyMin < min)) {
                    min = currentKeyMin;
                }
            }
        }
        return min;
    }

    // Hold time MÁXIMO
    this.getMaxHoldTime = function() {
        var keys = this.keys;
        var max = -1;
        var currentKeyMax = -1;        
        var keyObjects;
        var keyObject;
        for (var i = 0; i < keys.length; i++) {
            keyObjects = keys[i];
            if ((keyObjects != null) && (keyObjects.length > 0)) {
                keyObject = keyObjects[0];
                currentKeyMax = this.getMaxHoldTimeByKey(keyObject.getKeyCode());                
                if ((max == -1) || (currentKeyMax > max)) {
                    max = currentKeyMax;
                }
            }
        }
        return max;
    }

    // MÉDIA do hold time
    this.getMeanHoldTime = function() {
        var keys = this.keys;
        // Soma de todos os hold times
        var holdTimeSum = 0;
        // Total de teclas
        var keysCount = 0;
        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                // Obtem o array de teclas pressionadas
                // com um determinado keyCode
                // (Por exemplo: Um array contendo os KeyObjects das teclas "A" já pressionadas)			
                for (var j = 0; j < pressedKeys.length; j++) {
                    holdTimeSum += pressedKeys[j].getHoldTime();
                }
                keysCount += pressedKeys.length;
            }
        }

        if (keysCount > 0) {
            return (holdTimeSum / keysCount);
        }
        return 0;
    }

    // MODA do hold time
    this.getModeHoldTime = function() {
        var keys = this.keys;
        var modes = new Array();
        var holdTimes = new Array();
        var holdTime;
        var holdTimeIndex;
        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                for (var j = 0; j < pressedKeys.length; j++) {
                    holdTime = pressedKeys[j].getHoldTime();
                    holdTimeIndex = holdTimes.indexOf(holdTime);
                    // Caso a duração tenha aparecido pela primeira vez
                    if (holdTimeIndex == -1) {
                        holdTimes.push(holdTime);
                        modes[(holdTimes.length - 1)] = 1;
                    } else {
                        // Incrementa a quantidade de vezes que a duração apareceu
                        modes[holdTimeIndex]++;
                    }
                }
            }
        }
        var max = -1;
        var mode;
        for (var i = 0; i < modes.length; i++) {
            mode = modes[i];
            if ((max == -1) || (mode > max)) {
                max = mode;
                holdTimeIndex = i;
            }
        }
        return holdTimes[holdTimeIndex];
    }

    // MEDIANA do hold time
    this.getMedianHoldTime = function() {
        var keys = this.keys;
        // Array contendo todos os KeyObjects sequencialmente		
        var keyList = new Array();

        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                for (j = 0; j < pressedKeys.length; j++) {
                    // Adiciona todas os keyObjects
                    // sequencialmente em um único array
                    // para ser ordenado posteriormente
                    keyList.push(pressedKeys[j]);
                }
            }
        }

        if (keyList.length > 0) {
            // Ordenada a teclas de acordo com a duração
            // (Menor para a maior)
            keyList = keyList.sort(function(key1, key2) {
                if (key1.getHoldTime() < key2.getHoldTime()) {
                    return 1;
                } else {
                    if (key1.getHoldTime() > key2.getHoldTime()) {
                        return -1;
                    }
                }
                return 0;
            });

            // Caso a quantidade de vezes que a tecla
            // foi pressionada seja um número PAR
            if ((keyList.length % 2) == 0) {
                // Índice central do array
                var middleIndex = (keyList.length / 2);
                // Letra do imediatamente após o "meio" do array
                var nextKeyHoldTime = keyList[middleIndex].getHoldTime();
                // Letra do imediatamente antes do "meio" do array
                var previousKeyHoldTime = keyList[(middleIndex - 1)].getHoldTime();
                return ((nextKeyHoldTime + previousKeyHoldTime) / 2);
            } else {
                var medianIndex = parseInt(Math.floor(keyList.length / 2));
                return keyList[medianIndex].getHoldTime();
            }
        }
        return 0;
    }

    // VARIÂNCIA do hold time
    this.getHoldTimeVariance = function() {
        var keys = this.keys;
        var mean = this.getMeanHoldTime();
        var holdTime;
        var varianceSum = 0;
        var keysCount = 0;
        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                for (var j = 0; j < pressedKeys.length; j++) {
                    holdTime = pressedKeys[j].getHoldTime();
                    varianceSum += Math.pow((holdTime - mean), 2);
                }
                keysCount += (pressedKeys.length);
            }
        }
        return (varianceSum / keysCount);
    }

    // DESVIO PADRÃO do hold time
    this.getHoldTimeStandardDeviation = function() {
        return Math.sqrt(this.getHoldTimeVariance());
    }









    /** Flight Time */

    // FlightTime MÍNIMO de uma tecla específica
    this.getMinFlightTimeByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var min = -1;
            var flightTime;
            for (var i = 0; i < keys.length; i++) {
                flightTime = keys[i].getFlightTime();
                if ((min == -1) || (flightTime < min)) {
                    min = flightTime;
                }
            }
            return min;
        }
        return 0;
    }

    // FlightTime MÁXIMO de uma tecla específica
    this.getMaxFlightTimeByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var max = -1;
            var flightTime;
            for (var i = 0; i < keys.length; i++) {
                flightTime = keys[i].getFlightTime();
                if ((max == -1) || (flightTime > max)) {
                    max = flightTime;
                }
            }
            return max;
        }
        return 0;
    }

    // MÉDIA do FlightTime de uma tecla específica
    this.getMeanFlightTimeByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var sum = 0;
            for (var i = 0; i < keys.length; i++) {
                sum += keys[i].getFlightTime();
            }
            return (sum / keys.length);
        }
        return 0;
    }

    // MODA do FlightTime de uma tecla específica
    this.getModeFlightTimeByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var modes = new Array();
            var flightTimes = new Array();
            var flightTime;
            var flightTimeIndex;
            for (var i = 0; i < keys.length; i++) {
                flightTime = keys[i].getFlightTime();
                flightTimeIndex = flightTimes.indexOf(flightTime);
                // Caso o FlightTime tenha aparecido pela primeira vez
                if (flightTimeIndex == -1) {
                    flightTimes.push(flightTime);
                    modes[(flightTimes.length - 1)] = 1;
                } else {
                    // Incrementa a quantidade de vezes que o FlightTime apareceu
                    modes[flightTimeIndex]++;
                }
            }

            var max = -1;
            var mode;
            for (var i = 0; i < modes.length; i++) {
                mode = modes[i];
                if ((max == -1) || (mode > max)) {
                    max = mode;
                    flightTimeIndex = i;
                }
            }
            return flightTimes[flightTimeIndex];
        }
        return 0;
    }

    // MEDIANA do FlightTime de uma tecla específica
    this.getMedianFlightTimeByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            // Ordenada a teclas de acordo com o FlightTime
            // (Menor para a maior)
            keys = keys.sort(function(key1, key2) {
                if (key1.getFlightTime() < key2.getFlightTime()) {
                    return 1;
                } else {
                    if (key1.getFlightTime() > key2.getFlightTime()) {
                        return -1;
                    }
                }
                return 0;
            });

            // Caso a quantidade de vezes que a tecla
            // foi pressionada seja um número PAR
            if ((keys.length % 2) == 0) {
                // Índice central do array
                var middleIndex = (keys.length / 2);
                // Letra imediatamente após o "meio" do array
                var nextValue = keys[middleIndex].getFlightTime();
                // Letra imediatamente antes do "meio" do array
                var previousValue = keys[(middleIndex - 1)].getFlightTime();
                return ((nextValue + previousValue) / 2);
            } else {
                var medianIndex = parseInt(Math.floor(keys.length / 2));
                return keys[medianIndex].getFlightTime();
            }
        }
    }

    // DESVIO PADRÃO do FlightTime de uma tecla específica
    this.getFlightTimeStandardDeviationByKey = function(keyCode) {
        return Math.sqrt(this.getFlightTimeVarianceByKey(keyCode));
    }

    // VARÂNCIA do FlightTime de uma tecla específica
    this.getFlightTimeVarianceByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var mean = this.getMeanFlightTimeByKey(keyCode);
            var flightTime;
            var variance = 0;
            for (var i = 0; i < keys.length; i++) {
                flightTime = keys[i].getFlightTime();
                variance += Math.pow((flightTime - mean), 2);
            }
            variance = (variance / (keys.length - 1));
            return variance;
        }
        return 0;
    }


    // FlightTime MÍNIMO
    this.getMinFlightTime = function() {
        var keys = this.keys;
        var min = -1;
        var currentKeyMin = -1;
        var keyObjects;
        var keyObject;
        for (var i = 0; i < keys.length; i++) {
            keyObjects = keys[i];
            if ((keyObjects != null) && (keyObjects.length > 0)) {
                keyObject = keyObjects[0];
                currentKeyMin = this.getMinFlightTimeByKey(keyObject.getKeyCode());
                if ((min == -1) || (currentKeyMin < min)) {
                    min = currentKeyMin;
                }
            }
        }
        return min;
    }

    // FlightTime MÁXIMO
    this.getMaxFlightTime = function() {
        var keys = this.keys;
        var max = -1;
        var currentKeyMax = -1;
        var keyObjects;
        var keyObject;
        for (var i = 0; i < keys.length; i++) {
            keyObjects = keys[i];
            if ((keyObjects != null) && (keyObjects.length > 0)) {
                keyObject = keyObjects[0];
                currentKeyMax = this.getMaxFlightTimeByKey(keyObject.getKeyCode());
                if ((max == -1) || (currentKeyMax > max)) {
                    max = currentKeyMax;
                }
            }
        }
        return max;
    }

    // MÉDIA do FlightTime
    this.getMeanFlightTime = function() {
        var keys = this.keys;
        // Soma de todos os FlightTimes
        var flightTimeSum = 0;
        // Total de teclas
        var keysCount = 0;
        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                // Obtem o array de teclas pressionadas
                // com um determinado keyCode
                // (Por exemplo: Um array contendo os KeyObjects das teclas "A" já pressionadas)			
                for (var j = 0; j < pressedKeys.length; j++) {
                    flightTimeSum += pressedKeys[j].getFlightTime();
                }
                keysCount += pressedKeys.length;
            }
        }

        if (keysCount > 0) {
            return (flightTimeSum / keysCount);
        }
        return 0;
    }

    // MODA do FlightTime
    this.getModeFlightTime = function() {
        var keys = this.keys;
        var modes = new Array();
        var flightTimes = new Array();
        var flightTime;
        var flightTimeIndex;
        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                for (var j = 0; j < pressedKeys.length; j++) {
                    flightTime = pressedKeys[j].getFlightTime();
                    flightTimeIndex = flightTimes.indexOf(flightTime);
                    // Caso o FlightTime tenha aparecido pela primeira vez
                    if (flightTimeIndex == -1) {
                        flightTimes.push(flightTime);
                        modes[(flightTimes.length - 1)] = 1;
                    } else {
                        // Incrementa a quantidade de vezes que o FlightTime apareceu
                        modes[flightTimeIndex]++;
                    }
                }
            }
        }
        var max = -1;
        var mode;
        for (var i = 0; i < modes.length; i++) {
            mode = modes[i];
            if ((max == -1) || (mode > max)) {
                max = mode;
                flightTimeIndex = i;
            }
        }
        return flightTimes[flightTimeIndex];
    }

    // MEDIANA do FlightTime
    this.getMedianFlightTime = function() {
        var keys = this.keys;
        // Array contendo todos os KeyObjects sequencialmente		
        var keyList = new Array();

        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                for (j = 0; j < pressedKeys.length; j++) {
                    // Adiciona todas os keyObjects
                    // sequencialmente em um único array
                    // para ser ordenado posteriormente
                    keyList.push(pressedKeys[j]);
                }
            }
        }

        if (keyList.length > 0) {
            // Ordenada a teclas de acordo com o FlightTime
            // (Menor para a maior)
            keyList = keyList.sort(function(key1, key2) {
                if (key1.getFlightTime() < key2.getFlightTime()) {
                    return 1;
                } else {
                    if (key1.getFlightTime() > key2.getFlightTime()) {
                        return -1;
                    }
                }
                return 0;
            });

            // Caso a quantidade de vezes que a tecla
            // foi pressionada seja um número PAR
            if ((keyList.length % 2) == 0) {
                // Índice central do array
                var middleIndex = (keyList.length / 2);
                // Letra do imediatamente após o "meio" do array
                var nextKeyFlightTime = keyList[middleIndex].getFlightTime();
                // Letra do imediatamente antes do "meio" do array
                var previousKeyFlightTime = keyList[(middleIndex - 1)].getFlightTime();
                return ((nextKeyFlightTime + previousKeyFlightTime) / 2);
            } else {
                var medianIndex = parseInt(Math.floor(keyList.length / 2));
                return keyList[medianIndex].getFlightTime();
            }
        }
        return 0;
    }

    // VARIÂNCIA do FlightTime
    this.getFlightTimeVariance = function() {
        var keys = this.keys;
        var mean = this.getMeanFlightTime();
        var flightTime;
        var varianceSum = 0;
        var keysCount = 0;
        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                for (var j = 0; j < pressedKeys.length; j++) {
                    flightTime = pressedKeys[j].getFlightTime();
                    varianceSum += Math.pow((flightTime - mean), 2);
                }
                keysCount += (pressedKeys.length);
            }
        }
        return (varianceSum / keysCount);
    }

    // DESVIO PADRÃO do FlightTime
    this.getFlightTimeStandardDeviation = function() {
        return Math.sqrt(this.getFlightTimeVariance());
    }





    


    /** Latency */

    // Latência MÍNIMA de uma tecla específica
    this.getMinLatencyByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var min = -1;
            var latency;
            for (var i = 0; i < keys.length; i++) {
                latency = keys[i].getLatency();
                if ((min == -1) || (latency < min)) {
                    min = latency;
                }
            }
            return min;
        }
        return 0;
    }

    // Latência MÁXIMA de uma tecla específica
    this.getMaxLatencyByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var max = -1;
            var latency;
            for (var i = 0; i < keys.length; i++) {
                latency = keys[i].getLatency();
                if ((max == -1) || (latency > max)) {
                    max = latency;
                }
            }
            return max;
        }
        return 0;
    }

    // MÉDIA da latência de uma tecla específica
    this.getMeanLatencyByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var sum = 0;
            for (var i = 0; i < keys.length; i++) {
                sum += keys[i].getLatency();
            }
            return (sum / keys.length);
        }
        return 0;
    }

    // MODA da latência de uma tecla específica
    this.getModeLatencyByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var modes = new Array();
            var latencies = new Array();
            var latency;
            var latencyIndex;
            for (var i = 0; i < keys.length; i++) {
                latency = keys[i].getLatency();
                latencyIndex = latencies.indexOf(latency);
                // Caso latência tenha aparecido pela primeira vez
                if (latencyIndex == -1) {
                    latencies.push(latency);
                    modes[(latencies.length - 1)] = 1;
                } else {
                    // Incrementa a quantidade de vezes que a latência apareceu
                    modes[latencyIndex]++;
                }
            }

            var max = -1;
            var mode;
            for (var i = 0; i < modes.length; i++) {
                mode = modes[i];
                if ((max == -1) || (mode > max)) {
                    max = mode;
                    latencyIndex = i;
                }
            }
            return latencies[latencyIndex];
        }
        return 0;
    }

    // MEDIANA da latência de uma tecla específica
    this.getMedianLatencyByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            // Ordenada a teclas de acordo com a latência
            // (Menor para a maior)
            keys = keys.sort(function(key1, key2) {
                if (key1.getLatency() < key2.getLatency()) {
                    return 1;
                } else {
                    if (key1.getLatency() > key2.getLatency()) {
                        return -1;
                    }
                }
                return 0;
            });

            // Caso a quantidade de vezes que a tecla
            // foi pressionada seja um número PAR
            if ((keys.length % 2) == 0) {
                // Índice central do array
                var middleIndex = (keys.length / 2);
                // Letra do imediatamente após o "meio" do array
                var nextValue = keys[middleIndex].getLatency();
                // Letra do imediatamente antes do "meio" do array
                var previousValue = keys[(middleIndex - 1)].getLatency();
                return ((nextValue + previousValue) / 2);
            } else {
                var medianIndex = parseInt(Math.floor(keys.length / 2));
                return keys[medianIndex].getLatency();
            }
        }
    }

    // DESVIO PADRÃO da latência de uma tecla específica
    this.getLatencyStandardDeviationByKey = function(keyCode) {
        return Math.sqrt(this.getLatencyVarianceByKey(keyCode));
    }

    // VARÂNCIA da latência de uma tecla específica
    this.getLatencyVarianceByKey = function(keyCode) {
        var keys = this.keys[keyCode];
        if (keys != null) {
            var mean = this.getMeanLatencyByKey(keyCode);
            var latency;
            var variance = 0;
            for (var i = 0; i < keys.length; i++) {
                latency = keys[i].getLatency();
                variance += Math.pow((latency - mean), 2);
            }
            variance = (variance / (keys.length - 1));
            return variance;
        }
        return 0;
    }




    // Latência MÍNIMA
    this.getMinLatency = function() {
        var keys = this.keys;
        var min = -1;
        var currentKeyMin = -1;
        var keyObjects;
        var keyObject;
        for (var i = 0; i < keys.length; i++) {
            keyObjects = keys[i];
            if ((keyObjects != null) && (keyObjects.length > 0)) {
                keyObject = keyObjects[0];
                currentKeyMin = this.getMinLatencyByKey(keyObject.getKeyCode());
                if ((min == -1) || (currentKeyMin < min)) {
                    min = currentKeyMin;
                }
            }
        }
        return min;
    }

    // Latência MÁXIMA
    this.getMaxLatency = function() {
        var keys = this.keys;
        var max = -1;
        var currentKeyMax = -1;
        var keyObjects;
        var keyObject;
        for (var i = 0; i < keys.length; i++) {
            keyObjects = keys[i];
            if ((keyObjects != null) && (keyObjects.length > 0)) {
                keyObject = keyObjects[0];
                currentKeyMax = this.getMaxLatencyByKey(keyObject.getKeyCode());
                if ((max == -1) || (currentKeyMax > max)) {
                    max = currentKeyMax;
                }
            }
        }
        return max;
    }

    // MÉDIA da latência
    this.getMeanLatency = function() {
        var keys = this.keys;
        // Soma de todas as latências
        var latencySum = 0;
        // Total de teclas
        var keysCount = 0;
        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                // Obtem o array de teclas pressionadas
                // com um determinado keyCode
                // (Por exemplo: Um array contendo os KeyObjects das teclas "A" já pressionadas)			
                for (var j = 0; j < pressedKeys.length; j++) {
                    latencySum += pressedKeys[j].getLatency();
                }
                keysCount += pressedKeys.length;
            }
        }

        if (keysCount > 0) {
            return (latencySum / keysCount);
        }
        return 0;
    }

    // MODA da latência
    this.getModeLatency = function() {
        var keys = this.keys;
        var modes = new Array();
        var latencies = new Array();
        var latency;
        var latencyIndex;
        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                for (var j = 0; j < pressedKeys.length; j++) {
                    latency = pressedKeys[j].getLatency();
                    latencyIndex = latencies.indexOf(latency);
                    // Caso latência tenha aparecido pela primeira vez
                    if (latencyIndex == -1) {
                        latencies.push(latency);
                        modes[(latencies.length - 1)] = 1;
                    } else {
                        // Incrementa a quantidade de vezes que a latência apareceu
                        modes[latencyIndex]++;
                    }
                }
            }
        }
        var max = -1;
        var mode;
        for (var i = 0; i < modes.length; i++) {
            mode = modes[i];
            if ((max == -1) || (mode > max)) {
                max = mode;
                latencyIndex = i;
            }
        }
        return latencies[latencyIndex];
    }

    // MEDIANA da latência
    this.getMedianLatency = function() {
        var keys = this.keys;
        // Array contendo todos os KeyObjects sequencialmente		
        var keyList = new Array();

        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                for (j = 0; j < pressedKeys.length; j++) {
                    // Adiciona todas os keyObjects
                    // sequencialmente em um único array
                    // para ser ordenado posteriormente
                    keyList.push(pressedKeys[j]);
                }
            }
        }

        if (keyList.length > 0) {
            // Ordenada a teclas de acordo com a latência
            // (Menor para a maior)
            keyList = keyList.sort(function(key1, key2) {
                if (key1.getLatency() < key2.getLatency()) {
                    return 1;
                } else {
                    if (key1.getLatency() > key2.getLatency()) {
                        return -1;
                    }
                }
                return 0;
            });

            // Caso a quantidade de vezes que a tecla
            // foi pressionada seja um número PAR
            if ((keyList.length % 2) == 0) {
                // Índice central do array
                var middleIndex = (keyList.length / 2);
                // Letra do imediatamente após o "meio" do array
                var nextKeyLatency = keyList[middleIndex].getLatency();
                // Letra do imediatamente antes do "meio" do array
                var previousKeyLatency = keyList[(middleIndex - 1)].getLatency();
                return ((nextKeyLatency + previousKeyLatency) / 2);
            } else {
                var medianIndex = parseInt(Math.floor(keyList.length / 2));
                return keyList[medianIndex].getLatency();
            }
        }
        return 0;
    }

    // VARIÂNCIA da latência
    this.getLatencyVariance = function() {
        var keys = this.keys;
        var mean = this.getMeanLatency();
        var latency;
        var varianceSum = 0;
        var keysCount = 0;
        var pressedKeys;
        // Para cada tecla do teclado já presionada
        // (Uma iteração para cada tecla DIFERENTE já pressionada)	
        for (var i = 0; i < keys.length; i++) {
            pressedKeys = keys[i];
            if (pressedKeys != null) {
                for (var j = 0; j < pressedKeys.length; j++) {
                    latency = pressedKeys[j].getLatency();
                    varianceSum += Math.pow((latency - mean), 2);
                }
                keysCount += (pressedKeys.length);
            }
        }
        return (varianceSum / keysCount);
    }

    // DESVIO PADRÃO da latência
    this.getLatencyStandardDeviation = function() {
        return Math.sqrt(this.getLatencyVariance());
    }













}