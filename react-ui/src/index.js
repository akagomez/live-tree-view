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
          children={state.factoryNodes}
          createFactoryFormIsVisible={state.ui.createFactoryForm.isVisible}
          onPromptCreateFactoryForm={() => state.ui.createFactoryForm.show()}
          onCancelCreateFactoryForm={() => {
            state.ui.createFactoryForm.fields = {}
            state.ui.createFactoryForm.hide()
          }}
          onSubmitCreateFactoryForm={(fields) => state.ui.createFactoryForm.submit(fields)}
          onDestroyChild={child => child.destroy()}
          onPromptChildEditForm={(child) => {
            child.isEditing = true
          }}
          onCancelChildEditForm={(child) => {
            child.isEditing = false
          }}
          onSubmitChildEditForm={async (child, props) => {
            await child.save(props)
            child.isEditing = false;
          }}
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
