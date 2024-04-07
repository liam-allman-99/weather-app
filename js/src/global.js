import $ from 'jquery';
import "bootstrap";
import "slick-carousel";

$(function() {
  weatherApi('London');

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

      // Prevents the page reload
      event.preventDefault();
    }
  });

  function weatherApi(location) {
    let apiUrl = 'http://api.weatherapi.com/v1/forecast.json?key=8802ddfd2b994798b5d90805240704&q='+location+'&days=3&aqi=no&alerts=no';

    console.log(apiUrl);

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
          var tabContentElement = $('<div class="tab-pane fade ' + firstTab + '" id="' + tabContentId + '" role="tabpanel" aria-labelledby="' + tabContentId + '" tabindex="0"></div>');
  
          // Append tab content element to the tab content area
          $('#forecastContent').append(tabContentElement);

          // Append sub tab system to the tabContent
          var hourlyTabs = '<ul class="nav nav-tabs" id="hour-tabs-' + forecastDate + '" role="tablist"></ul>';
          var hourlyContent = '<div class="tab-content" id="hourly-content-' + forecastDate + '"></div>';
          $('#' + tabContentId).append(hourlyTabs);
          $('#' + tabContentId).append(hourlyContent);

          // Loop through forecastHourly for the current date
          forecastHourly.forEach(function(hour, index) {
            var hourlyTime = hour.time;

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

            var hourlyButtonId = tabId + '-' + index; // Unique ID for each button
            var tabContentIdHourly = 'nav-' + forecastDate + '-' + index; // Unique ID for each tab content

            var hourlyButton = $('<button class="nav-link" id="' + hourlyButtonId + '" type="button" data-bs-toggle="tab" data-bs-target="#' + tabContentIdHourly + '" role="tab" aria-controls="' + tabContentIdHourly + '" aria-selected="false"><p class="mb-0">' + formattedTime + '</button>');

            // Append the button to the corresponding hour-tabs element
            $('#hour-tabs-' + forecastDate).append(hourlyButton);

            // Create tab content element for hourly details
            var tabContentElementHourly = $('<div class="tab-pane fade" id="' + tabContentIdHourly + '" role="tabpanel" aria-labelledby="' + hourlyButtonId + '" tabindex="0"><p>Time: ' + formattedTime + ', Temperature: ' + hour.temp_c + '°C</p></div>');

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
  }
});