import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Songs from './Songs';
import reportWebVitals from './reportWebVitals';
import {Switch,Route,BrowserRouter} from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <main>
          <Switch>
            <Route path="/" component={App} exact />
            <Route path="/TopMusic"  component={Songs}  />
          </Switch>
      </main>
    </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
