const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const workspaceRoute = require('./routes/workspace');
const invitationRoute = require('./routes/invitations');
const presentationRoute = require('./routes/presentations');
const imagesRoute = require('./routes/images');

// Route Middlewares
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/workspaces', workspaceRoute);
app.use('/api/invitations', invitationRoute);
app.use('/api/presentations', presentationRoute);
app.use('/api/images', imagesRoute);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

mongoose.connect("mongodb+srv://vandralcapital:vandral@vandralthesis.obe1m2e.mongodb.net/?retryWrites=true&w=majority&appName=VandralThesis")
  .then(() => console.log('MongoDB database connection established successfully'))
  .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}); 