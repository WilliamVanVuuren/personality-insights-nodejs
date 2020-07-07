'use strict';

// Imports /////////////////////////////////////////////////////////////////////

// Third Party
const Cloudant = require('@cloudant/cloudant');
//const config = require('config');

// UUID creation
const uuidv4 = require('uuid/v4');

// Local
const { log } = require('./logger');

const path = require('path');
// load default variables for testing
require('dotenv').config({ path: path.join(__dirname, '../.env') });

if (!process.env.DATABASE_IAM_APIKEY) {
  return;
} else{
	var iamApiKey = process.env.DATABASE_IAM_APIKEY
	console.log("******** db key: " + iamApiKey)
}
if (!process.env.DATABASE_IAM_USERNAME) {
  return;
} else{
	var account = process.env.DATABASE_IAM_USERNAME
	console.log("******** db account: " + account)
}
if (!process.env.DATABASE_NAME) {
  return;
} else{
	var dbName = process.env.DATABASE_NAME
	console.log("******** db DATABASE_NAME: " + dbName)
}
console.log("****   Loading db from config ...")

// Implementation //////////////////////////////////////////////////////////////

class UsageDB {

  constructor() {
    this.client = new Cloudant({
      //account: config.get('database.iam_username'),
      account: account,
      plugins: {
        iamauth: {
          //iamApiKey: config.get('database.iam_apikey'),
          iamApiKey: iamApiKey,
        },
      },
    });

    // Hang onto a promise that functions can await to ensure that the db exists
    //this.dbName = config.get('database.db_name');
    this.dbName = dbName;
    this.dbReady = new Promise((resolve, reject) => {
      this.client.db.list((err, res) => {
        if (err) {
          reject(err);
        } else if (res.includes(this.dbName)) {
          resolve();
        } else {
          this.client.db.create(this.dbName).then(() => {
            resolve();
          }).catch((err) => {
            reject(err);
          });
        }
      });
    });
  }

  //async addUsage(userName, channelName, textLength) {
  async addUsage(userID, ageGroup, location, profile) {
    console.log("adding profile ***************")
    //log.debug(`Adding usage for ${userName} in channel ${channelName}`);
	log.debug(`Adding profile for ${userID}`);
	
    // Make sure the database is ready
    await this.dbReady;

    // Index the record by the username
    //const recordId = userName;
    const recordId = userID;
    const status = "active";   //??? const or var

    // Look up to see if this user has an existing record
    let queryResults;
    try {
      queryResults = await new Promise((resolve, reject) => {
        const query = {
          selector: {
            _id: recordId,
          },
          limit: 1,
        };
        log.debug(`Full Query: ${JSON.stringify(query, null, 2)}`);
        this.client.db.use(this.dbName).find(query, (err, results) => {
          if (err) { reject(err); } else { resolve(results); }
        });
      });
    } catch (err) {
      log.error(`Failed to retrieve results from database: ${err.message}`);
      return Promise.reject(err);
    }

    // If there is no record yet, default to an empty list, otherwise add to the
    // existing one
    let record = {
      requests: [],
    };
    if (queryResults.docs.length > 0) {
      record = queryResults.docs[0];
    }
    if (!record.requests) {
      //log.warning(`Missing "requests" key in record for ${recordId}`);
      log.error(`Missing "requests" key in record for ${recordId}`);
      record.requests = [];
    }
    
	
	console.log("writing  profile ***************")
	let itemId = uuidv4();
	
	
    // Add this request to the record
    record.requests.push({
      //user_name: userName,
      //channel_name: channelName,
      //text_length: textLength,
      _id: itemId,
      id: itemId,
      profile: profile,
      status: status,
      user_id: userID,
      ageGroup: ageGroup,
      location: location,
      date: new Date(),
    });
    
    
  	let whenCreated = Date.now();
    let item = {
            //_id: itemId,
            //id: itemId,
            _id: userID,
            id: userID,
           	profile: profile,
      		status: status,
      		user_id: userID,
      		ageGroup: ageGroup,
      		location: location,
            whenCreated: whenCreated
        };

    // Put the user's records into the database
    //return this.client.db.use(this.dbName).insert(record, recordId);
    return this.client.db.use(this.dbName).insert(item, recordId);
  }
}



/*
class DisabledDB {
  addUsage(userName, channelName, textLength) {
    return Promise.resolve();
  }
}
*/

// Exports /////////////////////////////////////////////////////////////////////

 module.exports.db = new UsageDB();
 
/*
if (config.get('database.enabled')) {
  console.log("**** Running with usage logging ENABLED")
  console.log("with db: " + config.get('database.db_name') )
  log.info('Running with usage logging ENABLED');
  
  module.exports.db = new UsageDB();
  
  
} else {
  log.info('Running with usage logging DISABLED');
  module.exports.db = new DisabledDB();
}
*/
