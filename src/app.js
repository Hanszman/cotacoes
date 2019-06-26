const path = require('path'); // chamando a biblioteca path (serve para acessar caminhos)
const express = require('express'); // chamando a biblioteca express (serve para rodar a aplicação em node localmente)
const hbs = require('hbs') // chamando a biblioteca hbs
const cotacoes = require('./util/cotacao'); // importa o arquivo de cotações

const app = express(); // configuração básica do express

// console.log(__dirname); // mostra o nome do diretório deste arquivo
// console.log(__filename); // mostra o nome deste arquivo
// console.log(path.join(__dirname, '../public')); // mostra o diretório da pasta public

const publicDirectoryPath = path.join(__dirname, '../public'); // pega o diretório da pasta public
const viewsPath = path.join(__dirname, '../templates/views'); // pega o diretório da pasta templates/views
const partialsPath = path.join(__dirname, '../templates/partials'); // pega o diretório da pasta templates/partials

app.set('view engine', 'hbs'); // configuração do HBS (por padrão, utiliza arquivos hbs da pasta chamada views que deve se encontrar na raiz do projeto)
app.set('views', viewsPath); // faz a pasta templates/views (definida no viewsPath) ser a pasta utilizada pelo HBS, ao invés de utilizar o nome obrigatório de views (na raiz) para a pasta que contém os arquivos hbs

hbs.registerPartials(partialsPath) // registra o caminho do partials

// * Rotas do sistema:

// 1-) utilizando o app.use e o diretório do public:
app.use(express.static(publicDirectoryPath)) // usa o caminho estático que foi pego anteriormente

// 2-) utilizando o app.get para cada rota:

// -> Rota da página inicial
// app.get('', (req, res) => { // não recebe path e recebe como segundo parâmetro uma função
//     // o que a função recebe é o "req" e o que a função envia é o "res"
//     res.send('<h1>Hello my app</h1>');
// });

// -> Rota da página inicial (utilizando render ao invés de send)
app.get('', (req, res) => { // não recebe path e recebe como segundo parâmetro uma função
    // o que a função recebe é o "req" e o que a função envia é o "res"
    res.render('index', {
        title: 'Bem vindo ao sistema de cotações',
        author: 'Victor Hanszman'
    });
});

// -> Rota do help 
// app.get('/help', (req, res) => { // recebe o path /help e recebe como segundo parâmetro uma função
//     // o que a função recebe é o "req" e o que a função envia é o "res"
//     res.send('Help page');
// });

// -> Rota do help  (utilizando render ao invés de send)
app.get('/help', (req, res) => { // recebe o path /help e recebe como segundo parâmetro uma função
    // o que a função recebe é o "req" e o que a função envia é o "res"
    res.render('help', {
        title: 'Ajuda',
        author: 'Victor Hanszman'
    });
});

// -> Rota do about
// app.get('/about', (req, res) => { // recebe o path /about e recebe como segundo parâmetro uma função
//     // o que a função recebe é o "req" e o que a função envia é o "res"
//     res.send('About page');
// });

// -> Rota do about (utilizando render ao invés de send)
app.get('/about', (req, res) => { // recebe o path /about e recebe como segundo parâmetro uma função
    // o que a função recebe é o "req" e o que a função envia é o "res"
    res.render('about', {
        title: 'Sobre',
        author: 'Victor Hanszman'
    });
});

// -> Rota do cotações
// app.get('/cotacoes', (req, res) => { // recebe o path /cotacoes e recebe como segundo parâmetro uma função
//     // o que a função recebe é o "req" e o que a função envia é o "res"
//     const cotacao = {
//         symbol: 'PETR4.SA',
//         price_open: 10,
//         price: 12,
//         day_high: 13,
//         day_low: 9
//     }

//     const cotacoes = new Array();
//     cotacoes.push(cotacao);
//     cotacoes.push(cotacao);

//     res.send(cotacoes);
// });

// -> Rota do cotações (utilizando json ao invés de send e utilizando um novo arquivo de cotações)
app.get('/cotacoes', (req, res) => { // recebe o path /cotacoes e recebe como segundo parâmetro uma função
    // o que a função recebe é o "req" e o que a função envia é o "res"
    
    if(!req.query.ativo){ // se não tiver um ativo passando pela url, é retornado um erro
        return res.status(400).json({
            error: {
                message: 'O ativo deve ser informado como query parameter',
                code: 400
            }
        }); // imprime o erro na tela; status de falta de informação
    }

    const symbol = req.query.ativo.toUpperCase(); // symbol recebe o valor do ativo em letras maiúsculas

    cotacoes(symbol, (err, body) => {
        if(err){ // se houver erro
            console.log(err); // imprime o erro no console 
            return res.status(err.code).json({error: {
                message: err.message,
                code: err.code
            }}); // imprime a mensagem de erro na tela; status de erro
        }
        console.log(body); // imprime os valores do json de cotações no console 
        res.status(200).json(body); // imprime os valores do json de cotações na tela; status de sucesso 
    });
    
    // console.log(req.query.ativo); // imprime no console aquilo que foi passado como parâmetro na variável ativo da url 
});

// Tratamento de erros nas rotas (404)
app.get('*', (req, res) => { 
    // res.send('404'); // esta seria a forma normal de fazer o tratamento do 404
    res.render('404', {
        title: '404',
        errorMessage : 'Página não encontrada',
        author: 'Victor Hanszman'
    }); // desta forma é chamada a página de render hbs (que foi editada com css)
});

// * Definição do servidor
app.listen(3000, () => { // primeiro parâmetro é a porta e o segundo é uma função
    console.log('Server is up on port 3000'); 
});

// para rodar a aplicação localmente no navegador (localhost:3000/), é necessário executar em linha de comando:
// node src/app.js
// assim é iniciado o servidor
// para matar o servidor basta digitar ctrl + c
// para rodar a aplicação sem ter que ficar salvando, matando e reeiniciando, basta executar a aplicação do seguinte modo em linha de comando:
// nodemon src/app.js