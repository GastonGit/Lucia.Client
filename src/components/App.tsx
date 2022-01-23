import React from 'react';
import '../styles/App.css';

class App extends React.Component<unknown, unknown> {
    constructor(props: unknown) {
        super(props);
    }

    render(): JSX.Element {
        return (
            <div className="app">
                <header className="app__header">
                    <p></p>
                </header>
            </div>
        );
    }
}

export default App;
