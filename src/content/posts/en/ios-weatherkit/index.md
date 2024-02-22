---
date: 2023-05-01
title: "An Introduction to WeatherKit and Alternative Weather Service APIs for iOS Developers"
tags:
  [
    iOS,
    iPadOS,
    macOS,
    tvOS,
    watchOS,
    weather,
    WeatherKit,
    OpenWeather,
    WWDC,
    API,
    Apple,
    guide,
  ]
image: './header.webp'
authors:
  - warren-harrod
categories:
  - ios
---

Nowadays weather APIs are used in a wide range of applications from travel sites that help people plan their daily outdoor activities to distribution logistics where severe weather warnings can help companies plan for supply problems. Many mobile developers could also benefit from these weather services to provide useful information to complement the core functionality of their own apps as well. Adding a daily weather forecast to a calendar app could help in choosing which day to go hiking. Knowing today's weather could help a restaurant app make suitable suggestions for meals and drinks. Whilst a Japanese cherry blossom viewing app could make use of historic weather data to help predict the best place to go on a certain day.

## WeatherKit

Up to now, iOS developers have had to rely on a mixed variety of third-party weather services and contend with numerous APIs, complex pricing plans and varying features. However, with the release of iOS 16, Apple now provides its own fully integrated weather service for iOS and all its other platforms (iPadOS 16, macOS 13, tvOS 16 and watchOS 9). In addition to a Swift API for Apple's own platforms called WeatherKit Apple also provides a REST API for other platforms, such as Android and websites, as well but I won't be covering this aspect in this article.

Apple weather was originally a weather service offered by Dark Sky, a popular app and weather service that Apple purchased in March 2022. Although Apple will be shutting this service down in March 2023 Apple has taken the core weather forecasting functionality and updated the service with improvements and overall performance and stability enhancements.

Note that although many of Dark Sky's features and capabilities have been integrated into Apple's new weather service, for those who are already familiar with Dark Sky you would be advised to compare service details for any possible changes.

WeatherKit is powered by this new weather service and provides apps and services with a comprehensive range of past, present, and future weather data that can be used to help you keep your users up to date with weather in their location.

WeatherKit is a welcome, if not late, addition to a growing number of weather services available and although there are several competing services already available there are a few specific advantages to Apple's own weather service.

Firstly, WeatherKit uses their all-new global weather service that provides a vast amount of up-to-date hyperlocal weather information. This offers both hourly forecasts for the next 10 days and minute-by-minute forecasts for the next hour as well as severe weather alerts and historical weather data.

Next, WeatherKit includes a Swift API utilizing a modern Swift syntax with Swift concurrency so it’s easy to get weather data with only a few lines of code. In addition, as the service is built on the mature Foundation and CoreLocation APIs, formatting measurements and converting units couldn't be easier.

Finally, as you would expect from Apple, WeatherKit is designed to give hyperlocal forecasts without compromising your user data. The location information you provide for the API is only used to provide weather forecasts. It is not stored on Apple's servers and the user is not tracked between requests. In addition, only the location data is used without any association to user information that is personally identifiable.

### Data types

WeatherKit provides a variety of data types for current weather information, including:
1. **Temperature**: The current temperature, in both Celsius and Fahrenheit.
2. **Weather Condition**: The current weather condition, such as clear, cloudy, rainy, or snowy.
3. **Weather Icon**: An icon representing the current weather condition.
4. **Humidity**: The current humidity level, expressed as a percentage.
5. **Wind Speed**: The current wind speed, in both meters per second and miles per hour.
6. **Wind Direction**: The current wind direction, in degrees.
7. **Pressure**: The current atmospheric pressure, in both hPa and inHg.
8. **UV Index**: The current ultraviolet (UV) index, which indicates the level of UV radiation.
9. **Visibility**: The current visibility, in both kilometers and miles.
10. **Cloud Cover**: The current cloud cover, expressed as a percentage.
11. **Precipitation**: The current precipitation, including the type of precipitation (rain, snow, sleet, etc.) and the intensity.
12. **Sunrise/Sunset**: The time of sunrise and sunset for the current location.
These are the main data types that can be retrieved for current weather information in WeatherKit.
Note that the specific data types available vary based on the weather you are.

### Requirements

There are number of requirements that you need to be aware of when considering Apple's weather service.

Firstly, you will obviously need to have a valid Apple Developer Program membership. Access to WeatherKit is specifically included in the Apple Developer Program. Not only does that provide you with all the tools and resources you need to develop and distribute apps but also gives you access to usage analytics to monitor API access and manage subscription levels.

Secondly, WeatherKit requires iOS 16, iPadOS 16, macOS 13, tvOS 16, or watchOS 9. Unfortunately, Apple couldn’t offer this service to older platforms so for those who need to handle apps supporting a previous OS version then you will need to either integrate the weather service as an option for the latest version only or wait a few years until WeatherKit is available on every OS version you need to support.

Thirdly, WeatherKit only provides 500,000 API calls a month for free (as part of your Apple Developer Program membership). If you need additional API calls, then you can choose to pay for additional API usage by subscribing to one of the other paid weather data tiers. This is easily done via the Account tab of the Apple Developer app, and you can upgrade or downgrade a subscription at any time.

| Calls per month | Cost |
|---|---|
| 500,000 | free (Included with membership) |
| 1 million | US$49.99 |
| 2 million | US$99.99 |
| 5 million | US$249.99 |
| 10 million | US$499.99 |
| 20 million | US$999.99 |
| 50 million | US$2,499.99 |
| 100 million | US$4,999.99 |
| 150 million | US$7,499.99 |
| 200 million | US$9,999.99 |

Finally, you will need to be aware of attribution requirements for Apple's weather service. Regardless of whether you use WeatherKit in your apps, web apps, or websites, you will have to follow Apple's strict guidelines and requirements for attributing weather data from Apple.

## Alternative free weather API services

In addition to the WeatherKit free tier there are alternative free weather API services available for obtaining weather data for mobile applications which may offer you a better service depending on your needs. In deciding which service is best for you there are several possible differences you may need to consider.

A detailed comparison of weather services is difficult to make because service options, pricing tiers and API functionality varies widely. Since every app will has its own specific weather requirements every weather service will have its own merits and demerits you will have to consider.

Remember that although with Apple's weather service only the number of available API calls changes between free and paid plans, other weather services may also limit the weather information you can access as well when using their free tier.

Here are some points you should consider:

1. **Features**: The WeatherKit free tier provides weather data for cities around the world, including current weather conditions, hourly and daily forecasts, as well as historical weather data and severe weather alerts. Free weather API services may have limited features compared to WeatherKit, such as limited API calls, fewer types of weather information or less accurate weather data.

2. **Accuracy and Coverage**: The WeatherKit free tier uses multiple sources, including weather stations and weather models, to ensure the accuracy of its forecasts. Free weather API services may not have as many data sources or may use less reliable data, which could result in less accurate weather information. Also be aware that WeatherKit is a global weather service so your app or service should work worldwide whilst other free weather API services be either be region specific or be unable to provide hyper-local weather data for every country.

3. **Service Limitations**: The WeatherKit free tier has limitations on the number of API calls that can be made, which may not be sufficient for some mobile applications. Free weather API services may also have similar limitations (with more or fewer free API calls available) and may additionally also limit the kinds of weather data that can be obtained as well.

4. **Support**: The WeatherKit free tier provides basic support for developers, including comprehensive documentation, sample code and a community forum. Free weather API services may have limited support and/or may not have dedicated support teams.

5. **Privacy**: With WeatherKit you can be sure that the user is not being tracked between requests and user location data is not being used for other purposes. Free weather API services may be harvesting and selling your user location information as well as using it to identify the user for targeted advertising.

Overall, both Apple's weather service and other free weather API services can be good options for obtaining weather data for mobile applications, depending on the specific needs and budget of your app. However, the WeatherKit free tier will usually provide more reliable and accurate weather data, with limitations only on API calls, whilst free weather API services may have similar limitations and less available data but may be more cost-effective if they offer more free API usage.

Bearing the above in mind let’s look at some popular weather service APIs for mobile apps. Now, this is not a comprehensive list nor a top ten ranking of weather services. There are far too many weather services available to list them all and it's difficult to provide an exact order of the most popular weather APIs since popularity can depend on various factors such as pricing, features, accuracy, and ease of use. Nevertheless, here are a few of the most popular weather APIs, in no particular order:

### OpenWeather API:
This API provides weather information for any location in the world, including current weather conditions, forecasts, and historical data.

### Weather Underground API:
This API provides weather data for over 250,000 locations worldwide, including real-time observations, forecasts, and severe weather alerts.

### AccuWeather API:
This API provides accurate weather data for any location in the world, including current conditions, hourly and daily forecasts, and severe weather alerts.

### Weather API:
This API provides weather data for over 200,000 locations worldwide, including current conditions, forecasts, and historical data.

### Weatherstack API:
This API provides current weather data and forecasts for over 200,000 locations worldwide, with support for multiple languages and units of measurement.

### National Weather Service API:
This API provides weather data for the United States, including current conditions, forecasts, and severe weather alerts.

Please note that while these APIs all have a free tier, some may have limitations on the number of requests you can make per day or require attribution to the provider. Be sure to review the terms and conditions of each service when comparing API functionality.

## How to pick a service?

Each weather service has its own strengths and weaknesses, and the best choice for a particular mobile application will depend on the specific needs of the app, the target audience, and other such factors. To highlight the differences that such services may have let’s take a closer look at one such service and compare it to WeatherKit.

OpenWeather and Apple Weather are both weather data providers that offer APIs for developers to integrate into their mobile apps. Here are some advantages/disadvantages of OpenWeather compared to WeatherKit:

### Advantages:

1. **Coverage**: OpenWeather provides weather data for over 200,000 locations worldwide, while WeatherKit's coverage is mainly limited to the United States, Canada, and a few other countries such as Germany, India, Japan, China, Brazil etc. If you need specific global coverage then OpenWeather may be a better choice, depending on the country, although I would expect Apple to expand its use of third-party meteorological data providers in the future.

2. **Range of data**: OpenWeather provides a wider range of weather data, including current conditions, forecasts, historical data, and satellite imagery, while WeatherKit mainly focuses on current conditions and forecasts. If you need access to a wider variety of weather data, OpenWeather could be a better choice although you may need to use a paid plan to access some it. Although WeatherKit does offer historical data it only goes back a few years compared to more than 40 years back for OpenWeather. However, historical data is included in the WeatherKit free tier without restriction whilst OpenWeather limits your access to historical data in its free tier.

3. **Pricing**: OpenWeather offers several free plans with limited requests per day, while WeatherKit offers one free plan with limited requests per month. Overall, OpenWeather offers cheaper plans with more API calls but restricts available weather data depending on the tier chosen. If cost is a concern, OpenWeather's free plan may be more suitable but check to ensure that it will provide the weather data you require.

4. **Customization**: OpenWeather allows for more customization options, such as choosing the language, units of measurement, and data format, while WeatherKit has fewer customization options. If you need more flexibility in how the weather data is presented in your app, OpenWeather may be a better choice.

### Disadvantages:

1. **Accuracy**: WeatherKit uses a proprietary forecasting algorithm that considers a wide range of weather data sources, including radar and satellite imagery, to provide highly accurate and up-to-date weather data. This can be especially useful for developers who require highly accurate weather data, but availability may be limited to certain regions.

2. **Simplicity**: WeatherKit has a simpler API structure with a modern Swift syntax and comprehensive documentation and sample code, making it easier for developers to integrate into their mobile apps. This can be useful for developers who are new to weather APIs or who need to quickly add weather data to their app.

3. **Support**: WeatherKit offers dedicated support for its customers, including a help center, documentation, and technical support. This can be especially useful for developers who need assistance with integrating the API into their app or resolving issues with the weather data. Long term, developers can expect new functionality to be added and coverage to be expanded. Unlike a third-party API provider it is unlikely that this service will suddenly be stopped forcing you to switch to another weather service.

4. **Data quality**: WeatherKit focuses on providing high-quality weather data for the areas it covers, rather than trying to cover a large number of locations worldwide. This can be beneficial for developers who need to ensure the accuracy and reliability of their weather data for a specific region or location but may be a problem if you are not yet in one of these areas.

5. **Privacy**: As mentioned before you can trust Apple to treat your users’ location information with respect. Data is not collected, and users are not tracked. It should be noted that OpenWeather also claims not to collect or store any parameters from your API requests nor share any data with third-party companies and services.

Ultimately, the choice between OpenWeather (or any similar weather service) and WeatherKit will depend on your specific needs and requirements for your mobile app. As a relatively new weather service Apple Weather has a smaller set of weather data available with only a 10-day forecast and a few years of historic data. If your app specifically makes use of historic weather data or requires a forecast for a whole month then currently you will need to consider another service. Although, such long-range forecasts and detailed historical data are rarely available at the free tier.

## Conclusion

Overall, WeatherKit would seem to be most suitable for apps that use weather data for detailed local weather forecasts for the next week or so. For those apps that aren’t specifically weather related then the simple API integration and low-cost maintenance will be appealing to developers who would like to use weather data but don’t wish to spend the time or effort for a feature that maybe only has limited use within existing functionality. In addition, having the Weather Service account as part of your Apple Developer Program membership makes billing and account management easy as well.

On the other hand, if weather data is a core part of your app functionality and you require specific information not supported in WeatherKit then you should be looking at one of the other weather services available. Although, at the free tier level WeatherKit usually offers much of the weather data that you can only access with paid tiers in other weather services.

---
### Resources
- [WeatherKit](https://developer.apple.com/weatherkit/)
- [OpenWeather](https://openweathermap.org)
- [Weather API](https://www.weatherapi.com)
- [Weather Underground](https://www.wunderground.com)
- [AccuWeather](https://www.accuweather.com)
- [Weatherstack](https://weatherstack.com)
