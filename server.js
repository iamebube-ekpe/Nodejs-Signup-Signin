//  Mongodb
require('./config/db')


const app = require('express')();
const port = 3000;

const userRouter = require('./api/user');

// Accepting data from forms
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', userRouter);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}...`);
});