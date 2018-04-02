import axios from 'axios';

export class FactoryNode {

  constructor(props) {
    Object.assign(this, props)
  }

  async save (newProps) {
    const currentProps = {
      name: this.name,
      numberOfChildren: this.numberOfChildren,
      lowerBound: this.lowerBound,
      upperBound: this.upperBound
    }

    const props = Object.assign({}, currentProps, newProps)

    return this._id ?
      await axios.put(`/rest/factory/${this._id}`, props) :
      await axios.post('/rest/factory', props);
  }

  async destroy () {
    return await axios.delete(`/rest/factory/${this._id}`);
  }

  static async findAll() {
    const response = await axios.get(`/rest/factory`)
    return response && response.data.data;
  }
}