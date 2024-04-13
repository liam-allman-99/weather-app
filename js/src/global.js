import $ from 'jquery';
import "bootstrap";
import "slick-carousel";

$(function() {
  weatherApi('London');
  scrollHeader();

  // Calls the scrollHeader function on scroll of the window
  $(window).on('scroll', function() {
    scrollHeader();
  });

  // Addign class to header on scroll
  function scrollHeader() {
    // Check if the scroll position is greater than 0
    if ($(window).scrollTop() > 0) {
      $('header').addClass('scroll');
    } else {
      $('header').removeClass('scroll');
    }
  }

  // Toggle the search bar on mobile
  $('#search-btn').on('click', function(){
    $('#search-field').toggleClass('d-none');
  });

  // Search functionality on keydown
  $('#weather-search').on('keydown', function(event){
    // Checks if the keydown is enter
    if (event.keyCode === 13) {
      // sets the value of the input field to a varaible
      let apiLocation = $(this).val();

      // Checks to see if varaible is undefined or unset
      if($(this).val() == undefined || $(this).val() == '') {
        // If so location is set to London
        apiLocation = ('London');
      }

      // Changes page title to search location
      $('#weather-location').text(apiLocation);

      // Call the weatherAPI for the data
      weatherApi(apiLocation);

      // // Reset values to metric
      // $('.imperial-values').addClass('d-none');

      // Prevents the page reload
      event.preventDefault();
    }
  });

  function weatherApi(location) {
    let apiUrl = 'https://api.weatherapi.com/v1/forecast.json?key=8802ddfd2b994798b5d90805240704&q='+location+'&days=3&aqi=no&alerts=no';

    $.ajax({
      url: apiUrl,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        var forecastArray = data.forecast.forecastday;

        // Check on ajax success if the #forecastContent has three children and if it does it deletes the elements
        if ($('#forecastContent').children().length === 3) {
          $('.tab-pane').remove();
        };

        forecastArray.forEach(function(forecast, index) {
          // Gets the date from the forecast array
          var forecastDate = forecast.date;

          // Get the hourly forecast data
          var forecastHourly = forecast.hour;

          // parse the date from the forecast
          var dateObj = new Date(forecastDate);

          // Get the new date for conversion
          var day = dateObj.getDate();

          // Get the current month for the date
          var month = dateObj.getMonth() + 1;

          // Get the day of the month in a short format
          var dayOfWeekShort = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

          var firstButton = '';
          var firstTab = '';

          // Checks which index in the loop were in
          if(index == 0) {
            // Sets the first loop tabs to be active and visible on ajax complete
            firstButton = 'active';
            firstTab = 'show active';

            // Sets the date to be Today
            var dateLabel = 'Today';
          } else {
            // Sets the date to be a short version of the day for example Sun
            var dateLabel = dayOfWeekShort;
          }

          // Sets the formattedDate to be a string
          var formattedDate = '';

          // Check if day is less than 10 to add a leading 0 to the date
          if (day < 10) {
            formattedDate += '0';
          }

          // Add the day to the formatted date string
          formattedDate += day;

          // Add a forward slash to separate day and month
          formattedDate += '/';

          // Check if month is less than 10 to add a leading 0 to the date
          if (month < 10) {
            // If month is less than 10, add a leading zero
            formattedDate += '0';
          }

          // Add the month to the formatted date string
          formattedDate += month;   
  
          // Create a unique ID for the tab and tab content
          var tabId = 'nav-' + forecastDate + '-tab';
          var tabContentId = 'nav-' + forecastDate;
  
          // Create tab element
          var tabElement = $('<button class="nav-link '+ firstButton +'" id="' + tabId + '" type="button" data-bs-toggle="tab" data-bs-target="#'+ tabContentId +'" role="tab" aria-controls="nav-profile" aria-selected="false"><p class="mb-0">' + dateLabel + '</p><p class="mb-0 date">' + formattedDate + '</p></button>');
  
          // Check if dateTabs already has elements
          if ($('#dateTabs').children().length !== 3) {
            // Append tab element to the tab list
            $('#dateTabs').append(tabElement);
          };
  
          // Create tab content element
          var tabContentElement = $('<div class="flex-row flex-wrap align-items-center tab-pane fade ' + firstTab + '" id="' + tabContentId + '" role="tabpanel" aria-labelledby="' + tabContentId + '" tabindex="0"></div>');
  
          // Append tab content element to the tab content area
          $('#forecastContent').append(tabContentElement);

          // Append sub tab system to the tabContent
          var scrollTabs = '<div class="d-flex d-md-none flex-row align-items-center justify-content-center col-12"><p class="mb-0 text-quaternary me-2">Swipe to scroll</p><i class="text-quaternary fa-solid fa-arrow-right-long"></i></div>';
          var hourlyTabs = '<ul class="col-12 nav nav-tabs" id="hour-tabs-' + forecastDate + '" role="tablist"></ul>';
          var hourlyContent = '<div class="col-12 tab-content" id="hourly-content-' + forecastDate + '"></div>';
          $('#' + tabContentId).append(scrollTabs);
          $('#' + tabContentId).append(hourlyTabs);
          $('#' + tabContentId).append(hourlyContent);

          var indexArray = [];

          // Loop through forecastHourly for the current date
          forecastHourly.forEach(function(hourlyData, index) {
            var hourlyTime = hourlyData.time;

            // Parse the time string
            var timeObj = new Date(hourlyTime);

            // Get the hour from the parsed time
            var hour = timeObj.getHours();

            // Get the minute from the parsed time
            var minute = timeObj.getMinutes();

            // Determine if it's AM or PM
            var period;
            if (hour < 12) {
              period = 'am';
            } else {
              period = 'pm';
            }

            // Convert the hour to 12-hour format
            if (hour === 0) {
              hour = 12;
            } else if (hour > 12) {
              hour = hour - 12;
            }

            // Initialize an empty string to hold the formatted time
            var formattedTime = hour + ':';

            // Check if the minute is less than 10 to add a leading zero
            if (minute < 10) {
              formattedTime += '0';
            }

            // Append the minute to the formatted time
            formattedTime += minute + ' ' + period;

            // Get the current date and time
            var currentDate = new Date();

            // Get the current date and time in the format "YYYY-MM-DD HH:MM"
            var currentDateString = currentDate.toISOString().slice(0, 16).replace('T', ' ');

            if (hourlyData.time >= currentDateString) {
              indexArray.push(index);

              // console.log(index);
              if(index == indexArray[0]) {
                // Sets the first loop tabs to be active and visible on ajax complete
                var currentHourButton = 'active';
                var currentHourTab = 'show active';
              }

              var hourlyButtonId = tabId + '-' + index; // Unique ID for each button
              var tabContentIdHourly = 'nav-' + forecastDate + '-' + index; // Unique ID for each tab content
  
              var hourlyButton = $('<button class="nav-link '+ currentHourButton +'" id="' + hourlyButtonId + '" type="button" data-bs-toggle="tab" data-bs-target="#' + tabContentIdHourly + '" role="tab" aria-controls="' + tabContentIdHourly + '" aria-selected="false"><p class="mb-0">' + formattedTime + '</button>');
  
              // Append the button to the corresponding hour-tabs element
              $('#hour-tabs-' + forecastDate).append(hourlyButton);
  
              // Create tab content element for hourly details
              var tabContentElementHourly = $('<div class="tab-pane fade ' + currentHourTab + '" id="' + tabContentIdHourly + '" role="tabpanel" aria-labelledby="' + hourlyButtonId + '" tabindex="0">');
  
              // Create the inner modal content structure for the forecast output
              var innerBlock = $('<div class="mt-6 d-flex flex-row flex-wrap mx-lg-n4"></div>');
  
              // Append the innerBlock to the modal content
              tabContentElementHourly.append(innerBlock);
  
              // Append the forecast data to the tab content element
              // Condition data
              innerBlock.append('<div class="col-12 mb-6 mb-lg-8 text-center text-quaternary"><h5 class="mb-0">Condition - ' + hourlyData.condition.text + '</h5></div>');

              // array of labels and API data in a loop
              var weatherData = [
                { label: 'Temp', data: hourlyData.temp_c + '&deg;C', class: 'forecast-data metric-values', icon: '<i class="fa-solid fa-temperature-high"></i>' },
                { label: 'Temp', data: hourlyData.temp_f + '&deg;F', class: 'forecast-data imperial-values', icon: '<i class="fa-solid fa-temperature-high"></i>' },
                { label: 'Wind', data: hourlyData.wind_mph + ' mph', class: 'forecast-data metric-values', icon: '<i class="fa-solid fa-gauge-high"></i>' },
                { label: 'Wind', data: hourlyData.wind_kph + ' kph', class: 'forecast-data imperial-values', icon: '<i class="fa-solid fa-gauge-high"></i>' },
                { label: 'Wind Degree', data: hourlyData.wind_degree + '&deg;', class: 'forecast-data', icon: '<i class="fa-solid fa-compass"></i>' },
                { label: 'Wind Direction', data: hourlyData.wind_dir, class: 'forecast-data', icon: '<i class="fa-solid fa-location-arrow"></i>' },
                { label: 'Pressure', data: hourlyData.pressure_mb + ' mb', class: 'forecast-data metric-values', icon: '<i class="fa-solid fa-gauge"></i>' },
                { label: 'Pressure', data: hourlyData.pressure_in + ' in', class: 'forecast-data imperial-values', icon: '<i class="fa-solid fa-gauge"></i>' },
                { label: 'Humidity', data: hourlyData.humidity + '%', class: 'forecast-data', icon: '<i class="fa-solid fa-droplet"></i>' },
                { label: 'Cloud', data: hourlyData.cloud + '%', class: 'forecast-data', icon: '<i class="fa-solid fa-cloud"></i>' },
                { label: 'Feels Like', data: hourlyData.feelslike_c + '&deg;C', class: 'forecast-data metric-values', icon: '<i class="fa-solid fa-temperature-half"></i>' },
                { label: 'Feels Like', data: hourlyData.feelslike_f + '&deg;F', class: 'forecast-data imperial-values', icon: '<i class="fa-solid fa-temperature-half"></i>' },
                { label: 'Wind Chill', data: hourlyData.windchill_c + '&deg;C', class: 'forecast-data metric-values', icon: '<i class="fa-solid fa-temperature-three-quarters"></i>' },
                { label: 'Wind Chill', data: hourlyData.windchill_f + '&deg;F', class: 'forecast-data imperial-values', icon: '<i class="fa-solid fa-temperature-three-quarters"></i>' },
                { label: 'Chance of Rain', data: hourlyData.chance_of_rain + '%', class: 'forecast-data', icon: '<i class="fa-solid fa-cloud-rain"></i>' },
                { label: 'Gust', data: hourlyData.gust_mph + ' mph', class: 'forecast-data metric-values', icon: '<i class="fa-solid fa-gauge-high"></i>' },
                { label: 'Gust', data: hourlyData.gust_kph + ' kph', class: 'forecast-data imperial-values', icon: '<i class="fa-solid fa-gauge-high"></i>' },
                { label: 'UV', data: hourlyData.uv, class: 'forecast-data', icon: '<i class="fa-solid fa-cloud-sun"></i>' }
              ];

              // Loop through the array and append the data to innerBlock
              $.each(weatherData, function(index, item) {
                innerBlock.append('<div class="col-6 col-md-4 col-lg-3 mb-6 px-2 px-lg-4 ' + item.class + '"><div class="d-flex flex-column flex-fill justify-content-center align-items-center bg-white rounded-border w-100 p-6">' + item.icon + '<h5 class="mb-1 text-quaternary">' + item.data + '</h5><p class="mb-0 text-quaternary small-font">' + item.label + '</p></div></div>');
              });
            }

            // Append the tab content element for hourly details to the corresponding hourly-content element
            $('#hourly-content-' + forecastDate).append(tabContentElementHourly);
          });

        });
      },
      error: function(xhr, status, error) {
        // Handle errors
        console.error(xhr.responseText);
      }
    });

    // Hiding Imperial values on load
    setTimeout(function(){
      $('.imperial-values').addClass('d-none');
      $('#unit-select').val('metric');
    }, 250);
  }

  // Updating values on change of select
  $('#unit-select').on('change', function(){
    var selectedValue = $(this).val();

    if (selectedValue == 'metric') {
      $('.imperial-values').addClass('d-none');
      $('.metric-values').removeClass('d-none');
    } else if (selectedValue == 'imperial') {
      $('.imperial-values').removeClass('d-none');
      $('.metric-values').addClass('d-none');
    }
  });
});