'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  itune;

/**
 * Article routes tests
 */
describe('Article CRUD tests', function () {

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

    // Save a user to the test db and create new itune
    user.save(function () {
      itune = {
        title: 'Article Title',
        content: 'Article Content'
      };

      done();
    });
  });

  it('should be able to save an itune if logged in', function (done) {
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

        // Save a new itune
        agent.post('/api/itunes')
          .send(itune)
          .expect(200)
          .end(function (ituneSaveErr, ituneSaveRes) {
            // Handle itune save error
            if (ituneSaveErr) {
              return done(ituneSaveErr);
            }

            // Get a list of itunes
            agent.get('/api/itunes')
              .end(function (itunesGetErr, itunesGetRes) {
                // Handle itune save error
                if (itunesGetErr) {
                  return done(itunesGetErr);
                }

                // Get itunes list
                var itunes = itunesGetRes.body;

                // Set assertions
                (itunes[0].user._id).should.equal(userId);
                (itunes[0].title).should.match('Article Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an itune if not logged in', function (done) {
    agent.post('/api/itunes')
      .send(itune)
      .expect(403)
      .end(function (ituneSaveErr, ituneSaveRes) {
        // Call the assertion callback
        done(ituneSaveErr);
      });
  });

  it('should not be able to save an itune if no title is provided', function (done) {
    // Invalidate title field
    itune.title = '';

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

        // Save a new itune
        agent.post('/api/itunes')
          .send(itune)
          .expect(400)
          .end(function (ituneSaveErr, ituneSaveRes) {
            // Set message assertion
            (ituneSaveRes.body.message).should.match('Title cannot be blank');

            // Handle itune save error
            done(ituneSaveErr);
          });
      });
  });

  it('should be able to update an itune if signed in', function (done) {
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

        // Save a new itune
        agent.post('/api/itunes')
          .send(itune)
          .expect(200)
          .end(function (ituneSaveErr, ituneSaveRes) {
            // Handle itune save error
            if (ituneSaveErr) {
              return done(ituneSaveErr);
            }

            // Update itune title
            itune.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing itune
            agent.put('/api/itunes/' + ituneSaveRes.body._id)
              .send(itune)
              .expect(200)
              .end(function (ituneUpdateErr, ituneUpdateRes) {
                // Handle itune update error
                if (ituneUpdateErr) {
                  return done(ituneUpdateErr);
                }

                // Set assertions
                (ituneUpdateRes.body._id).should.equal(ituneSaveRes.body._id);
                (ituneUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of itunes if not signed in', function (done) {
    // Create new itune model instance
    var ituneObj = new Article(itune);

    // Save the itune
    ituneObj.save(function () {
      // Request itunes
      request(app).get('/api/itunes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single itune if not signed in', function (done) {
    // Create new itune model instance
    var ituneObj = new Article(itune);

    // Save the itune
    ituneObj.save(function () {
      request(app).get('/api/itunes/' + ituneObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', itune.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single itune with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/itunes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Article is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single itune which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent itune
    request(app).get('/api/itunes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No itune with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an itune if signed in', function (done) {
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

        // Save a new itune
        agent.post('/api/itunes')
          .send(itune)
          .expect(200)
          .end(function (ituneSaveErr, ituneSaveRes) {
            // Handle itune save error
            if (ituneSaveErr) {
              return done(ituneSaveErr);
            }

            // Delete an existing itune
            agent.delete('/api/itunes/' + ituneSaveRes.body._id)
              .send(itune)
              .expect(200)
              .end(function (ituneDeleteErr, ituneDeleteRes) {
                // Handle itune error error
                if (ituneDeleteErr) {
                  return done(ituneDeleteErr);
                }

                // Set assertions
                (ituneDeleteRes.body._id).should.equal(ituneSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an itune if not signed in', function (done) {
    // Set itune user
    itune.user = user;

    // Create new itune model instance
    var ituneObj = new Article(itune);

    // Save the itune
    ituneObj.save(function () {
      // Try deleting itune
      request(app).delete('/api/itunes/' + ituneObj._id)
        .expect(403)
        .end(function (ituneDeleteErr, ituneDeleteRes) {
          // Set message assertion
          (ituneDeleteRes.body.message).should.match('User is not authorized');

          // Handle itune error error
          done(ituneDeleteErr);
        });

    });
  });

  it('should be able to get a single itune that has an orphaned user reference', function (done) {
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

          // Save a new itune
          agent.post('/api/itunes')
            .send(itune)
            .expect(200)
            .end(function (ituneSaveErr, ituneSaveRes) {
              // Handle itune save error
              if (ituneSaveErr) {
                return done(ituneSaveErr);
              }

              // Set assertions on new itune
              (ituneSaveRes.body.title).should.equal(itune.title);
              should.exist(ituneSaveRes.body.user);
              should.equal(ituneSaveRes.body.user._id, orphanId);

              // force the itune to have an orphaned user reference
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

                    // Get the itune
                    agent.get('/api/itunes/' + ituneSaveRes.body._id)
                      .expect(200)
                      .end(function (ituneInfoErr, ituneInfoRes) {
                        // Handle itune error
                        if (ituneInfoErr) {
                          return done(ituneInfoErr);
                        }

                        // Set assertions
                        (ituneInfoRes.body._id).should.equal(ituneSaveRes.body._id);
                        (ituneInfoRes.body.title).should.equal(itune.title);
                        should.equal(ituneInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single itune if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new itune model instance
    itune.user = user;
    var ituneObj = new Article(itune);

    // Save the itune
    ituneObj.save(function () {
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

          // Save a new itune
          agent.post('/api/itunes')
            .send(itune)
            .expect(200)
            .end(function (ituneSaveErr, ituneSaveRes) {
              // Handle itune save error
              if (ituneSaveErr) {
                return done(ituneSaveErr);
              }

              // Get the itune
              agent.get('/api/itunes/' + ituneSaveRes.body._id)
                .expect(200)
                .end(function (ituneInfoErr, ituneInfoRes) {
                  // Handle itune error
                  if (ituneInfoErr) {
                    return done(ituneInfoErr);
                  }

                  // Set assertions
                  (ituneInfoRes.body._id).should.equal(ituneSaveRes.body._id);
                  (ituneInfoRes.body.title).should.equal(itune.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (ituneInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single itune if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new itune model instance
    var ituneObj = new Article(itune);

    // Save the itune
    ituneObj.save(function () {
      request(app).get('/api/itunes/' + ituneObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', itune.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single itune, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Article
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new itune
          agent.post('/api/itunes')
            .send(itune)
            .expect(200)
            .end(function (ituneSaveErr, ituneSaveRes) {
              // Handle itune save error
              if (ituneSaveErr) {
                return done(ituneSaveErr);
              }

              // Set assertions on new itune
              (ituneSaveRes.body.title).should.equal(itune.title);
              should.exist(ituneSaveRes.body.user);
              should.equal(ituneSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the itune
                  agent.get('/api/itunes/' + ituneSaveRes.body._id)
                    .expect(200)
                    .end(function (ituneInfoErr, ituneInfoRes) {
                      // Handle itune error
                      if (ituneInfoErr) {
                        return done(ituneInfoErr);
                      }

                      // Set assertions
                      (ituneInfoRes.body._id).should.equal(ituneSaveRes.body._id);
                      (ituneInfoRes.body.title).should.equal(itune.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (ituneInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Article.remove().exec(done);
    });
  });
});
