import React from 'react';
import '../styles/App.css';
import Boil from '../lib/Boil';

const boil = new Boil('rice');

class App extends React.Component<unknown, unknown> {
    constructor(props: unknown) {
        super(props);
        boil.boilFood();
    }

    render(): JSX.Element {
        const food = boil.getBoiledFood();

        return (
            <div className="app">
                <header className="app__header">
                    <p>{food}</p>
                </header>
            </div>
        );
    }
}

export default App;
