// file này tự động map vào database

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Specialty", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      descriptionHTML: {
        type: Sequelize.TEXT,
      },
      descriptionMarkdown: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.BLOB("long"),
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Specialty");
  },
};
