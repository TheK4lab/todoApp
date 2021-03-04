const mongoose = require('mongoose');
const { connectionURL } = require('../utils/config');

(async () => {
    try {
        await mongoose.connect(connectionURL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("CONNECTED TO THE DATABASE");
    } catch (error) {
        console.log(error);
        throw error;
    }
}) ();
