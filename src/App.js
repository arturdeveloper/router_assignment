import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from "styled-components";

// offline data
import data from "./data.json";

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

const MainPanel = styled.div`
display: flex;
flex: 7;
flex-direction: column;
height: auto;
width: auto;
`;

const SidePanel = styled.div`
display: flex;
flex-flow: column;
justify-content: flex-start;
align-items: center;
flex: 1;
padding: 20px;
background-color: hsla(80, 10%, 40%, 1);
`;

const Button = styled.div`
font-size: 18px;
width: 60%;
padding: 1rem;
border-radius: 9px;
// background-color: red;
background-image: linear-gradient( 135deg, #E8D07A 0%, #5312D6 100%);
`;

const WidgetContainer = styled.div`
display: flex;
flex-flow: column;
align-items: center;
padding-top: 40px;
// width: auto;
`;

const currency = ["usd", "eur", "gbp", "jpy"];

// const url = 'http://api.fixer.io/latest?base=USD';
const url = "http://api.fixer.io/latest?base=";

let intervalId;

class App extends React.Component {
  constructor() {
    super();
    this.handler = this.handler.bind(this);
    this.sliderHandler = this.sliderHandler.bind(this);
    this.load_data = this.load_data.bind(this);
  }
  state = { data: {}, fullData: {}, timeInterval: 10000 };

  async load_data() {
    try {
      let fullData = {};

      //   // offline data
      //   fullData[currency[0]] = data;

      for (var i = 0; i < currency.length; i++) {
        let currString = currency[i];
        let req = await fetch(url + currString);
        let results = await req.json();

        fullData[currString] = results;
      }

      this.setState({
        data: fullData[currency[0]],
        fullData: fullData,
        lastUpdated: new Date(Date.now()).toLocaleString()
      });
    } catch (error) {
      alert(error.message);
    }
  }

  componentDidMount() {
    this.load_data();
  }

  handler(e) {
    const arg = e.target.textContent.toLowerCase();
    this.setState({ data: this.state.fullData[arg] });
  }

  sliderHandler = e => {
    const t = Number(e.target.value);
    this.stopInterval();

    intervalId = setInterval(() => {
      console.log({ ku: t });
      this.load_data();
    }, t);

    this.setState({ timeInterval: t });
    e.preventDefault();
  };

  stopInterval = () => {
    clearInterval(intervalId);
  };

  render() {
    let headers = currency.map(elem => {
      return (
        <Link
          style={{ color: "white", textDecoration: "none" }}
          key={elem}
          to={elem}
          onClick={this.handler}
        >
          <h2>{elem.toUpperCase()}</h2>
        </Link>
      );
    });
    let routes = currency.map(elem => {
      return (
        <Route
          key={elem}
          exact
          path={`/${elem}`}
          render={() => <CartItems base={elem} data={this.state.fullData} />}
        />
      );
    });
    // console.log(this.state.data);
    return (
      <Router>
        <div style={{ display: "flex" }}>
          <SidePanel>
            <Button onClick={this.load_data}>Update Data</Button>
            <WidgetContainer>
              <input
                type="range"
                min="10000"
                max="600000"
                value={this.state.timeInterval}
                onChange={this.sliderHandler}
              />
              <label style={{ paddingBottom: "1rem" }}>
                {Math.round(this.state.timeInterval / 1000)}
              </label>
              <Button onClick={this.stopInterval}>Stop Update</Button>
            </WidgetContainer>
            <WidgetContainer>
              <h2>Last Updated</h2>
              <label>{this.state.lastUpdated}</label>
            </WidgetContainer>
          </SidePanel>
          <MainPanel>
            <Header>
              {headers}
            </Header>
            <Cart>
              <Route
                exact
                path={"/"}
                render={() => <CartItems data={this.state.fullData} />}
              />
              {routes}
            </Cart>
          </MainPanel>
        </div>
      </Router>
    );
  }
}

const CartItems = props => {
  console.log("props");
  console.log(props.base);

  var rates = [];
  let showItems = null;
  const data = props.base === undefined
    ? props.data[currency[0]]
    : props.data[props.base];

  if (data !== undefined) {
    for (var key in data.rates) {
      let wholeArr = [key, data.rates[key]];
      rates.push(wholeArr);
    }

    console.log(rates);

    showItems = rates.map(item => {
      return (
        <li style={{ color: "hsla(60, 100%, 50%, 1)" }} key={item[0]}>
          <h2>{item[0]} : {item[1]}</h2>
        </li>
      );
    });
  }

  return (
    <div>
      <ul>
        {showItems}
      </ul>
    </div>
  );
};

export default App;
