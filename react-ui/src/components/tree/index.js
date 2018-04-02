import React from 'react';

import { store, view } from 'react-easy-state'

import FactoryForm from '../factory-form/'

import {
  Plus as PlusIcon,
  Trash as TrashIcon,
  Edit as EditIcon
} from 'react-feather';

import './style.css';

const state = store({
  focusedForm: undefined
})

export default view(({
  children,
  onSubmitCreateForm,
  onSubmitEditForm,
  onPressRemoveButton
}) => (
  <div className="tree">

    <ul>
      <li>
        <span className="node-name">
          Tree Root
        </span>{' '}

        <button
          className="button-feather-icon button-clear"
          onClick={() => {
            state.focusedForm = 'create'
          }}
          disabled={state.focusedForm === 'create'}
        >
          <PlusIcon size="20" />
        </button>

        {state.focusedForm === 'create' &&
          <FactoryForm
            description="Create a new factory node."
            submitButtonText="Create Factory"
            onCancelForm={() => {
              state.focusedForm = undefined
            }}
            onSubmitForm={async (props) => {
              await onSubmitCreateForm(props)
              state.focusedForm = undefined;
            }}
          />
        }

        <ul>
          {children && children.map((child) => (
            <li key={child._id}>
              <span className="node-name">
                {child.name} Factory{' '}
                <code>[{child.lowerBound}...{child.upperBound}]</code>
              </span>{' '}

              <button
                className="button-feather-icon button-clear"
                disabled={state.focusedForm === child._id}
                onClick={() => {
                  state.focusedForm = child._id
                }}
              >
                <EditIcon size="20" />
              </button>{' '}

              <button
                className="button-feather-icon button-clear"
                onClick={() => onPressRemoveButton(child)}
              >
                <TrashIcon size="20" />
              </button>

              {state.focusedForm === child._id &&
                <FactoryForm
                  description={`Update the "${child.name}" factory node.`}
                  submitButtonText="Update Factory"
                  defaultValues={{
                    name: child.name,
                    numberOfChildren: child.numberOfChildren,
                    lowerBound: child.lowerBound,
                    upperBound: child.upperBound
                  }}
                  onCancelForm={() => state.focusedForm = undefined}
                  onSubmitForm={async (props) => {
                    await onSubmitEditForm(child, props)
                    state.editedChildId = undefined
                  }}
                />
              }

              <ul>
                {child.numbers.map((number, i) => (
                  <li key={i}>
                    <span className="node-name">
                      Child {number}
                    </span>
                  </li>
                ))}
              </ul>

            </li>
          ))}
        </ul>

      </li>
    </ul>
  </div>
));
