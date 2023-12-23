var BTN=document.querySelector("button")
var TEXTAREA=document.querySelector("#textSpeech")
var DIV=document.querySelector("#reponse_msg")
var BTN_MIC=document.querySelector("#bMic")
//var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true; // Obtenez les résultats intermédiaires
recognition.lang = 'en-US';
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;
//EVENEMENT
BTN.addEventListener("click", chatBot)
BTN_MIC.addEventListener("click", speechToText)
//fonction principale
function chatBot(){
    let text=TEXTAREA.value
    //je dois communiquer avec le backend
    var url_backend="http://127.0.0.1:8000/analyse"
    fetch(url_backend,
        {
            method:"POST",
            body:JSON.stringify({"texte":text}),
            headers:{  
                'Content-Type': 'application/json'
            }          
        })
    .then(reponse=>{
        reponse.json()
        .then(data=>{
            console.log(data)
        })
    })
    .catch(e=>{
        console.warn(e)
    })
}


// Fonction pour démarrer la reconnaissance vocale
async function speechToText() {
    // alert("Je suis speech to text");
    try {
      // Commencez la reconnaissance vocale
    demarrerEnregistrement();
    await  recognition.start();
    } catch (error) {
      console.error('Erreur lors du démarrage de la reconnaissance vocale :', error);
    }
  }

recognition.onresult = function(event) {

    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    // Display the interim transcript in the modal
    document.getElementById('transcriptionText').innerHTML = interimTranscript;
    
    //2ème partie récupérer le texte
    var message = event.results[0][0].transcript;
    console.log('Result received: ' + message + '.');
    console.log('Confidence: ' + event.results[0][0].confidence);

    //3ème partie remplir l'input en utilisant ce texte
    if (event.results[0][0].confidence > 0.6)
        {TEXTAREA.value=message}
  }
  recognition.onend = () => {
    arreterEnregistrement();
    console.log('La reconnaissance vocale est terminée.');
  };


  function demarrerEnregistrement() {
    $('#microphoneModal').modal('show');
    // Vous pouvez ajouter ici du code pour démarrer l'enregistrement vocal.
  }

  function arreterEnregistrement() {
    recognition.stop();
    $('#microphoneModal').modal('hide');
  }