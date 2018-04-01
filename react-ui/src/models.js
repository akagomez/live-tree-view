import axios from 'axios';

export class Tree {
  static async findOne(id) {
    const response = await axios.get(`/rest/tree/${id}`)

    return response && response.data.data;
  }
}

export class FactoryNode {
  constructor({
    _id,
    name,
    numberOfChildren,
    lowerBound,
    upperBound
  }) {
    this._id = _id
    this.name = name
    this.numberOfChildren = numberOfChildren
    this.lowerBound = lowerBound
    this.upperBound = upperBound
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