import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../server.js'  
import jwtAuth from '../../middlewares/chekAuth.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('JWT Authentication Middleware Tests', () => {
  // Helper function to generate a valid JWT token for testing
  const generateValidToken = () => {
    const payload = { userId: 'user123', role: 'user' };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  };

  it('should return "Unauthorized - Token missing" for a request without a token', (done) => {
    chai
      .request(app)
      .get('/api/retrieve-notes')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message').equal('Unauthorized - Token missing');
        done();
      });
  });

  it('should return "Unauthorized - Invalid token" for a request with an invalid token', (done) => {
    chai
      .request(app)
      .get('/api/retrieve-notes')
      .set('Authorization', 'InvalidToken')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message').equal('Unauthorized - Invalid token');
        done();
      });
  });

  it('should return "Unauthorized - Token expired" for a request with an expired token', (done) => {
    const expiredToken = jwt.sign({ userId: 'user123', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '-1s' });

    chai
      .request(app)
      .get('/api/retrieve-notes')
      .set('Authorization', expiredToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message').equal('Unauthorized - Token expired');
        done();
      });
  });

  it('should attach the decoded user information to the request for a valid token', (done) => {
    // Generate a valid token for testing
    const validToken = generateValidToken();

    // Set up a route that uses the jwtAuth middleware
    app.get('/api/protected-route', jwtAuth, (req, res) => {
      // Respond with user information attached by the middleware
      res.json({ user: req.user });
    });

    // Make a request with the valid token
    chai
      .request(app)
      .get('/api/protected-route')
      .set('Authorization', `${validToken}`)
      .end((err, res) => {
        // Check if the response is as expected
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('userId').equal('user123'); // Adjust based on your actual user object

        done();
      });
  });
  
});
