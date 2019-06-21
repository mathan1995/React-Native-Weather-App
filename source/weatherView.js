"use strict";
import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, ListView } from "react-native";
import Utilies from "./utilies";
import BackgroundView from "./background";
import { TitleView, TemperatureView, BottomToolBar } from "./otherView";
import {
  TodayOverviewCell,
  FutureWeatherCell,
  TodayDetailHeader,
  WeatherDescribeCell,
  WeatherDetailCell
} from "./weatherCells";
import CityListPage from "./cityList";

class WeatherView extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      getSectionData: (dataBlob, sectionID) => dataBlob[sectionID],
      getRowData: (dataBlob, sectionID, rowID) => dataBlob[rowID],
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    this.state = {
      dataSource: ds.cloneWithRowsAndSections({}, [], []),
      allData: null
    };
    this.lastRatio = 1.0;
  }
  componentWillMount() {
    this.loadCityData();
  }
  render() {
    return (
      <View style={{ width: Utilies.dimensions.width }}>
        <TitleView
          ref={"titleView"}
          cityName={this.props.city == null ? "-" : this.props.city.name}
          weatherType={
            this.state.allData == null
              ? ""
              : this.state.allData.conditionsshort.observation.wx_phrase
          }
        />
        <TemperatureView
          ref={"temperatureView"}
          temperature={
            this.state.allData == null
              ? "-"
              : this.state.allData.conditionsshort.observation.metric.temp
          }
        />
        <ListView
          style={{ flex: 1 }}
          enableEmptySections={true}
          onScroll={event => this.onScroll(event)}
          scrollEventThrottle={1}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) =>
            this.renderRow(rowData, sectionID, rowID)
          }
          renderSectionHeader={this.renderSectionHeader}
        />
      </View>
    );
  }
  loadCityData() {
    var sectionIDs = ["hidden", "fcsthourly24short"];
    var rowIDs = [
      ["conditionsshort"],
      ["fcstdaily10short", "describe", "weatherDetail"]
    ];
    var reloadIfNeed = dataBlob => {
      if (dataBlob.fcsthourly24short == null) {
        return;
      }
      var today24hDatas = dataBlob.fcsthourly24short.forecasts;
      var future10DayDatas = dataBlob.fcstdaily10short.forecasts;
      // Sunrise and sunset time are inserted
      var sunrise_sunset_Dates = [];
      var timeObj = (dateStr, type) => {
        var str2Bit = d => (d < 10 ? "0" + d : "" + d);
        var theDate = Utilies.dateFormatter(dateStr);
        var timeStr =
          str2Bit(theDate.getHours()) + ":" + str2Bit(theDate.getMinutes());
        var timeStmp = theDate.getTime() / 1000;
        return {
          timeStmp: timeStmp,
          timeStr: timeStr,
          type: type
        };
      };
      // Need to get the maximum number of days of sunrise and sunset
      for (var i = 0; i < future10DayDatas.length; i++) {
        if (
          future10DayDatas[i].fcst_valid >
          today24hDatas[today24hDatas.length - 1].fcst_valid
        ) {
          break;
        }
        var sunriseObj = timeObj(future10DayDatas[i].sunrise, "sunrise");
        var sunsetObj = timeObj(future10DayDatas[i].sunset, "sunset");
        sunrise_sunset_Dates.push(sunriseObj);
        sunrise_sunset_Dates.push(sunsetObj);
      }

      // Insert at sunrise and sunset time
      let lastTimeSetp = today24hDatas[0].fcst_valid;
      for (var i = 1; i < today24hDatas.length; i++) {
        var timeStmp = today24hDatas[i].fcst_valid;
        for (var j = 0; j < sunrise_sunset_Dates.length; j++) {
          var sunStmp = sunrise_sunset_Dates[j].timeStmp;
          if (lastTimeSetp < sunStmp && timeStmp > sunStmp) {
            var sunData = TodayDetailHeader.createCustomData(
              sunrise_sunset_Dates[j].timeStr,
              "",
              sunrise_sunset_Dates[j].type
            );
            today24hDatas.splice(i, 0, sunData);
          }
          if (j == sunrise_sunset_Dates.length - 1) {
            break;
          }
        }
        lastTimeSetp = timeStmp;
      }
      //Current time insertion
      var currentTemp = dataBlob.conditionsshort.observation.metric.temp;
      var now = TodayDetailHeader.createCustomData(
        "Just now",
        "",
        currentTemp + "°"
      );

      today24hDatas.unshift(now);
      // Various of the following
      var conditionsshort = dataBlob.conditionsshort.observation;
      dataBlob.weatherDetail = [
        sunrise_sunset_Dates[0].timeStr,
        sunrise_sunset_Dates[1].timeStr,
        future10DayDatas[0].night.pop + "%",
        conditionsshort.rh + "%",
        conditionsshort.wdir_cardinal +
          "Per second" +
          conditionsshort.metric.wspd +
          "Meter",
        conditionsshort.metric.feels_like,
        conditionsshort.metric.precip_total + "Millimeter",
        conditionsshort.metric.pressure + "Pressure",
        conditionsshort.metric.vis + "Kilometer",
        conditionsshort.uv_index
      ];

      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(
          dataBlob,
          sectionIDs,
          rowIDs
        ),
        allData: dataBlob
      });
    };
    Utilies.appleAPI.queryWeather(
      this.props.city.lat,
      this.props.city.lon,
      data => {
        reloadIfNeed(data);
      }
    );
  }

  renderRow(rowData, sectionID, rowID) {
    if (rowID == "conditionsshort") {
      return <TodayOverviewCell weatherData={rowData} />;
    }
    if (rowID == "fcstdaily10short") {
      return <FutureWeatherCell weatherData={rowData} />;
    }
    if (rowID == "describe") {
      return <WeatherDescribeCell weatherData={this.state.allData} />;
    }
    if (rowID == "weatherDetail") {
      return <WeatherDetailCell weatherData={rowData} />;
    }
  }
  renderSectionHeader(sectionData, sectionID) {
    if (sectionID == "hidden") {
      return <View style={{ height: 0 }} />;
    }
    if (sectionID == "fcsthourly24short") {
      return <TodayDetailHeader weatherData={sectionData} />;
    }
  }

  onScroll(event) {
    var offsetY = event.nativeEvent.contentOffset.y;
    var opacity = offsetY / Utilies.tempCellHeight;
    if (opacity <= 1) {
      var ratio = 1 - opacity;
      if (ratio >= 1) {
        ratio = 1;
      }
      if (ratio != this.lastRatio) {
        this.refs.titleView.setNativeProps({
          style: { paddingTop: 30 * (ratio + 1) }
        });
        this.refs.temperatureView.setNativeProps({
          style: {
            opacity: ratio > 0.3 ? ratio : 0,
            top: Utilies.titleViewHeight - 50 * (1 - ratio)
          }
        });
      }
      this.lastRatio = ratio;
    }
  }
}
WeatherView.defaultProps = {
  city: null
};
module.exports = WeatherView;
