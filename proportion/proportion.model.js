let proportionSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    calories: {
        type: Number,
        required: true,
        trim: true
    },
    protein: {
        type: Number,
        required: true,
        trim: true
    },
    carbohydrates: {
        type: Number,
        required: true,
        trim: true
    },
    fats: {
        type: Number,
        required: true,
        trim: true
    }
});

module.exports.Proportion = mongoose.model('proportion', proportionSchema);