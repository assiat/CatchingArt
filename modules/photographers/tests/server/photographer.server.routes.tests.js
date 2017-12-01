'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Photographer = mongoose.model('Photographer'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  photographer;

/**
 * Photographer routes tests
 */
describe('Photographer CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Photographer
    user.save(function () {
      photographer = {
        name: 'Photographer name'
      };

      done();
    });
  });

  it('should be able to save a Photographer if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Photographer
        agent.post('/api/photographers')
          .send(photographer)
          .expect(200)
          .end(function (photographerSaveErr, photographerSaveRes) {
            // Handle Photographer save error
            if (photographerSaveErr) {
              return done(photographerSaveErr);
            }

            // Get a list of Photographers
            agent.get('/api/photographers')
              .end(function (photographersGetErr, photographersGetRes) {
                // Handle Photographers save error
                if (photographersGetErr) {
                  return done(photographersGetErr);
                }

                // Get Photographers list
                var photographers = photographersGetRes.body;

                // Set assertions
                (photographers[0].user._id).should.equal(userId);
                (photographers[0].name).should.match('Photographer name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Photographer if not logged in', function (done) {
    agent.post('/api/photographers')
      .send(photographer)
      .expect(403)
      .end(function (photographerSaveErr, photographerSaveRes) {
        // Call the assertion callback
        done(photographerSaveErr);
      });
  });

  it('should not be able to save an Photographer if no name is provided', function (done) {
    // Invalidate name field
    photographer.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Photographer
        agent.post('/api/photographers')
          .send(photographer)
          .expect(400)
          .end(function (photographerSaveErr, photographerSaveRes) {
            // Set message assertion
            (photographerSaveRes.body.message).should.match('Please fill Photographer name');

            // Handle Photographer save error
            done(photographerSaveErr);
          });
      });
  });

  it('should be able to update an Photographer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Photographer
        agent.post('/api/photographers')
          .send(photographer)
          .expect(200)
          .end(function (photographerSaveErr, photographerSaveRes) {
            // Handle Photographer save error
            if (photographerSaveErr) {
              return done(photographerSaveErr);
            }

            // Update Photographer name
            photographer.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Photographer
            agent.put('/api/photographers/' + photographerSaveRes.body._id)
              .send(photographer)
              .expect(200)
              .end(function (photographerUpdateErr, photographerUpdateRes) {
                // Handle Photographer update error
                if (photographerUpdateErr) {
                  return done(photographerUpdateErr);
                }

                // Set assertions
                (photographerUpdateRes.body._id).should.equal(photographerSaveRes.body._id);
                (photographerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Photographers if not signed in', function (done) {
    // Create new Photographer model instance
    var photographerObj = new Photographer(photographer);

    // Save the photographer
    photographerObj.save(function () {
      // Request Photographers
      request(app).get('/api/photographers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Photographer if not signed in', function (done) {
    // Create new Photographer model instance
    var photographerObj = new Photographer(photographer);

    // Save the Photographer
    photographerObj.save(function () {
      request(app).get('/api/photographers/' + photographerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', photographer.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Photographer with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/photographers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Photographer is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Photographer which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Photographer
    request(app).get('/api/photographers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Photographer with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Photographer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Photographer
        agent.post('/api/photographers')
          .send(photographer)
          .expect(200)
          .end(function (photographerSaveErr, photographerSaveRes) {
            // Handle Photographer save error
            if (photographerSaveErr) {
              return done(photographerSaveErr);
            }

            // Delete an existing Photographer
            agent.delete('/api/photographers/' + photographerSaveRes.body._id)
              .send(photographer)
              .expect(200)
              .end(function (photographerDeleteErr, photographerDeleteRes) {
                // Handle photographer error error
                if (photographerDeleteErr) {
                  return done(photographerDeleteErr);
                }

                // Set assertions
                (photographerDeleteRes.body._id).should.equal(photographerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Photographer if not signed in', function (done) {
    // Set Photographer user
    photographer.user = user;

    // Create new Photographer model instance
    var photographerObj = new Photographer(photographer);

    // Save the Photographer
    photographerObj.save(function () {
      // Try deleting Photographer
      request(app).delete('/api/photographers/' + photographerObj._id)
        .expect(403)
        .end(function (photographerDeleteErr, photographerDeleteRes) {
          // Set message assertion
          (photographerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Photographer error error
          done(photographerDeleteErr);
        });

    });
  });

  it('should be able to get a single Photographer that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Photographer
          agent.post('/api/photographers')
            .send(photographer)
            .expect(200)
            .end(function (photographerSaveErr, photographerSaveRes) {
              // Handle Photographer save error
              if (photographerSaveErr) {
                return done(photographerSaveErr);
              }

              // Set assertions on new Photographer
              (photographerSaveRes.body.name).should.equal(photographer.name);
              should.exist(photographerSaveRes.body.user);
              should.equal(photographerSaveRes.body.user._id, orphanId);

              // force the Photographer to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Photographer
                    agent.get('/api/photographers/' + photographerSaveRes.body._id)
                      .expect(200)
                      .end(function (photographerInfoErr, photographerInfoRes) {
                        // Handle Photographer error
                        if (photographerInfoErr) {
                          return done(photographerInfoErr);
                        }

                        // Set assertions
                        (photographerInfoRes.body._id).should.equal(photographerSaveRes.body._id);
                        (photographerInfoRes.body.name).should.equal(photographer.name);
                        should.equal(photographerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Photographer.remove().exec(done);
    });
  });
});
