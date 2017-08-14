const Sequelize = require( 'sequelize' );
const db = new Sequelize( 'postgres://localhost:5432/sequelize_practice', {
  logging: false
} );

// MODELS ///////////////////////////////////
const User = db.define( 'user', {
  first: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last: {
    type: Sequelize.STRING,
    allowNull: false
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 18
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  bio: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
    // OPTIONS //////////////////////////
    getterMethods: {
      fullName () { return this.first + ' ' + this.last },
    },
    instanceMethods: {

    },
    classMethods: {

    }
  } );

User.prototype.haveBirthday = function () {
  return this.increment({ age: 1 })
}

module.exports = User;
