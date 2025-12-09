'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "OTP", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "OTP"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "OTP",)
    
  }
};
