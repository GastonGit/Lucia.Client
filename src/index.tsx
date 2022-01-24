import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import App from './components/App';
import Header from './components/Header';
import MangaOverview from './components/MangaOverview';

ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <Header />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/manga/:id" element={<MangaOverview />} />
            </Routes>
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
