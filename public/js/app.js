console.log('Javascript do Front-End')

// interceptar a ação do form do index no front-end
const cotacoesForm = document.querySelector('form');
const mainMessage = document.querySelector('h3');
const price_open = document.querySelector('#price_open');
const price = document.querySelector('#price');
const day_high = document.querySelector('#day_high');
const day_low = document.querySelector('#day_low');

cotacoesForm.addEventListener('submit', (event) => { // toda vez que submeter o form
    mainMessage.innerText = 'Buscando...'
    price_open.innerHTML = '';
    price.innerHTML = '';
    day_high.innerHTML = '';
    day_low.innerHTML = '';
    event.preventDefault();
    const ativo = document.querySelector('input').value;
    
    if (!ativo) {
        mainMessage.innerText = 'O ativo deve ser informado!';
        return;
    }
    
    fetch(`http://localhost:3000/cotacoes?ativo=${ativo}`).then((response) => {  // o then é o callback da função fetch e recebe como parâmetro o response
        response.json().then((data) => {
            if(data.error){
                mainMessage.innerText = `Alguma coisa deu errado`;
                price.innerHTML = `${data.error.message} | código ${data.error.code}`;
            }
            else {
                mainMessage.innerText = data.symbol;
                price_open.innerHTML = `Price Open: ${data.price_open}`;
                price.innerHTML = `Price: ${data.price}`;
                day_high.innerHTML = `Day High: ${data.day_high}`;
                day_low.innerHTML = `Day Low: ${data.day_low}`;
            }
        });
    });
})