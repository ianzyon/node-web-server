const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
//configurando a porta para o heroku e para rodar localmente
const port = process.env.PORT || 3000;

var app = express(); 

// middleware
app.set('view engine', 'hbs');

app.use(
    (req, res, next) => { 
        var now = new Date().toString();
        var log = `${now}: ${req.method} ${req.url}`
        console.log(log);
        fs.appendFile('server.log', log + '\n',
         (err) => { if (err) { console.log('Unable to append to server.log');}}
        );
        next(); // sem este comando a aplicação nao pode continuar
    }
);
/*app.use( // exemplo de uma pagina que se sobrepõe as demais por causa da falta do next();
    (req, res, next) => {
        res.render('maintenance.hbs');
    }
);*/
app.use(
    express.static(__dirname + '/public') // possibilita receber o PATH absoluto de um diretorio que queremos servir
);
// hbs config
hbs.registerPartials(__dirname + '/views/partials'); // possibilitando a criançao de partials
hbs.registerHelper('getCurrentYear', () => { return new Date().getFullYear() }); // possibilitando uso de funções em partials
hbs.registerHelper('screamIt', (text)=> { return text.toUpperCase(); });

// routes
app.get('/', // root route
(req, res) => {
   // res.send('<h2>Hello Express!</h2>'); // vai mandar conteudo text/html para o browser
  /* res.send({ // informando um objeto o express envia um JSON como resposta, application/json content type
       name: 'Ian',
       likes: [
           'boxing', 
           'gym',
            'skateboarding'
       ]
   })*/
    res.render('index.hbs',
    {
        pageTitle: 'Home Page',
        bodyContent: 'This is the home page.',
        
    }
);
}
);

app.get('/about',
(req, res) => {
    res.render('about.hbs',
    {
        pageTitle: 'About Page',
        

    }
);

}
);
app.get('/bad', 
(req,res) => {
    res.send({
        errorMessage: 'Unable to fetch for request!',
        status: 'NO_GOOD'
    })
}
);
// listen gera um server de http na porta informada
app.listen(port,
    () =>{
        console.log(`Server is up on port ${port}`);
    }
);