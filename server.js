const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const crypto = require('crypto');
const EventHubReader = require('./scripts/event-hub-reader.js');

var generateSasToken = function(resourceUri, signingKey, policyName, expiresInMins) {
  resourceUri = encodeURIComponent(resourceUri);
  
  // Set expiration in seconds
  var expires = (Date.now() / 1000) + expiresInMins * 60;
  expires = Math.ceil(expires);
  var toSign = resourceUri + '\n' + expires;

  // Use crypto
  var hmac = crypto.createHmac('sha256', Buffer.from(signingKey, 'base64'));
  hmac.update(toSign);
  var base64UriEncoded = encodeURIComponent(hmac.digest('base64'));

  // Construct authorization string
  var token = "SharedAccessSignature sr=" + resourceUri + "&sig="
  + base64UriEncoded + "&se=" + expires;
  if (policyName) token += "&skn="+policyName;
  return token;
};

var sasToken = generateSasToken("ForestGuardHub.azure-devices.net/devices", "TG/MUc52slMFZXo/ul3Ntqt+DMKtbN1ODOs+/uemvUk=", "registryRead",3600);

console.log(sasToken);


const iotHubConnectionString = "HostName=ForestGuardHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=PkZ083+rNhOre3ekmeNBWWFKV0IvZLGK+sHKAltELJ0=";
if (!iotHubConnectionString) {
  console.error(`Environment variable IotHubConnectionString must be specified.`);
  return;
}
console.log(`Using IoT Hub connection string [${iotHubConnectionString}]`);

const eventHubConsumerGroup = "$Default";
console.log(eventHubConsumerGroup);
if (!eventHubConsumerGroup) {
  console.error(`Environment variable EventHubConsumerGroup must be specified.`);
  return;
}
console.log(`Using event hub consumer group [${eventHubConsumerGroup}]`);

// Redirect requests to the public subdirectory to the root
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res /* , next */) => {
  res.redirect('/');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        console.log(`Broadcasting data ${data}`);
        client.send(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
};


server.listen(process.env.PORT || '3000', () => {
  console.log('Listening on %d.', server.address().port);
});

function getTime(){
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
return time;
}
const eventHubReader = new EventHubReader(iotHubConnectionString, eventHubConsumerGroup);

(async () => {
  await eventHubReader.startReadMessage((message, date, deviceId) => {
    try {
      const payload = {
        IotData: message,
        MessageDate: getTime(),
        DeviceId: deviceId
      };

      wss.broadcast(JSON.stringify(payload));
    
    } catch (err) {
      console.error('Error broadcasting: [%s] from [%s].', err, message);
    }
  });
})().catch();