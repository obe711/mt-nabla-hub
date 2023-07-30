const jwt = require('jsonwebtoken');
const http2 = require('http2');
const fs = require('node:fs');
const path = require('node:path');
const config = require('../config/config');
const { userService } = require("./")

function createApnAuthToken() {
  const key = fs.readFileSync(path.join(process.cwd(), '.keys', config.oauth.apple.key_filename));

  //"iat" should not be older than 1 hr from current time or will get rejected
  const token = jwt.sign(
    {
      // iss: "{your team ID}", //"team ID" of your developer account
      // iat: Replace with current unix epoch time [Not in millisecondsD]
      iss: config.oauth.apple.teamId,
      iat: Math.floor(Date.now() / 1000),
    },
    key,
    {
      header: {
        alg: "ES256",
        kid: config.oauth.apple.keyId, //issuer key which is "key ID" of your p8 file
      }
    }
  )

  return token;
}

const host = 'https://api.sandbox.push.apple.com' //  "https://api.push.apple.com"
const devpath = '/3/device/d3061cdf61866dfdf46cf89938c8682e4044e0bf235b7c6df8a43b9f5077e04f'

function sendPushNotification() {
  const token = createApnAuthToken();
  const client = http2.connect(host);

  client.on('error', (err) => console.error(err));

  // const body = { "aps": { "alert": { "title": "title", "subtitle": "subtitle", "body": "body" } } }
  const body = {
    "aps": {
      "badge": 20,
      "sound": "bingbong.aiff",
      "alert": { "title": "title", "subtitle": "subtitle", "body": "body" }
    },
    "messageID": "ABCDEFGHIJ"
  }


  const headers = {
    ':method': 'POST',
    'apns-topic': config.oauth.apple.client_id, //your application bundle ID
    ':scheme': 'https',
    ':path': devpath,
    'authorization': `bearer ${token}`
  }

  const request = client.request(headers);

  request.on('response', (headers, flags) => {
    for (const name in headers) {
      console.log(`${name}: ${headers[name]}`);
    }
  });

  request.setEncoding('utf8');
  let data = ''
  request.on('data', (chunk) => { data += chunk; });
  request.write(JSON.stringify(body))
  request.on('end', () => {
    console.log(`\n${data}`);
    client.close();
  });
  request.end();
}

const sendBadgeCount = (apnToken, count, targetId) => {
  const token = createApnAuthToken();
  const client = http2.connect(host);

  const body = {
    "aps": {
      "badge": count,
      "sound": "bingbong.aiff",
      "alert": { "title": "Portal Error", "subtitle": "Missing MAC", "body": targetId },
    },

  }

  const headers = {
    ':method': 'POST',
    'apns-topic': config.oauth.apple.client_id, //your application bundle ID
    ':scheme': 'https',
    ':path': `/3/device/${apnToken}`,
    'authorization': `bearer ${token}`
  }

  const request = client.request(headers);

  request.on('response', (headers, flags) => {
    for (const name in headers) {
      console.log(`${name}: ${headers[name]}`);
    }
  });

  request.setEncoding('utf8');
  let data = ''
  request.on('data', (chunk) => { data += chunk; });
  request.write(JSON.stringify(body))
  request.on('end', () => {
    console.log(`\n${data}`);
    client.close();
  });
  request.end();
}
const sendErrorCountToAdmins = async (count, targetID) => {
  const userAdmins = await userService.getAllAdmins();
  if (!userAdmins) return;

  userAdmins.forEach(user => {
    sendBadgeCount(user.apn, count, targetID);
  });
}


module.exports = {
  sendPushNotification,
  sendErrorCountToAdmins
};

