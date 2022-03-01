import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import Gallery from './components/Gallery';
import Header from './components/Header';
import Read from './components/Read';

ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <Header />
            <Routes>
                <Route path="/" element={<Gallery />} />
                <Route path="/:id" element={<Read />} />
                <Route path="/search" element={<Gallery />} />
            </Routes>
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
