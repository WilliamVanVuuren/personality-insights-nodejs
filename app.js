/**
 * Copyright 2015-2020 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const app = express();



// Bootstrap application settings
require('./config/express')(app);

// Add routes to app
require('./router')(app);

// error-handler settings
require('./config/error-handler')(app);

// logger
const { log } = require('./config/logger');

// db
//const { db } = require('./config/db');

/*

app.post('/upload', function (req, res) {
       console.log(req.body);
       console.log(req.body.user);
       console.log(req.body.userID);
       console.log(req.body.profile);
});
*/

//const Cloudant = require('@cloudant/cloudant');
//const config = require('config');

module.exports = app;
