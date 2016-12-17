class Item {
  constructor (client, data, typeId) {
    this.client = client

    if (data.type !== typeId) {
      throw new Error(`Expected type "${typeId}", but got type "${data.type}"`)
    }
  }
}

module.exports = Item
