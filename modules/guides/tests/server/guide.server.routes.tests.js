'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Guide = mongoose.model('Guide'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  guide;

/**
 * Guide routes tests
 */
describe('Guide CRUD tests', function () {

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

    // Save a user to the test db and create new Guide
    user.save(function () {
      guide = {
        name: 'Guide name'
      };

      done();
    });
  });

  it('should be able to save a Guide if logged in', function (done) {
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

        // Save a new Guide
        agent.post('/api/guides')
          .send(guide)
          .expect(200)
          .end(function (guideSaveErr, guideSaveRes) {
            // Handle Guide save error
            if (guideSaveErr) {
              return done(guideSaveErr);
            }

            // Get a list of Guides
            agent.get('/api/guides')
              .end(function (guidesGetErr, guidesGetRes) {
                // Handle Guides save error
                if (guidesGetErr) {
                  return done(guidesGetErr);
                }

                // Get Guides list
                var guides = guidesGetRes.body;

                // Set assertions
                (guides[0].user._id).should.equal(userId);
                (guides[0].name).should.match('Guide name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Guide if not logged in', function (done) {
    agent.post('/api/guides')
      .send(guide)
      .expect(403)
      .end(function (guideSaveErr, guideSaveRes) {
        // Call the assertion callback
        done(guideSaveErr);
      });
  });

  it('should not be able to save an Guide if no name is provided', function (done) {
    // Invalidate name field
    guide.name = '';

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

        // Save a new Guide
        agent.post('/api/guides')
          .send(guide)
          .expect(400)
          .end(function (guideSaveErr, guideSaveRes) {
            // Set message assertion
            (guideSaveRes.body.message).should.match('Please fill Guide name');

            // Handle Guide save error
            done(guideSaveErr);
          });
      });
  });

  it('should be able to update an Guide if signed in', function (done) {
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

        // Save a new Guide
        agent.post('/api/guides')
          .send(guide)
          .expect(200)
          .end(function (guideSaveErr, guideSaveRes) {
            // Handle Guide save error
            if (guideSaveErr) {
              return done(guideSaveErr);
            }

            // Update Guide name
            guide.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Guide
            agent.put('/api/guides/' + guideSaveRes.body._id)
              .send(guide)
              .expect(200)
              .end(function (guideUpdateErr, guideUpdateRes) {
                // Handle Guide update error
                if (guideUpdateErr) {
                  return done(guideUpdateErr);
                }

                // Set assertions
                (guideUpdateRes.body._id).should.equal(guideSaveRes.body._id);
                (guideUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Guides if not signed in', function (done) {
    // Create new Guide model instance
    var guideObj = new Guide(guide);

    // Save the guide
    guideObj.save(function () {
      // Request Guides
      request(app).get('/api/guides')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Guide if not signed in', function (done) {
    // Create new Guide model instance
    var guideObj = new Guide(guide);

    // Save the Guide
    guideObj.save(function () {
      request(app).get('/api/guides/' + guideObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', guide.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Guide with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/guides/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Guide is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Guide which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Guide
    request(app).get('/api/guides/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Guide with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Guide if signed in', function (done) {
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

        // Save a new Guide
        agent.post('/api/guides')
          .send(guide)
          .expect(200)
          .end(function (guideSaveErr, guideSaveRes) {
            // Handle Guide save error
            if (guideSaveErr) {
              return done(guideSaveErr);
            }

            // Delete an existing Guide
            agent.delete('/api/guides/' + guideSaveRes.body._id)
              .send(guide)
              .expect(200)
              .end(function (guideDeleteErr, guideDeleteRes) {
                // Handle guide error error
                if (guideDeleteErr) {
                  return done(guideDeleteErr);
                }

                // Set assertions
                (guideDeleteRes.body._id).should.equal(guideSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Guide if not signed in', function (done) {
    // Set Guide user
    guide.user = user;

    // Create new Guide model instance
    var guideObj = new Guide(guide);

    // Save the Guide
    guideObj.save(function () {
      // Try deleting Guide
      request(app).delete('/api/guides/' + guideObj._id)
        .expect(403)
        .end(function (guideDeleteErr, guideDeleteRes) {
          // Set message assertion
          (guideDeleteRes.body.message).should.match('User is not authorized');

          // Handle Guide error error
          done(guideDeleteErr);
        });

    });
  });

  it('should be able to get a single Guide that has an orphaned user reference', function (done) {
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

          // Save a new Guide
          agent.post('/api/guides')
            .send(guide)
            .expect(200)
            .end(function (guideSaveErr, guideSaveRes) {
              // Handle Guide save error
              if (guideSaveErr) {
                return done(guideSaveErr);
              }

              // Set assertions on new Guide
              (guideSaveRes.body.name).should.equal(guide.name);
              should.exist(guideSaveRes.body.user);
              should.equal(guideSaveRes.body.user._id, orphanId);

              // force the Guide to have an orphaned user reference
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

                    // Get the Guide
                    agent.get('/api/guides/' + guideSaveRes.body._id)
                      .expect(200)
                      .end(function (guideInfoErr, guideInfoRes) {
                        // Handle Guide error
                        if (guideInfoErr) {
                          return done(guideInfoErr);
                        }

                        // Set assertions
                        (guideInfoRes.body._id).should.equal(guideSaveRes.body._id);
                        (guideInfoRes.body.name).should.equal(guide.name);
                        should.equal(guideInfoRes.body.user, undefined);

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
      Guide.remove().exec(done);
    });
  });
});
