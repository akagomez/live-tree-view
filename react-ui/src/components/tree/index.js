import React, { Component } from 'react'

import { store, view } from 'react-easy-state'

import FactoryForm from '../factory-form/'

import {
  Plus as PlusIcon,
  Trash as TrashIcon,
  Edit as EditIcon
} from 'react-feather';

import './style.css';

class Tree extends Component {
  ui = store({
    focusedForm: undefined
  })

  render () {

    const ui = this.ui
    const {
      children,
      onSubmitCreateForm,
      onSubmitEditForm,
      onPressRemoveButton
    } = this.props

    return (
      <div className="tree">

        <ul>
          <li>
            <span className="node-name">
              Tree Root
            </span>{' '}

            <button
              className="button-feather-icon button-clear"
              onClick={() => {
                ui.focusedForm = 'create'
              }}
              disabled={ui.focusedForm === 'create'}
            >
              <PlusIcon size="20" />
            </button>

            {ui.focusedForm === 'create' &&
              <FactoryForm
                description="Create a new factory node."
                submitButtonText="Create Factory"
                onCancelForm={() => {
                  ui.focusedForm = undefined
                }}
                onSubmitForm={async (props) => {
                  await onSubmitCreateForm(props)
                  ui.focusedForm = undefined;
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
                    disabled={ui.focusedForm === child._id}
                    onClick={() => {
                      ui.focusedForm = child._id
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

                  {ui.focusedForm === child._id &&
                    <FactoryForm
                      description={`Update the "${child.name}" factory node.`}
                      submitButtonText="Update Factory"
                      defaultValues={{
                        name: child.name,
                        numberOfChildren: child.numberOfChildren,
                        lowerBound: child.lowerBound,
                        upperBound: child.upperBound
                      }}
                      onCancelForm={() => ui.focusedForm = undefined}
                      onSubmitForm={async (props) => {
                        await onSubmitEditForm(child, props)
                        ui.focusedForm = undefined
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
    )
  }
}

export default view(Tree)
