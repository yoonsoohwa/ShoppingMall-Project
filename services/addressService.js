const { Address } = require('../models/Address');

class AddressService {
  async createAddress({ postnumber, addressee, addressExceptDetail, detail }) {
    const newAddress = await Address.create({
      postnumber,
      addressee,
      addressExceptDetail,
      detail,
    });

    return newAddress;
  }
}

module.exports = new AddressService();
