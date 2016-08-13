<html>
    <head>
        <meta charset="UTF-8" />
        
        <!-- Facebook plugin meta -->
        <?php
            if (isset($_GET["extraversion"]) && isset($_GET["agreeableness"]) && isset($_GET["conscientiousness"]) && isset($_GET["emotionalStability"])  && isset($_GET["opennessToExperiences"])) {
                $extraversion = (int)$_GET["extraversion"];
                $agreeableness = (int)$_GET["agreeableness"];
                $conscientiousness = (int)$_GET["conscientiousness"];
                $emotionalStability = (int)$_GET["emotionalStability"];
                $opennessToExperiences = (int)$_GET["opennessToExperiences"];
        ?>
                <meta property="og:url"           content="http://www.felipegoulart.com/personalityapi/personality.php?extraversion=<?php echo($extraversion); ?>&agreeableness=<?php echo($agreeableness); ?>&conscientiousness=<?php echo($conscientiousness); ?>&emotionalStability=<?php echo($emotionalStability); ?>&opennessToExperiences=<?php echo($opennessToExperiences); ?>" />
                <meta property="og:type"          content="website" />
                <?php
                    if (isset($_GET["name"])) {
                        $name = $_GET["name"];
                ?>                    
                        <meta property="og:title"         content="Traços da personalidade de <?php echo($name); ?>" />
                <?php
                    } else {
                ?>
                        <meta property="og:title"         content="Teste de personalidade" />
                <?php
                    }
                ?>
                <meta property="og:description"   content="Identifique os traços da sua personalidade através de um teste simples e rápido." />
                <!--<meta property="og:image"         content="http://www.your-domain.com/path/image.jpg" />-->
        <?php
            } else {
        ?>
                <meta property="og:url"           content="http://www.felipegoulart.com/personalityapi/" />
                <meta property="og:type"          content="website" />
                <meta property="og:title"         content="Teste de personalidade" />
                <meta property="og:description"   content="Identifique os traços da sua personalidade através de um teste simples e rápido." />
                <!--<meta property="og:image"         content="http://www.your-domain.com/path/image.jpg" />-->
        <?php
            }
        ?>	
        <!-- End of Facebook plugin Meta -->
        
        <link rel="stylesheet" type="text/css" href="Main.css" />
        <script type="text/javascript" src="api/PersonalityAPI.js"></script>
        
        <script type="text/javascript" src="api/KeySet.js"></script>
        <script type="text/javascript" src="api/TIPI.js"></script>
        <script type="text/javascript" src="api/User.js"></script>
        <script type="text/javascript" src="api/KeyObject.js"></script>
        <script type="text/javascript" src="api/DebugWindow.js"></script>
        <script type="text/javascript" src="api/utils/uuid.js"></script>
        
        <script type="text/javascript" src="app/screen/ScreenManager.js"></script>        
        <script type="text/javascript" src="app/Main.js"></script>
        <script type="text/javascript" src="https://www.google.com/jsapi"></script>
        <script type="text/javascript">
            google.load("visualization", "1", {packages:["corechart"]});
        </script>
        <title>Teste de personalidade</title>        
    </head>
    <body>
        <!-- Facebook share plugin -->
        <div id="fb-root"></div>
        <script>
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.5";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        </script>
        <!-- End of Facebook share plugin -->
        
        <!--<input type="button" value="Print Data" onClick="javascript:PersonalityAPI.save(function(data) {console.log('Works: ' + data); var e = document.getElementById('server-data'); e.innerHTML = data;});"/>
        <p id="server-data">Empty</p>-->
        
        <!-- Introdução sobre a pesquisa -->
        <div id="researchIntroduction" class="ui-hidden">
            <div class="groupBox">
                <div class="groupBoxHeader">
                    <span>Objetivo da pesquisa</span>
                </div>
                <div class="groupBoxContent">
                    <p>Esta pesquisa tem como objetivo coletar dados da personalidade de usuários de computador, onde os participantes deverão digitar um texto predefinido <span class="introductionHighlight">(2 linhas)</span> e responder um questionário de autoavaliação <span class="introductionHighlight">(10 questões)</span>.</p>
                    <div class="right-side">
                        <input type="button" value="Entendi" onClick="javascript:onIntroductionConfirmButtonClick();" />
                    </div>
                </div>
                <div class="groupBoxFooter"></div>
            </div>
        </div>
                        
        <!-- Termo de consentimento -->
        <div id="consentForm" class="ui-hidden">
            <div class="groupBox">
                <div class="groupBoxHeader">
                    <span>Termo de consentimento livre</span>
                </div>
                <div class="groupBoxContent">
                    <p>Declaro que fui devidamente esclarecido sobre o objetivo da pesquisa que está sendo desenvolvida, que tenho conhecimento sobre o sigilo do meu nome em relação aos dados por mim fornecidos ou que serão coletados. Estou ciente também do meu direito de recusa e desistência em qualquer momento da pesquisa. Dessa forma, desejo voluntariamente participar deste estudo, e autorizo a utilização dos dados por mim produzidos para os fins aos quais se destina a pesquisa, podendo estes serem posteriormente divulgados entre a comunidade científica.</p>
                    <div id="acceptConsentForm">
                        <input type="checkbox" id="acceptTerm" name="acceptTerm" checked="checked" />
                        <label for="acceptTerm">Eu aceito o termo de consentimento e desejo continuar na pesquisa.</label>
                    </div>
                    <br />
                    <br />
                    <div class="right-side">
                        <input type="button" value="Aceitar" onClick="javascript:onConsentFormConfirmButtonClick();" />
                    </div>
                </div>
                <div class="groupBoxFooter"></div>
            </div>
        </div>
        
        <div id="register" class="ui-hidden">
            <div class="groupBox">
                <div class="groupBoxHeader">
                    <span>Cadastro</span>
                </div>
                <div class="groupBoxContent">
                    <label for="nameField">Nome:</label><input type="text" id="nameField" name="nameField" value="" maxLength="100" />                    
                    <br />
                    <br />
                    <label for="emailField">E-mail:</label><input type="text" id="emailField" name="emailField" value="" maxLength="100" />
                    <br />
                    <br />
                    <label for="ageField">Idade:</label><input type="text" id="ageField" name="ageField" value="" />
                    <span class="registerRequiredField">*Campo obrigatório</span>
                    <br />
                    <br />
                    <!-- Seleção de genero -->
                    <span class="registerRequiredField">*Campo obrigatório</span>
                    <div id="genderSelection">
                        <!--<span>Selecione seu gênero</span>
                        <br />
                        <br />-->
                        <input type="radio" id="genderMale" name="genderRadio" value="M" checked="checked" /><label for="genderMale">Masculino</label>                        
                        <input type="radio" id="genderFemale" name="genderRadio" value="F" /><label for="genderFemale">Feminino</label>                        
                    </div>
                    <br />
                    <br />
                    <div class="right-side">
                        <input type="button" value="Cadastrar" onClick="javascript:onRegisterButtonClick();" />
                    </div>
                </div>
                <div class="groupBoxFooter"></div>                               
            </div>
            <p id="registerAdditionalInformation">Com o intuito de garantir sua privacidade os dados de <span class="registerPrivateFields">nome</span> e <span class="registerPrivateFields">e-mail</span> serão utilizados apenas para contatos futuros sobre a pesquisa, não sendo estes publicados ou compartilhados com terceiros.</p>
        </div>
        
        
        <!-- Texto fixo para extração de características -->
        <div id="keystrokeExtraction" class="ui-hidden">
            <div class="groupBox">
                <div class="groupBoxHeader">
                    <span>Ritmo de digitação</span>
                </div>
                <div class="groupBoxContent">
                    <h4>Por favor, digite o texto abaixo exatamente como é apresentado:</h4>		
                    <br />
                    <div>
                        <span id="targetText">ADICIONAR AQUI TEXTO PARA SER DIGITADO!</span>
                        <br />
                        <br />
                    </div>
                    <textArea id="aboutYourSelfText" cols="90" rows="20" onClick="javascript:onTextAreaClick(this);"></textArea>
                    <br />
                    <br />
                    <div class="right-side">
                        <input type="button" onClick="onKeystrokeExtractionSendButtonClick()" value="Enviar" />
                    </div>
                </div>
                <!-- Número de tentativas -->
                <div>
                    <p id="typedCount">1/2</p>
                </div>
                <div class="groupBoxFooter"></div>
            </div>
        </div>
        
        
        <!-- Perguntas do TIPI -->
        <div id="questions" class="ui-hidden">
            <div class="groupBox">
                <div class="groupBoxHeader">
                    <span>Questionário de autoavaliação</span>
                </div>
                <div class="groupBoxContent">
                    <div id="info">
                    <!--<h2>Questionário de autoavaliação</h2>-->
                    <h3>Ten-Item Personality Inventory (TIPI)</h3>
                        <!--<p>Here are a number of personality traits that may or may not apply to you.  Please write a number next to</p>
                        <p>each statement to indicate the extent to which you agree or disagree with that statement. You should rate the</p>
                        <p>extent to which the pair of traits applies to you, even if one characteristic applies more strongly than the other.</p>-->
                    </div>
                    <hr />
                    <br />
                    <div id="items">
                        <span id="questionCounter"></span>
                        <p id="initialPhrase">Eu me vejo como...</p>
                        <p id="question">Extrovertido, entusiasta.</p>
                        <ul>
                            <li>
                                <input id="answer01" type="radio" name="answer" value="1" />
                                <label for="answer01">Discordo Totalmente</label>
                            </li>
                            <li>
                                <input id="answer02" type="radio" name="answer" value="2" />
                                <label for="answer02">Discordo Parcialmente</label>
                            </li>
                            <li>
                                <input id="answer03" type="radio" name="answer" value="3" />
                                <label for="answer03">Discordo um pouco</label>
                            </li>
                            <li>
                                <input id="answer04" type="radio" name="answer" value="4" />
                                <label for="answer04">Nem discordo nem concordo</label>
                            </li>
                            <li>
                                <input id="answer05" type="radio" name="answer" value="5" />
                                <label for="answer05">Concordo um pouco</label>
                            </li>
                            <li>
                                <input id="answer06" type="radio" name="answer" value="6" />
                                <label for="answer06">Concordo Parcialmente</label>
                            </li>
                            <li>
                                <input id="answer07" type="radio" name="answer" value="7" />
                                <label for="answer07">Concordo Totalmente</label>
                            </li>
                        </ul>			
                    </div>
                    <br />
                    <div class="right-side">
                        <input type="button" onClick="onAnswerButtonClick()" value="Próxima" />
                    </div>
                </div>
                <div class="groupBoxFooter"></div>
            </div>
        </div>
        
        
        <div id="endQuestions" class="ui-hidden">
            <h2>O teste chegou ao fim. Obrigado pela sua colaboração!</h2>
            <br />            
            <div id="personalityDataContainer">                
                <div id="personalityData" style="width: 900px; height: 500px;"></div>
            </div>
            <br />
            <input type="button" value="Finalizar teste!" onClick="javascript:onFinishTestButtonClick()" />
        </div>        
    </body>
</html>