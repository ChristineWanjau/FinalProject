/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
$(document).ready(() => {
    // if deployed to a site supporting SSL, use wss://
    const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
    const webSocket = new WebSocket(protocol + location.host);
    var count = 0
    var arr = [];

    async function fetchAlerts() {
      let response = await fetch('https://forestguardapi20220502114450.azurewebsites.net/Alerts');
      let data = await response.json();
      if(arr.length == data.length){
         console.log("no new data");
      }
      else{
        var diff = parseInt(data.length)-parseInt(arr.length);
        arr = data;
        for (let i = 0; i<diff; i++){
        index = (parseInt(arr.length)-diff)+i;
        console.log(index);
        var card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('id',count); 
        document.getElementById('notifications').appendChild(card);
        document.getElementById(count).style.backgroundColor="orange";
        document.getElementById(count).style.paddingTop="10px";
        document.getElementById(count).style.margin="10px";
            // document.querySelectorAll('.card').forEach((x) => {
            //     var l = document.createElement('p');
            //     l.innerHTML = "Warning: Temperatures too high"+messageData.IotData.humidity;;
            //     x.appendChild(l);
            //   })
        var l = document.createElement('p');
        l.innerHTML = "Warning: Temperatures too high "+data[index].temperature;
        document.getElementById(count).appendChild(l);

        // var bt = document.createElement('button');
        // bt.setAttribute('id','btn'+count);
        // document.getElementById(count).appendChild(bt);  
        // var button = document.getElementById('btn'+count);
        // button.onclick = removeAlert(count);
        // console.log(button);
        count = count+1;
        console.log(count);
        console.log('alert');       
        }   
        
       
    }
        
      
  }

  function removeAlert(id){

    var el = document.getElementById(id);
    el.remove();

  }

  function deleteAlert(Alertid){
  fetch('https://forestguardapi20220502114450.azurewebsites.net/Alerts', {
  method: "DELETE",
  headers: {"Content-type": "application/json;charset=UTF-8"},
  body: {id : Alertid}
})
  .then(response => response.json()) 
  .then(json => console.log(json))
}

setInterval(function () {
  //   //Call to method which will send notification
  //   // If you have specific endpoint then call to that endpoint
  fetchAlerts();
 },3000 );
});