const app = require('./config/express');
const config = require('./config/config')
//const Razorpay = require('razorpay')
// initialize mongo
require('./config/mongoose');

// listen to the port 
app.listen(config.port, () => {
    console.log(`listening on port ${config.port} (${config.env})`);
});

