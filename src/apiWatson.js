require('dotenv').load();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var assistant = require('watson-developer-cloud/assistant/v1');



// Set up Assistant service wrapper. , 
var service = new assistant({username: process.env.USUARIO,
    password: process.env.SENHA, 
    version: process.env.VERSAO  });

console.log('watson config '+ process.env.WATSON_CONFIG);

var workspace_id = process.env.WORKSPACE;
//'88df41d1-bc06-4860-93c4-4a62aadc9d9d'; // replace with workspace ID



function processResponse(err, response) {
    if (err) {
      console.error(err); // something went wrong
      return;
    }
  
    console.log(JSON.stringify(response));

    console.log('The current time is ' + new Date().toLocaleTimeString() + '.');
    
    // Exibe na console, caso alguma intenção tenha sido detectada
    if (response.intents.length > 0) {
        console.log('Detected intent: #' + response.intents[0].intent);
    }

    // Display the output from dialog, if any.
    for(var i=0; i<response.output.text.length; i++){
        console.log(response.output.text[i]);
    }
    
}  
  


app.use(function(req, res, next) {    
    // habilitando CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

 
// substituir pelo POST
app.post('/api/message/', function (req, res,next) {
    
    let usermessage = req.body.usermessage;
    let context = req.body.context;
    
    var message = {
        workspace_id: workspace_id,
        input: { text: usermessage },
        context: context,
        };

    if (usermessage === ' ')
        delete message['input'];
    
    if (context === ' ')
        delete message['context'];
    
    
    // validando parametros
    console.log("validando parametros");
    console.log("usermessage-"+usermessage+"-");
    console.log("context-"+context+"-");
    console.log(JSON.stringify(message));
    
    service.message( message, 
        (err, response)=>{
            if (err) {
                console.error(err); // algo deu errado
                return;
            }
            console.log("request "+req.body.context);
            console.log("response "+JSON.stringify(response));
            res.send(response);
        });

    /* service.message({
        workspace_id: workspace_id,
        input: { text: req.body.usermessage },
        context: JSON.parse(req.body.context),
        }, (err, response)=>{
            if (err) {
                console.error(err); // algo deu errado
                return;
            }
            console.log(req.body.context);
            res.send(response);
        }); */
});


/* app.get('/api/message/:texto', function (req, res, next) {
    
    service.message({
        workspace_id: workspace_id,
        input: { text: req.params.texto },
        }, (err, response)=>{
            if (err) {
                console.error(err); // algo deu errado
                return;
            }
            console.log(req.params.texto);
            res.send(response);
        });      
    
});
 */

app.listen(process.env.PORTA, function () {
  console.log('servidor ouvindo porta 3001!');
});



