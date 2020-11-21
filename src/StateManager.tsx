import React from "react";
import ReactDOM from "react-dom";
import {addToHistory, undo, redo} from "./model/History";
import App from "./App";
import './index.css';
import {createSlidesMaker, deepClone, SlidesMaker} from "./model/SlidesMaker";

let appState: SlidesMaker;

function render(state: SlidesMaker) {
    ReactDOM.render(
        <React.StrictMode>
            <App
                appModel={state}
            />
        </React.StrictMode>,
        document.getElementById('root')
    );
}

function undoAppState() {
    const newAppState: SlidesMaker | undefined = undo(deepClone(appState) as SlidesMaker);
    if (newAppState) {
        appState = newAppState;
    }
    console.log('new undo', appState);
    render(appState);
}

function redoAppState() {
    const newAppState: SlidesMaker | undefined = redo();
    if (newAppState) {
        appState = newAppState;
    }
    console.log('new redo', appState);
    render(appState);
}

function start() {
    appState = createSlidesMaker();
    render(appState);

    window.addEventListener('keydown', (e) => {
        if ((e.key === 'z' || e.key === 'я') && (e.metaKey || e.ctrlKey)) {
            undoAppState();
        }
        if ((e.key === 'y' || e.key === 'н') && (e.metaKey || e.ctrlKey)) {
            redoAppState();
        }
    });
}

function dispatch<T>(fn: (app: SlidesMaker, param: T) => SlidesMaker, arg: T) {
    addToHistory(appState);
    appState = fn(appState, arg);
    render(appState);
    console.log(appState);
}


export {
    start,
    dispatch,
    undoAppState,
    redoAppState
}