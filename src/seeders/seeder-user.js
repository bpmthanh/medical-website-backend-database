"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        email: "test@example.com",
        password: "123321",
        firstName: "test",
        lastName: "test",
        address: "test",
        phoneNumber: "0924694598",
        gender: 1,
        image: "31231",
        roleId: "12312",
        positionId: "12312",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
