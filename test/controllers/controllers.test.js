import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../../server.js';
import dataModel from '../../models/data_models.js'; // Assuming the correct path

chai.use(chaiHttp);
const expect = chai.expect;

// Helper function to generate a valid JWT token for testing
const generateValidToken = () => {
    const payload = { userId: 'user123', role: 'user' };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  };

// Test Data
let testNoteId;
const validToken = generateValidToken();

describe('Data Controllers tests', () => {
  // Connect to the MongoDB database before running tests
  before(async () => {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Test CreateNote
  describe('CreateNote', () => {
    it('should create a new note on POST /create-note', (done) => {
      const validInput = {
        title: 'Test Note',
        content: 'This is a test note content.',
      };

      chai
        .request(app)
        .post('/api/create-note')
        .set('Authorization', `${validToken}`)
        .send(validInput)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').equal('Note added successfully');
          expect(res.body).to.have.property('note');
          testNoteId = res.body.note._id; 
          done();
        });
    });

    it('should return an error for invalid input on POST /create-note', (done) => {
      const invalidInput = {
        content: 'This is an invalid note content.',
      };

      chai
        .request(app)
        .post('/api/create-note')
        .set('Authorization', `${validToken}`)
        .send(invalidInput)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').equal('Title and content are required fields');
          done();
        });
    });
  });

  // Test RetrieveNotes
  describe('RetrieveNotes', () => {
    it('should retrieve notes on GET /retrieve-notes', (done) => {
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
  });

  // Test RetrieveNote
  describe('RetrieveNote', () => {
    it('should retrieve a specific note on GET /retrieve-note/:id', (done) => {
      chai
        .request(app) 
        .get(`/api/retrieve-note/${testNoteId}`)
        .set('Authorization', `${validToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').equal('Note retrieved successfully');
          expect(res.body).to.have.property('note');
          done();
        });
    });

    it('should return an error for an invalid note ID on GET /retrieve-note/:id', (done) => {
      const invalidNoteId = 'invalidId';

      chai
        .request(app) 
        .get(`/api/retrieve-note/${invalidNoteId}`)
        .set('Authorization', `${validToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').equal('Invalid note ID format');
          done();
        });
    });
  });

  // Test UpdateNote
  describe('UpdateNote', () => {
    it('should update a specific note on PUT /update-note/:id', (done) => {
      const updatedData = {
        title: 'Updated Test Note',
        content: 'This is the updated content.',
      };

      chai
        .request(app)
        .put(`/api/update-note/${testNoteId}`)
        .set('Authorization', `${validToken}`)
        .send(updatedData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').equal('Note updated successfully');
          expect(res.body).to.have.property('note');
          done();
        });
    });

    it('should return an error for no title or content on PUT /update-note/:id', (done) => {
      const updatedData = {};

      chai
        .request(app)
        .put(`/api/update-note/${testNoteId}`)
        .set('Authorization', `${validToken}`)
        .send(updatedData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').equal('Title or content is required for the update');
          done();
        });
    });

  });

  // Test DeleteNote
  describe('DeleteNote', () => {
    it('should delete a specific note on DELETE /delete-note/:id', (done) => {
      chai
        .request(app)
        .delete(`/api/delete-note/${testNoteId}`)
        .set('Authorization', `${validToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').equal('Note deleted successfully');
          expect(res.body).to.have.property('note');
          done();
        });
    });

    it('should return an error for an invalid note ID on DELETE /delete-note/:id', (done) => {
      const invalidNoteId = 'invalidId';

      chai
        .request(app)
        .delete(`/api/delete-note/${invalidNoteId}`)
        .set('Authorization', `${validToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').equal('Invalid note ID format');
          done();
        });
    });
  });
});
