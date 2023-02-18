const express = require('express');
const env = require('./config/environment');
const app = express();
const port = 3002;
const logger = require('morgan');
const db = require('./config/mongoose');
// const handlebars = require('handlebars');
let hbs = require('express-handlebars');
var cors = require('cors');

 hbs = hbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        math: function(lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        }
    }
});

app.use(cors({origin: true, credentials: true}));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

console.log('env', env);
console.log('line2');
app.use(logger(env.morgan.mode, env.morgan.options));
console.log('line3');
app.use('/', require('./routes/index'));
console.log('line4');

app.set('view engine', 'handlebars');
app.engine('handlebars', hbs.engine);
  

app.listen(port,function(err){
    if(err){
        console.log(`******Error in running server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});

