import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../server.js'; 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Data Routes', () => {

  // Helper function to generate a valid JWT token for testing
  const generateValidToken = () => {
    const payload = { userId: 'user123', role: 'user' };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  };  
  let noteId;

  it('should create a new note on POST /create-note', (done) => {
    const validInput = {
      title: 'Test Note',
      content: 'This is a test note content.'
    };

    const validToken = generateValidToken();

    chai
      .request(app)
      .post('/api/create-note')
      .set('Authorization', `${validToken}`)
      .send(validInput)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message').equal('Note added successfully');
        expect(res.body).to.have.property('note');
        noteId = res.body.note._id;
        done();
      });
  });

  it('should retrieve notes on GET /retrieve-notes', (done) => {

    const validToken = generateValidToken();

    chai
      .request(app)
      .get('/api/retrieve-notes')
      .set('Authorization', `${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('Notes retrieved successfully');
        expect(res.body).to.have.property('notes');
        done();
      });
  });

  it('should retrieve a specific note on GET /retrieve-note/:id', (done) => {

    const validToken = generateValidToken();

    chai
      .request(app)
      .get(`/api/retrieve-note/${noteId}`)
      .set('Authorization', `${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('Note retrieved successfully');
        expect(res.body).to.have.property('note');
        done();
      });
  });

  it('should update a specific note on PUT /update-note/:id', (done) => {
    const updatedData = {
      title: 'Updated Test Note',
      content: 'This is the updated content.'
    };
    const validToken = generateValidToken();

    chai
      .request(app)
      .put(`/api/update-note/${noteId}`)
      .set('Authorization', `${validToken}`)
      .send(updatedData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('Note updated successfully');
        expect(res.body).to.have.property('note');
        done();
      });
  });

  it('should delete a specific note on DELETE /delete-note/:id', (done) => {
    const validToken = generateValidToken();

    chai
      .request(app)
      .delete(`/api/delete-note/${noteId}`)
      .set('Authorization', `${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('Note deleted successfully');
        done();
      });
  });

});
