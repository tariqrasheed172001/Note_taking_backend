import { describe, it } from 'mocha';
import chai from 'chai';
import mongoose from 'mongoose';
import DataModel from '../../models/data_models.js'; 

chai.should();

describe('Data Model Tests', () => {
  before(async () => {
    // Connect to the MongoDB test database or use a test database setup
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  it('should create a new note with valid title and content', async () => {
    const validData = {
      title: 'Valid Title',
      content: 'This is valid content within the length limits.',
    };

    const note = await DataModel.create(validData);

    note.should.have.property('title', validData.title);
    note.should.have.property('content', validData.content);
  });

  it('should fail to create a note with an invalid title length', async () => {
    const invalidData = {
      title: 'A', // Too short
      content: 'Valid content within the length limits.',
    };

    try {
      await DataModel.create(invalidData);
      // The code should not reach here; an error should be thrown
      chai.assert.fail('Expected error not thrown');
    } catch (error) {
      error.should.have.property('name', 'ValidationError');
      error.errors.title.should.have.property('message', 'A is not a valid title. Title must be between 1 and 50 characters.');
    }
  });

  it('should fail to create a note with an invalid content length', async () => {
    const invalidData = {
      title: 'Valid Title',
      content: 'A', // Too short
    };

    try {
      await DataModel.create(invalidData);
      // The code should not reach here; an error should be thrown
      chai.assert.fail('Expected error not thrown');
    } catch (error) {
      error.should.have.property('name', 'ValidationError');
      error.errors.content.should.have.property('message', 'A is not a valid content. Content must be between 1 and 280 characters.');
    }
  });
  
});
