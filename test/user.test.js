const chai = require('chai');
const expect = chai.expect;

const Sequelize = require('sequelize');

const User = require('../models/user');

describe('User model', function () {

  let bio;
  let user;
  beforeEach(function () {
    bio = 'Once upon a time I knew nothing of databases. Today, I dream in SQL and experience the world through tables and rows. I\'m currently a single entity but I\'m looking for someone else to JOIN me in a RELATIONship. If you enjoy puns as much as I do, send me a query and we can SELECT a time to meet.'

    return User.sync({ force: true })
    .then(function () {
      user = User.build({
        first: 'DB',
        last: 'Admin',
        age: 42,
        email: 'dbAdmin@company.com',
        bio: bio
      });
    });
  });

  describe('fields:', function () {

   it('include `first`, `last`, `age`, `email`, and `bio`', function () {
      return user.save()
      .then(function (savedUser) {
        expect(savedUser.first).to.equal('DB');
        expect(savedUser.last).to.equal('Admin');
        expect(savedUser.age).to.equal(42);
        expect(savedUser.email).to.equal('dbAdmin@company.com');
        expect(savedUser.bio).to.equal(bio);
      })
    });

    it('requires `email`', function () {
      user.email = null;

      return user.validate()
        .then( function ( ) {
        throw new Error('validation should fail without email');
        }, function ( err ) {
          expect( err ).to.be.an.instanceOf( Error );
          expect(err.errors[0].type).to.contain('notNull Violation');
        });
    });

    it('age must be at least 18', function () {
      user.age = 17;

      return user.validate()
      .catch(function (err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.contain('Validation min on age failed');
      });
    });

  });

  describe('options:', function () {

    describe('`fullName` getter', function () {

      it('returns `first` and `last` concatenated with a space between', function () {
        expect(user.fullName).to.equal('DB Admin');
      });

    });

    describe('`haveBirthday` instance method', function () {

      it('returns a promise', function () {
        return user.save()
        .then(function () {
          const birthdayPromise = user.haveBirthday();
          expect(birthdayPromise).to.be.instanceOf(Sequelize.Promise);
          return birthdayPromise;
        });
      });

      it('the returned promise resolves to the user\'s new age', function () {
        return user.save()
        .then(function () {
          return user.haveBirthday()
          .then(function (olderUser) {
            expect(olderUser.age).to.equal(43);
          });
        });
      });

      it('saves the user\'s new age', function () {
        return user.save()
        .then(function () {
          return user.haveBirthday()
          .then(function () {
            return User.findOne({
              where: {
                first: 'DB'
              }
            });
          })
          .then(function (foundUser) {
            expect(foundUser.age).to.equal(43);
          });
        });
      });

    });

  });

});

