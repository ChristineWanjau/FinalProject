$(document).ready(() => {
	// if deployed to a site supporting SSL, use wss://
	const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
	const webSocket = new WebSocket(protocol + location.host);

	console.log(webSocket);
	webSocket.onmessage = function onMessage(message) {
		try {
		  console.log("some data");
		  console.log(message);
		}
		catch(err){
			console.error(err);
		}
	}
	var sasToken ="SharedAccessSignature sr=ForestGuardHub.azure-devices.net%2Fdevices&sig=BGF13d3dwHx6prtH1EagumdyM2MSCwBDOZWoYWHSsZc%3D&se=1651816603&skn=registryRead";
const api_url =
	"https://ForestGuardHub.azure-devices.net/devices?api-version=2020-05-31-preview";

// Defining async function
async function getapi(url) {
	
	// Storing response
	const response = await fetch(url,
		{
        headers: new Headers({
            'Authorization': sasToken,       
          }),} 
		);
	
	// Storing data in form of JSON
	var data = await response.json();
	console.log(data);
	if (response) {
	show(data);
}
}
// Calling that async function
console.log("gettign data");
getapi(api_url);

// Function to hide the loader
// function hideloader() {
// 	document.getElementById('loading').style.display = 'none';
// }
// Function to define innerHTML for HTML table
function show(data) {
	let tab =
	`<tr>
	<th>Device ID</th>
	<th>Generation Id</th>
	<th>Status</th>
	<th>Last Activity Time</th>
	<th>Status Updated Time</th>
</tr>`;
	
	// Loop to access all rows
	for (let r of data) {
		tab += `<tr>
	<td>${r.deviceId} </td>
	<td>${r.generationId}</td>
	<td>${r.status}</td>
	<td>${r.lastActivityTime}</td>
	<td>${r.statusUpdatedTime}</td>		
</tr>`;
	}
	// Setting innerHTML as tab variable
	document.getElementById("dataTable").innerHTML = tab;
}
});
