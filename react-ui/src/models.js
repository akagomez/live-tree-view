import axios from 'axios';

export class Tree {
  static async findOne(id) {
    const response = await axios.get(`/rest/tree/${id}`)

    return response && response.data.data;
  }
}

export class FactoryNode {
  constructor(props) {
    this.set(props)
  }
  set (props) {
    const node = this;

    Object.keys(props).forEach((key) => {
      node[key] = props[key]
    })
  }
  async save () {

    // TODO: Implement update based on _id
    return await axios.post('/rest/factory', {
      name: this.name,
      numberOfChildren: this.numberOfChildren,
      lowerBound: this.lowerBound,
      upperBound: this.upperBound
    });
  }
  async destroy () {
    return await axios.delete(`/rest/factory/${this._id}`);
  }
}