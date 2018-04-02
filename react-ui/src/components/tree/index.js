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
  isCreateFormVisible: false,
  editedChildId: undefined
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
            state.isCreateFormVisible = true
            state.editedChildId = undefined
          }}
          disabled={state.isCreateFormVisible}
        >
          <PlusIcon size="20" />
        </button>

        {state.isCreateFormVisible &&
          <FactoryForm
            description="Create a new factory node."
            submitButtonText="Create Factory"
            onCancelForm={() => {
              state.isCreateFormVisible = false
            }}
            onSubmitForm={async (props) => {
              await onSubmitCreateForm(props)
              state.isCreateFormVisible = false;
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
                disabled={state.editedChildId === child._id}
                onClick={() => {
                  state.editedChildId = child._id
                  state.isCreateFormVisible = false
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

              {state.editedChildId === child._id &&
                <FactoryForm
                  description={`Update the "${child.name}" factory node.`}
                  submitButtonText="Update Factory"
                  defaultValues={{
                    name: child.name,
                    numberOfChildren: child.numberOfChildren,
                    lowerBound: child.lowerBound,
                    upperBound: child.upperBound
                  }}
                  onCancelForm={() => state.editedChildId = undefined}
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
