"use strict";
import React, { Component } from "react";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import Utilies from "./utilies";

const styles = StyleSheet.create({
  plainText: {
    fontSize: 13,
    color: "white",
    backgroundColor: Utilies.clearColor
  },
  plainText16: {
    fontSize: 16,
    color: "white",
    backgroundColor: Utilies.clearColor
  },
  weatherIcon: {
    width: 20,
    height: 20
  }
});

// Today's brief
class TodayOverviewCell extends Component {
  render() {
    if (this.props.weatherData == null) return <View />;
    var temps = this.props.weatherData.observation.metric;
    return (
      <View style={todayOverview.container}>
        <Text style={styles.plainText16}>
          {Utilies.getCurrentWeekDay()} Today
        </Text>
        <Text style={[styles.plainText16, { marginLeft: 8 }]}>
          {temps.max_temp}° &nbsp;&nbsp; &nbsp; &nbsp;
          {temps.min_temp}°
        </Text>
      </View>
    );
  }
}
const todayOverview = StyleSheet.create({
  container: {
    height: Utilies.tempCellHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginLeft: 10,
    marginRight: 10
  }
});
TodayOverviewCell.defaultProps = {
  weatherData: null
};

// Time point
class HourDetailView extends Component {
  render() {
    return (
      <View style={hourDetail.container}>
        <Text style={styles.plainText}>{this.props.hourStr}</Text>
        {Utilies.iconImage(this.props.iconType)}
        <Text style={styles.plainText}>{this.props.tmpStr}</Text>
      </View>
    );
  }
}
const hourDetail = StyleSheet.create({
  container: {
    width: 60,
    justifyContent: "space-around",
    alignItems: "center"
  }
});
HourDetailView.defaultProps = {
  hourStr: "",
  iconType: "",
  tmpStr: ""
};

// Today's weather details
class TodayDetailHeader extends Component {
  createDetailViews() {
    var dataList = this.props.weatherData.forecasts;
    var views = [];
    for (var i = 0; i < dataList.length; i++) {
      var data = dataList[i];
      var dateStr = data.dateStr;
      if (dateStr == null) {
        var date = new Date(data.fcst_valid * 1000);
        dateStr = date.getHours() + "Hr";
        data.dateStr = dateStr;
      }
      var tempStr = data.tempStr;
      if (tempStr == null) {
        tempStr = data.metric.temp + "°";
        data.tempStr = tempStr;
      }
      views.push(
        <HourDetailView
          hourStr={dateStr}
          iconType={data.icon_cd}
          tmpStr={tempStr}
          key={i}
        />
      );
    }
    return views;
  }

  render() {
    return (
      <ScrollView
        style={todayDetail.container}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {this.createDetailViews()}
      </ScrollView>
    );
  }
}
TodayDetailHeader.createCustomData = (timeString, type, tempStr) => {
  return {
    dateStr: timeString,
    type: type,
    tempStr: tempStr
  };
};
const todayDetail = StyleSheet.create({
  container: {
    height: 80,
    borderTopWidth: Utilies.lineWidth,
    borderTopColor: Utilies.lineColor,
    borderBottomWidth: Utilies.lineWidth,
    borderBottomColor: Utilies.lineColor,
    backgroundColor: Utilies.commonBgColor
  }
});
TodayDetailHeader.defaultProps = {
  weatherData: {}
};

// Weather in the next few days
class FutureWeatherCell extends Component {
  render() {
    if (this.props.weatherData == null) {
      return <View />;
    }
    return <View>{this.createFutureViews()}</View>;
  }
  createFutureViews() {
    var viewCreator = function(data, index) {
      return (
        <View style={futureWeather.container} key={i}>
          {/* setting width for the future view */}
          <Text
            style={{
              width: 96,
              color: "white",
              backgroundColor: Utilies.clearColor
            }}
          >
            {data.dow}
          </Text>
          {Utilies.iconImage(data.day.icon_cd)}
          <Text style={[styles.plainText16, { marginLeft: 8 }]}>
            {data.metric.max_temp} ° &nbsp;&nbsp; &nbsp; &nbsp;
            {data.metric.min_temp} °
          </Text>
        </View>
      );
    };
    var views = [];
    for (var i = 1; i < this.props.weatherData.forecasts.length; i++) {
      views.push(viewCreator(this.props.weatherData.forecasts[i], i));
    }
    return views;
  }
}
const futureWeather = StyleSheet.create({
  container: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10
  }
});
FutureWeatherCell.defaultProps = {
  weatherData: null
};

// Description of the weather
class WeatherDescribeCell extends Component {
  render() {
    var weatherData = this.props.weatherData;
    var describe = "";
    if (weatherData != null) {
      describe =
        "Today: It is now " +
        weatherData.conditionsshort.observation.wx_phrase +
        " " +
        weatherData.conditionsshort.observation.metric.max_temp +
        "° Tonight is " +
        weatherData.fcstdaily10short.forecasts[0].night.phrase_32char +
        " Min Temp " +
        weatherData.conditionsshort.observation.metric.min_temp +
        "°";
    }
    return (
      <View style={weatherDescribe.container}>
        <Text style={[styles.plainText16, { fontSize: 20 }]}>{describe}</Text>
      </View>
    );
  }
}
const weatherDescribe = StyleSheet.create({
  container: {
    borderTopWidth: Utilies.lineWidth,
    borderTopColor: Utilies.lineColor,
    borderBottomWidth: Utilies.lineWidth,
    borderBottomColor: Utilies.lineColor,
    padding: 20
  }
});
WeatherDescribeCell.defaultProps = {
  weatherData: null
};

const DetailNames = {
  sunrise: "sunrise",
  sunset: "sunset",
  relative_humidity: "humidity",

  wind_mph: "Wind speed",
  feelslike_c: " feelslike_c",

  precip_today_metric: "Precipitation",
  pressure_mb: "pressure mb",

  visibility_km: "visibility km",
  UV: "UV"
};
class WeatherDetailCell extends Component {
  itemCreate(values, align) {
    var items = [];
    for (var i = 0; i < values.length; i++) {
      items.push(
        <Text
          style={[
            styles.plainText16,
            {
              paddingTop: i % 2 == 0 ? 5 : 2,
              paddingBottom: i % 2 == 0 ? 2 : 5,
              textAlign: align,
              height: 24
            }
          ]}
          key={i}
        >
          {values[i]}
        </Text>
      );
    }
    return items;
  }

  render() {
    if (this.props.weatherData == null) {
      return <View style={{ height: 120, fontSize: 20 }} />;
    }
    var createLeftView = () => {
      var names = [
        "sunrise:",
        "sunset:",
        "Rainfall probability:",
        "humidity:",
        "Wind speed:",
        "Feels like:",
        "Precipitation:",
        "Air pressure:",
        "visibility:",
        "UV index:"
      ];
      return (
        <View style={{ justifyContent: "flex-end", flex: 1 }}>
          {this.itemCreate(names, "center")}
        </View>
      );
    };
    var createRightView = () => {
      return (
        <View style={{ flex: 1 }}>
          {this.itemCreate(this.props.weatherData, "left")}
        </View>
      );
    };
    return (
      <View style={{ flexDirection: "row" }}>
        {createLeftView()}
        {createRightView()}
      </View>
    );
  }
}
WeatherDetailCell.defaultProps = {
  weatherData: null
};

// ========== Export ===========
module.exports = {
  TodayOverviewCell,
  FutureWeatherCell,
  TodayDetailHeader,
  WeatherDescribeCell,
  WeatherDetailCell
};
