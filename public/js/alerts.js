/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
$(document).ready(() => {
    // if deployed to a site supporting SSL, use wss://
    const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
    const webSocket = new WebSocket(protocol + location.host);
    var count = 0


    async function fetchAlerts() {
      let response = await fetch('https://forestguardapi20220502114450.azurewebsites.net/Alerts');
      let data = await response.json();
      console.log(data);
  }

  fetchAlerts();
    // webSocket.onmessage = function onMessage(message) {
    //     try {
    //       const messageData = JSON.parse(message.data);
    //       console.log(messageData.IotData.humidity);
    //       if(messageData.IotData.humidity > 45){  
    //         var card = document.createElement('div');
    //         card.className = 'card';
    //         card.setAttribute('id',count); 
    //         document.getElementById('notifications').appendChild(card);
    //         document.getElementById(count).style.backgroundColor="orange";
    //         document.getElementById(count).style.paddingTop="10px";
    //         document.getElementById(count).style.margin="10px";
    //         // document.querySelectorAll('.card').forEach((x) => {
    //         //     var l = document.createElement('p');
    //         //     l.innerHTML = "Warning: Temperatures too high"+messageData.IotData.humidity;;
    //         //     x.appendChild(l);
    //         //   })
    //         var l = document.createElement('p');
    //         l.innerHTML = "Warning: Temperatures too high"+messageData.IotData.humidity;
    //         document.getElementById(count).appendChild(l);
    //         let btn = document.createElement("button");
    //         btn.innerHTML = "Dismiss";
    //         btn.setAttribute("id",'bt');
    //         document.getElementById(count).appendChild(btn);

    //         let bt = document.getElementById('bt');
    //         bt.onclick = function(){
    //            const el =  document.getElementById('bt');
    //            el.remove();
    //         }

    //         count = count+1;
    //         console.log(count);
    //         console.log('alert');

            
    //       }
    //     }catch (err) {
    //         console.error(err);
    //     }
    // }
});