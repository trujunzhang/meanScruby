'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Crawler = mongoose.model('Crawler'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  crawler;

/**
 * Crawler routes tests
 */
describe('Crawler CRUD tests', function () {

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

    // Save a user to the test db and create new crawler
    user.save(function () {
      crawler = {
        title: 'Crawler Title',
        content: 'Crawler Content'
      };

      done();
    });
  });

  it('should be able to save an crawler if logged in', function (done) {
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

        // Save a new crawler
        agent.post('/api/crawlers')
          .send(crawler)
          .expect(200)
          .end(function (crawlerSaveErr, crawlerSaveRes) {
            // Handle crawler save error
            if (crawlerSaveErr) {
              return done(crawlerSaveErr);
            }

            // Get a list of crawlers
            agent.get('/api/crawlers')
              .end(function (crawlersGetErr, crawlersGetRes) {
                // Handle crawler save error
                if (crawlersGetErr) {
                  return done(crawlersGetErr);
                }

                // Get crawlers list
                var crawlers = crawlersGetRes.body;

                // Set assertions
                (crawlers[0].user._id).should.equal(userId);
                (crawlers[0].title).should.match('Crawler Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an crawler if not logged in', function (done) {
    agent.post('/api/crawlers')
      .send(crawler)
      .expect(403)
      .end(function (crawlerSaveErr, crawlerSaveRes) {
        // Call the assertion callback
        done(crawlerSaveErr);
      });
  });

  it('should not be able to save an crawler if no title is provided', function (done) {
    // Invalidate title field
    crawler.title = '';

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

        // Save a new crawler
        agent.post('/api/crawlers')
          .send(crawler)
          .expect(400)
          .end(function (crawlerSaveErr, crawlerSaveRes) {
            // Set message assertion
            (crawlerSaveRes.body.message).should.match('Title cannot be blank');

            // Handle crawler save error
            done(crawlerSaveErr);
          });
      });
  });

  it('should be able to update an crawler if signed in', function (done) {
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

        // Save a new crawler
        agent.post('/api/crawlers')
          .send(crawler)
          .expect(200)
          .end(function (crawlerSaveErr, crawlerSaveRes) {
            // Handle crawler save error
            if (crawlerSaveErr) {
              return done(crawlerSaveErr);
            }

            // Update crawler title
            crawler.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing crawler
            agent.put('/api/crawlers/' + crawlerSaveRes.body._id)
              .send(crawler)
              .expect(200)
              .end(function (crawlerUpdateErr, crawlerUpdateRes) {
                // Handle crawler update error
                if (crawlerUpdateErr) {
                  return done(crawlerUpdateErr);
                }

                // Set assertions
                (crawlerUpdateRes.body._id).should.equal(crawlerSaveRes.body._id);
                (crawlerUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of crawlers if not signed in', function (done) {
    // Create new crawler model instance
    var crawlerObj = new Crawler(crawler);

    // Save the crawler
    crawlerObj.save(function () {
      // Request crawlers
      request(app).get('/api/crawlers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single crawler if not signed in', function (done) {
    // Create new crawler model instance
    var crawlerObj = new Crawler(crawler);

    // Save the crawler
    crawlerObj.save(function () {
      request(app).get('/api/crawlers/' + crawlerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', crawler.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single crawler with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/crawlers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Crawler is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single crawler which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent crawler
    request(app).get('/api/crawlers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No crawler with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an crawler if signed in', function (done) {
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

        // Save a new crawler
        agent.post('/api/crawlers')
          .send(crawler)
          .expect(200)
          .end(function (crawlerSaveErr, crawlerSaveRes) {
            // Handle crawler save error
            if (crawlerSaveErr) {
              return done(crawlerSaveErr);
            }

            // Delete an existing crawler
            agent.delete('/api/crawlers/' + crawlerSaveRes.body._id)
              .send(crawler)
              .expect(200)
              .end(function (crawlerDeleteErr, crawlerDeleteRes) {
                // Handle crawler error error
                if (crawlerDeleteErr) {
                  return done(crawlerDeleteErr);
                }

                // Set assertions
                (crawlerDeleteRes.body._id).should.equal(crawlerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an crawler if not signed in', function (done) {
    // Set crawler user
    crawler.user = user;

    // Create new crawler model instance
    var crawlerObj = new Crawler(crawler);

    // Save the crawler
    crawlerObj.save(function () {
      // Try deleting crawler
      request(app).delete('/api/crawlers/' + crawlerObj._id)
        .expect(403)
        .end(function (crawlerDeleteErr, crawlerDeleteRes) {
          // Set message assertion
          (crawlerDeleteRes.body.message).should.match('User is not authorized');

          // Handle crawler error error
          done(crawlerDeleteErr);
        });

    });
  });

  it('should be able to get a single crawler that has an orphaned user reference', function (done) {
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

          // Save a new crawler
          agent.post('/api/crawlers')
            .send(crawler)
            .expect(200)
            .end(function (crawlerSaveErr, crawlerSaveRes) {
              // Handle crawler save error
              if (crawlerSaveErr) {
                return done(crawlerSaveErr);
              }

              // Set assertions on new crawler
              (crawlerSaveRes.body.title).should.equal(crawler.title);
              should.exist(crawlerSaveRes.body.user);
              should.equal(crawlerSaveRes.body.user._id, orphanId);

              // force the crawler to have an orphaned user reference
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

                    // Get the crawler
                    agent.get('/api/crawlers/' + crawlerSaveRes.body._id)
                      .expect(200)
                      .end(function (crawlerInfoErr, crawlerInfoRes) {
                        // Handle crawler error
                        if (crawlerInfoErr) {
                          return done(crawlerInfoErr);
                        }

                        // Set assertions
                        (crawlerInfoRes.body._id).should.equal(crawlerSaveRes.body._id);
                        (crawlerInfoRes.body.title).should.equal(crawler.title);
                        should.equal(crawlerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single crawler if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new crawler model instance
    crawler.user = user;
    var crawlerObj = new Crawler(crawler);

    // Save the crawler
    crawlerObj.save(function () {
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

          // Save a new crawler
          agent.post('/api/crawlers')
            .send(crawler)
            .expect(200)
            .end(function (crawlerSaveErr, crawlerSaveRes) {
              // Handle crawler save error
              if (crawlerSaveErr) {
                return done(crawlerSaveErr);
              }

              // Get the crawler
              agent.get('/api/crawlers/' + crawlerSaveRes.body._id)
                .expect(200)
                .end(function (crawlerInfoErr, crawlerInfoRes) {
                  // Handle crawler error
                  if (crawlerInfoErr) {
                    return done(crawlerInfoErr);
                  }

                  // Set assertions
                  (crawlerInfoRes.body._id).should.equal(crawlerSaveRes.body._id);
                  (crawlerInfoRes.body.title).should.equal(crawler.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (crawlerInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single crawler if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new crawler model instance
    var crawlerObj = new Crawler(crawler);

    // Save the crawler
    crawlerObj.save(function () {
      request(app).get('/api/crawlers/' + crawlerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', crawler.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single crawler, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Crawler
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

          // Save a new crawler
          agent.post('/api/crawlers')
            .send(crawler)
            .expect(200)
            .end(function (crawlerSaveErr, crawlerSaveRes) {
              // Handle crawler save error
              if (crawlerSaveErr) {
                return done(crawlerSaveErr);
              }

              // Set assertions on new crawler
              (crawlerSaveRes.body.title).should.equal(crawler.title);
              should.exist(crawlerSaveRes.body.user);
              should.equal(crawlerSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the crawler
                  agent.get('/api/crawlers/' + crawlerSaveRes.body._id)
                    .expect(200)
                    .end(function (crawlerInfoErr, crawlerInfoRes) {
                      // Handle crawler error
                      if (crawlerInfoErr) {
                        return done(crawlerInfoErr);
                      }

                      // Set assertions
                      (crawlerInfoRes.body._id).should.equal(crawlerSaveRes.body._id);
                      (crawlerInfoRes.body.title).should.equal(crawler.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (crawlerInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Crawler.remove().exec(done);
    });
  });
});
