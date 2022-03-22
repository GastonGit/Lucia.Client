import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';
import './index.css';
import Gallery from './components/Gallery';
import Header from './components/Header';
import Overview from './components/Overview';

ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <Provider store={store}>
                <Header />
                <Routes>
                    <Route path="/" element={<Gallery />} />
                    <Route path="/:id" element={<Overview />} />
                    <Route path="/search" element={<Gallery />} />
                </Routes>
            </Provider>
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
