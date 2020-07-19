var my_data;
var my_chart;
var loc;
const ctx = document.getElementById("axes_line_chart").getContext("2d");
var cases_list = [],
	recovered_list = [],
	deaths_list = [],
	formatedDates = [];

function load_data() {

	fetch("https://api.covid19api.com/summary", {
		"method": "GET"
	})
	.then( response => {
		return response.json();
	})
	.then( data => {
		my_data = data;
    load_world();
    your_country();
    add_options();
		})
	.catch( error => {
		alert("Server not reachable at this moment");
	})
}
// load data of country from which user is accesing site
function your_country() {
/*  const current_country = geoplugin_countryName();
  for (var i = 0; i < my_data.Countries.length; i++) {
    if (my_data.Countries[i].Country === current_country){
       load_country(i);
			 graph_data(i);
       loc = i;
    }}*/
		// above code commented because works on http. not compatible with github pages
		loc = 76;
		load_country(loc);
		graph_data(loc);
}

function add_options() {
  var country_select = document.querySelector('#country');

  for (var i = 0; i < my_data.Countries.length; i++) {
    const opt = document.createElement('option');
    opt.innerHTML = my_data.Countries[i].Country;
    opt.value = i;
    country_select.appendChild(opt);
		if (i === loc){
		opt.selected = true;}
    }
  }

function load_world() {
  document.querySelector('#wtc').innerHTML = my_data.Global.TotalConfirmed;
  document.querySelector('#wtd').innerHTML = my_data.Global.TotalDeaths;
  document.querySelector('#wtr').innerHTML = my_data.Global.TotalRecovered;
  document.querySelector('#wnc').innerHTML = my_data.Global.NewConfirmed;
  document.querySelector('#wnd').innerHTML = my_data.Global.NewDeaths;
  document.querySelector('#wnr').innerHTML = my_data.Global.NewRecovered;
}

function load_country(i) {
  document.querySelector('#selection').innerHTML = my_data.Countries[i].Country;
  document.querySelector('#ctc').innerHTML = my_data.Countries[i].TotalConfirmed;
  document.querySelector('#ctd').innerHTML = my_data.Countries[i].TotalDeaths;
  document.querySelector('#ctr').innerHTML = my_data.Countries[i].TotalRecovered;
  document.querySelector('#cnc').innerHTML = my_data.Countries[i].NewConfirmed;
  document.querySelector('#cnd').innerHTML = my_data.Countries[i].NewDeaths;
  document.querySelector('#cnr').innerHTML = my_data.Countries[i].NewRecovered;
}


function graph_data(country_index){

	cases_list = [], recovered_list =[], deaths_list = [], dates = [], formatedDates = [];
	var my_url = "https://api.covid19api.com/country/" + my_data.Countries[country_index].Slug;
	fetch(my_url, {
		"method": "GET"
	})
	.then( response => {
		return response.json();
	})
	.then( data => {
		days = Object.keys(data)
		let temp,dt;
		days.forEach( days => {
			dt = data[days];
			temp = dt.Date;
			formatedDates.push(`${temp.slice(8,10)}/${temp.slice(5,7)}`);
			cases_list.push(dt.Confirmed);
			recovered_list.push(dt.Recovered);
			deaths_list.push(dt.Deaths);
		})
	})
	.then( () => {
		axesLinearChart();
	})
	.catch( error => {
		alert(`Servers providing data for country ${my_data.Countries[country_index].Country} not reachable at this moment`);
	})
}


function axesLinearChart(){
	if(my_chart) { my_chart.destroy();}
	my_chart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Cases',
				data: cases_list,
				fill : false,
				borderColor : '#000',
				backgroundColor: '#000',
				borderWidth : 1
			},{
				label: 'Recovered',
				data: recovered_list,
				fill : false,
				borderColor : '#009688',
				backgroundColor: '#009688',
				borderWidth : 1
			},{
				label: 'Deaths',
				data: deaths_list,
				fill : false,
				borderColor : '#f44336',
				backgroundColor: '#f44336',
				borderWidth : 1
			}],
			labels: formatedDates
		},
		options: {
			responsive : true,
			maintainAspectRatio : false
		}
	})
}
load_data();

addEventListener('change', (event) => {
  country_index = event.target.value;
  load_country(country_index);
	graph_data(country_index);
});
