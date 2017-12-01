'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Trophy = mongoose.model('Trophy'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  trophy;

/**
 * Trophy routes tests
 */
describe('Trophy CRUD tests', function () {

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

    // Save a user to the test db and create new Trophy
    user.save(function () {
      trophy = {
        name: 'Trophy name'
      };

      done();
    });
  });

  it('should be able to save a Trophy if logged in', function (done) {
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

        // Save a new Trophy
        agent.post('/api/trophies')
          .send(trophy)
          .expect(200)
          .end(function (trophySaveErr, trophySaveRes) {
            // Handle Trophy save error
            if (trophySaveErr) {
              return done(trophySaveErr);
            }

            // Get a list of Trophies
            agent.get('/api/trophies')
              .end(function (trophiesGetErr, trophiesGetRes) {
                // Handle Trophies save error
                if (trophiesGetErr) {
                  return done(trophiesGetErr);
                }

                // Get Trophies list
                var trophies = trophiesGetRes.body;

                // Set assertions
                (trophies[0].user._id).should.equal(userId);
                (trophies[0].name).should.match('Trophy name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Trophy if not logged in', function (done) {
    agent.post('/api/trophies')
      .send(trophy)
      .expect(403)
      .end(function (trophySaveErr, trophySaveRes) {
        // Call the assertion callback
        done(trophySaveErr);
      });
  });

  it('should not be able to save an Trophy if no name is provided', function (done) {
    // Invalidate name field
    trophy.name = '';

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

        // Save a new Trophy
        agent.post('/api/trophies')
          .send(trophy)
          .expect(400)
          .end(function (trophySaveErr, trophySaveRes) {
            // Set message assertion
            (trophySaveRes.body.message).should.match('Please fill Trophy name');

            // Handle Trophy save error
            done(trophySaveErr);
          });
      });
  });

  it('should be able to update an Trophy if signed in', function (done) {
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

        // Save a new Trophy
        agent.post('/api/trophies')
          .send(trophy)
          .expect(200)
          .end(function (trophySaveErr, trophySaveRes) {
            // Handle Trophy save error
            if (trophySaveErr) {
              return done(trophySaveErr);
            }

            // Update Trophy name
            trophy.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Trophy
            agent.put('/api/trophies/' + trophySaveRes.body._id)
              .send(trophy)
              .expect(200)
              .end(function (trophyUpdateErr, trophyUpdateRes) {
                // Handle Trophy update error
                if (trophyUpdateErr) {
                  return done(trophyUpdateErr);
                }

                // Set assertions
                (trophyUpdateRes.body._id).should.equal(trophySaveRes.body._id);
                (trophyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Trophies if not signed in', function (done) {
    // Create new Trophy model instance
    var trophyObj = new Trophy(trophy);

    // Save the trophy
    trophyObj.save(function () {
      // Request Trophies
      request(app).get('/api/trophies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Trophy if not signed in', function (done) {
    // Create new Trophy model instance
    var trophyObj = new Trophy(trophy);

    // Save the Trophy
    trophyObj.save(function () {
      request(app).get('/api/trophies/' + trophyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', trophy.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Trophy with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/trophies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Trophy is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Trophy which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Trophy
    request(app).get('/api/trophies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Trophy with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Trophy if signed in', function (done) {
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

        // Save a new Trophy
        agent.post('/api/trophies')
          .send(trophy)
          .expect(200)
          .end(function (trophySaveErr, trophySaveRes) {
            // Handle Trophy save error
            if (trophySaveErr) {
              return done(trophySaveErr);
            }

            // Delete an existing Trophy
            agent.delete('/api/trophies/' + trophySaveRes.body._id)
              .send(trophy)
              .expect(200)
              .end(function (trophyDeleteErr, trophyDeleteRes) {
                // Handle trophy error error
                if (trophyDeleteErr) {
                  return done(trophyDeleteErr);
                }

                // Set assertions
                (trophyDeleteRes.body._id).should.equal(trophySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Trophy if not signed in', function (done) {
    // Set Trophy user
    trophy.user = user;

    // Create new Trophy model instance
    var trophyObj = new Trophy(trophy);

    // Save the Trophy
    trophyObj.save(function () {
      // Try deleting Trophy
      request(app).delete('/api/trophies/' + trophyObj._id)
        .expect(403)
        .end(function (trophyDeleteErr, trophyDeleteRes) {
          // Set message assertion
          (trophyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Trophy error error
          done(trophyDeleteErr);
        });

    });
  });

  it('should be able to get a single Trophy that has an orphaned user reference', function (done) {
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

          // Save a new Trophy
          agent.post('/api/trophies')
            .send(trophy)
            .expect(200)
            .end(function (trophySaveErr, trophySaveRes) {
              // Handle Trophy save error
              if (trophySaveErr) {
                return done(trophySaveErr);
              }

              // Set assertions on new Trophy
              (trophySaveRes.body.name).should.equal(trophy.name);
              should.exist(trophySaveRes.body.user);
              should.equal(trophySaveRes.body.user._id, orphanId);

              // force the Trophy to have an orphaned user reference
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

                    // Get the Trophy
                    agent.get('/api/trophies/' + trophySaveRes.body._id)
                      .expect(200)
                      .end(function (trophyInfoErr, trophyInfoRes) {
                        // Handle Trophy error
                        if (trophyInfoErr) {
                          return done(trophyInfoErr);
                        }

                        // Set assertions
                        (trophyInfoRes.body._id).should.equal(trophySaveRes.body._id);
                        (trophyInfoRes.body.name).should.equal(trophy.name);
                        should.equal(trophyInfoRes.body.user, undefined);

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
      Trophy.remove().exec(done);
    });
  });
});
