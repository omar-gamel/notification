const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const bodyParser = require('body-parser');
const config = require('config');
const port = process.env.PORT || config.get('port');
const cors = require('cors');

const jwtAuth = require('./passport');
const notificationRoutes = require('./routes/notifcation');
const userRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(jwtAuth.initialize()); 

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Deepstream Connecter
var Deepstream = require( 'deepstream.io' ),
    MongoDBStorageConnector = require( 'deepstream.io-storage-mongodb' ),
    server = new Deepstream();

server.set( 'storage', new MongoDBStorageConnector( {
  connectionString: config.get('mongoUrl'),
}));

server.start();

app.use('/notification', notificationRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(error.statusCode || 500).json({ message: error.message, data: error.data });
});

mongoose
  .connect(config.get('mongoUrl'), {'useNewUrlParser': true})
  .then(result => {
    app.listen(port);
    console.log('Connected to MongoDB...')
  })
  .catch(err => {
    console.log(err);
  });

mongoose.plugin(mongoose_delete, { overrideMethods: true });  


