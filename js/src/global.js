import $ from 'jquery';
import "bootstrap";
import "slick-carousel";

$(function() {
  initSliders();
  // currentDateTime();
  weatherApi('London');

  $('#weather-search').on('keydown', function(event){
    if (event.keyCode === 13) {
      let apiLocation = $(this).val();
      console.log(apiLocation);
      weatherApi(apiLocation);
      event.preventDefault();
    }
  });

  // function currentDateTime() {
  //   var currentDate = new Date();
  //   var year = currentDate.getFullYear();
  //   var month = String(currentDate.getMonth() + 1).padStart(2, '0');
  //   var day = String(currentDate.getDate()).padStart(2, '0');
  //   var hour = String(currentDate.getHours()).padStart(2, '0');
  //   var minute = String(currentDate.getMinutes()).padStart(2, '0');

  //   var currentDateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;

  //   console.log(currentDateTime);
  // }

  function weatherApi(location) {
    let apiUrl = 'http://api.weatherapi.com/v1/forecast.json?key=8802ddfd2b994798b5d90805240704&q='+location+'&days=3&aqi=no&alerts=no';

    $.ajax({
      url: apiUrl,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        var forecastArray = data.forecast.forecastday;

        forecastArray.forEach(function(forecast, index) {
          var forecastHourly = forecast.hour;

          forecastHourly.forEach(function(forecast, index) {
            console.log(forecast);
          });
        });
      },
      error: function(xhr, status, error) {
        // Handle errors
        console.error(xhr.responseText);
      }
    });
  }
});

/**
 * @description initialise the slick sliders for the page
 */
let initSliders = () => {
  $(".global-slider").slick({
    dots: false,
    arrows: true,
    nextArrow: '<button class="slick-arrow slick-next"><i class="fa-solid fa-chevron-right"></i></button>',
    prevArrow: '<button class="slick-arrow slick-prev"><i class="fa-solid fa-chevron-left"></i></button>',
    slidesToScroll: 1,
    slidesToShow: 1,
    infinite: false,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 1201,
        settings: {
          slidesToShow: 3,
        }
      },
    ],
  });
};