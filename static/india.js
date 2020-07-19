var data;

function load_data() {
  const request = new XMLHttpRequest();
  request.open('GET',"https://api.covidindiatracker.com/state_data.json");
  request.send();
  request.onload = ()=> {
    data = JSON.parse(request.responseText);
    add_options();
  }
}

function add_options() {
  var state_select = document.querySelector('#state');

  for (var i = 0; i < data.length; i++) {
    const opt = document.createElement('option');
    opt.innerHTML = data[i].state;
    opt.value = i;
    state_select.appendChild(opt);
    if (i === 0) {
      // set selected to state with highest state
      load_state(0);
      opt.selected  = true;
    }
    }
  }

function load_state(i) {
  document.querySelector('#ctc').innerHTML = data[i].confirmed;
  document.querySelector('#ctd').innerHTML = data[i].deaths;
  document.querySelector('#ctr').innerHTML = data[i].recovered;
}

load_data();
addEventListener('change', (event) => {
  load_state(event.target.value);
});
