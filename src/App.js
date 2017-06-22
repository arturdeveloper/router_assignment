import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import styled from 'styled-components';

// offline data
import data from './data.json';

const Header = styled.div`
display: flex;
flex-direction: row;
@media (max-width: 320px) {
    flex-direction: column;
    background-color: hsla(10, 80%, 60%, 1);
}
justify-content: space-around;
align-items: center;
min-height: 100px;
height: auto;
background-color: hsla(10, 30%, 50%, 1);
color: white;
`;

const Cart = styled.div`
display: flex;
flex-direction: row;
justify-content: space-around;
align-items: center;
height: auto;
background-color: hsla(115, 40%, 50%, 1);
color: white;
`;

const currency = ['usd', 'eur', 'gbp', 'jpy'];

// const url = 'http://api.fixer.io/latest?base=USD';
const url = 'http://api.fixer.io/latest?base=';


class App extends React.Component {
    constructor() {
        super();
        this.handler=this.handler.bind(this);

    }
    state = {data: {}}

    async load_data(path) {

        try {
                
            const req = await fetch(path);
            const results = await req.json();

            // offline data
            // const results = data;
            // console.log(results.rates);

            /*// TODO. why gives error - function not found
            var rates = [];
            for (var key in results.rates){
                let wholeObj = {};
                wholeObj[key] = results.rates[key];
                let wholeArr = [key, results.rates[key]];
                rates.push(wholeArr);
            }
             this.setState({data: rates});
             */

            this.setState({data: results});

        } catch (error) {
            alert(error.message);
        }
    }

    componentDidMount() {
        this.load_data(url + currency[0]);
    }

    handler(e) {
        const arg = e.target.textContent;
        this.load_data(url + arg);
    }

    render(){

        let headers = currency.map((elem) => {
            return (
                <Link style={{color: 'white', textDecoration: 'none'}} key={elem} to={elem} onClick={this.handler}>
                    <h2>{elem.toUpperCase()}</h2>
                </Link>
            )
        });
        let routes = currency.map((elem) => {
            return (
                <Route key={elem} exact path={`/${elem}`} component={()=> <CartItems base={elem} data={this.state.data} />} />
            )
        });
        // console.log(this.state.data);
        return(
            <Router>
            <div>
            <Header>
                {headers}
            </Header>
            <Cart>
                <Route exact path={'/'} component={()=> <CartItems data={this.state.data} />} />
                {routes}
            </Cart>
            </div>
            </Router>
        )
    }
}

const CartItems =(props)=> {

    var rates = [];
    for (var key in props.data.rates){
        let wholeArr = [key, props.data.rates[key]];
        rates.push(wholeArr);
    }

    console.log(rates);

    const showItems = rates.map((item)=> {
        return (
            <li style={{color: 'hsla(60, 100%, 50%, 1)'}} key={item[0]}><h2>{item[0]} : {item[1]}</h2></li>
        )
    });

    return (
    <div>
    <ul>
    {showItems}
    </ul>
    </div>
)};

export default App;