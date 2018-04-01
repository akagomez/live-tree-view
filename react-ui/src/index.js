import React from 'react';
import ReactDOM from 'react-dom';

import { view } from 'react-easy-state'

import Header from './components/header';
import Tree from './components/tree';

import 'milligram/dist/milligram.css'
import './theme.css'

import state from './state'

const App = view(() => (
  <div className="container">
    <div className="row">
      <div className="column">
        <Header />
        <Tree
          children={state.tree.factoryNodes}
          createFactoryFormErrors={state.ui.createFactoryForm.errors}
          createFactoryFormIsVisible={state.ui.createFactoryForm.isVisible}
          onPromptCreateFactoryForm={() => state.ui.createFactoryForm.show()}
          onUpdateCreateFactoryField={(key, value) => {
            state.ui.createFactoryForm.fields[key] = value;
          }}
          onCancelCreateFactoryForm={() => {
            state.ui.createFactoryForm.fields = {}
            state.ui.createFactoryForm.hide()
          }}
          onSubmitCreateFactoryForm={() => state.ui.createFactoryForm.submit()}
          onDestroyChild={child => child.destroy()}
        />
      </div>
    </div>
  </div>
))

ReactDOM.render(
  <App />,
  document.getElementById('root'),
  () => {
    state.init()
  }
);
