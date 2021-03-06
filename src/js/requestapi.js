//jshint esversion:6
//Imports module 'render' from rendercomponent.js
import { render } from './rendercomponent.js';
import { el } from './elements.js';

//APIkeys for SL
const platsuppslag = 'https://slapione.herokuapp.com?key=7d3cb8b20f5745b2be5474a62cfcbcf7&searchstring=';
const realtidsinfo = 'https://slapitwo.herokuapp.com?key=4992f5a2c367484498bcb01c85f4c766&siteid=';
const weather = '&APPID=239d1a8a2bb0f4798577b28c4f22849b';

//Exports request object to any module that wants to use it
export const request = {
  //Function to get lat + lon from were you're located in the world
  getIP: () => {
    //Fetches from ipapi.co
    fetch('https://ipapi.co/json').then(response => {
      return response.json();
    }).then(data => {
      //sets lat + lon to send over to next fetch (weatherForCity)
      let lat = data.latitude;
      let lon = data.longitude;
      request.weatherForCity(lat, lon);
    }).catch(error => {
      console.log(error);
    });
  },
  //Function to get siteid of a station form sl platsuppslag api
  stationName: (station) => {
    render.resetStationList();
    //loader css animation starts
    el.loader.className = 'spinner';
    fetch(platsuppslag+station+'&stationsonly=true').then(response => {
      return response.json();
    }).then(data => {
      //loader css animation stops
      el.loader.className = 'hide';
      //renders all stations that matched with users input and is now selectable
      render.userPickStation(data.ResponseData);
    }).catch(error => {
      console.log(error);
    });
  },
  //selected station will now fetch with its siteid to see when next departure is within next 30 mins
  realTimeInfo: (index, data) => {
    el.loader.className = 'spinner';
    /*previous result from stationName() will loop through and see if
    index of users choice is equal to some index in data.response*/
    data.forEach((stationName, i) => {
      if(index == i)
        //if so, next fetch will go
        fetch(realtidsinfo+stationName.SiteId+'&timewindow=30').then(response => {
          return response.json();
        }).then(data => {
          el.loader.className = 'hide';
          //sends over dataresponse for this station picked
          render.renderStation(data.ResponseData);
        }).catch(error => {
          console.log(error);
        });
    });
  },
  //weatherForCity takes 2 parameters, lat + lon
  weatherForCity: (lat, lon) => {
    //fetches the current weather for this lat + lon
    fetch('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=metric'+weather)
    .then(response => {
      return response.json();
    }).then(data => {
      el.site.className = 'container';
      //sets some variables to be used later on in the render module
      let name = data.name;
      let icon = data.weather[0].id;
      let temp = data.main.temp.toFixed(1);
      render.renderWeather(name, icon, temp);
    }).catch(error => {
      console.log(error);
    });
  }
};
