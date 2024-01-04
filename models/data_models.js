import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // validation logic for title length
                return value.length > 1 && value.length <= 50;
            },
            message: props => `${props.value} is not a valid title. Title must be between 1 and 50 characters.`
        }
    },
    content: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // validation logic for content length
                return value.length > 1 && value.length <= 280;
            },
            message: props => `${props.value} is not a valid content. Content must be between 1 and 280 characters.`
        }
    }
}, {
    timestamps: true
});

export default mongoose.model('data', DataSchema);
