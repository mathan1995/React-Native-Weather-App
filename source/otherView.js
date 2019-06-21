"use strict";

import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Utilies from "./utilies";

// City name and weather
class TitleView extends Component {
  render() {
    return (
      <View style={[titleStyles.bgView, { paddingTop: 100 }]} ref={"titleView"}>
        <Text style={[titleStyles.cityName, { fontSize: 30 }]}>
          {this.props.cityName}
        </Text>
        <Text style={[titleStyles.cityName, { fontSize: 15 }]}>
          {this.props.weatherType}
        </Text>
      </View>
    );
  }
  setNativeProps(value) {
    this.refs.titleView.setNativeProps(value);
  }
}
const titleStyles = StyleSheet.create({
  bgView: {
    height: Utilies.titleViewHeight,
    backgroundColor: "rgba(0,0,0,0)",
    alignItems: "center"
  },
  cityName: {
    color: "white",
    marginBottom: 4
  }
});
TitleView.defaultProps = {
  cityName: "",
  weatherType: ""
};

//  Today's temperature
class TemperatureView extends Component {
  render() {
    return (
      <View
        ref={"temperature"}
        style={[
          temperature.container,
          { opacity: 1.0, top: Utilies.titleViewHeight }
        ]}
      >
        <Text style={temperature.temperature}>
          <Text style={{ height: 150, width: 150 }}>
            {Utilies.iconImage(this.props.iconType)}{" "}
          </Text>
          {this.props.temperature}°
        </Text>
      </View>
    );
  }
  setNativeProps(value) {
    this.refs.temperature.setNativeProps(value);
  }
}
TemperatureView.defaultProps = {
  temperature: "-"
};
const temperature = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0
  },
  temperature: {
    color: "white",
    fontSize: 100,
    fontWeight: "100",
    backgroundColor: Utilies.clearColor,
    paddingTop: 10
  }
});

//
// Lower tool bar
class BottomToolBar extends Component {
  render() {
    var pageText = () => {
      var text = "";
      for (var i = 0; i < this.props.pageCount; i++) {
        text += i == this.props.selectIndex ? "●" : "○";
      }
      return text;
    };
    return (
      <View style={bottomBar.container}>
        <TouchableOpacity onPress={this.props.onPressLeft}>
          <Image
            source={require("./../assets/weatherIcon.png")}
            style={bottomBar.logoIcon}
          />
        </TouchableOpacity>
        <Text style={bottomBar.pageControl}>{pageText()}</Text>
        <TouchableOpacity onPress={this.props.onPressRight}>
          <Image
            source={require("./../assets/menu.png")}
            style={bottomBar.logoIcon}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
const bottomBar = StyleSheet.create({
  container: {
    height: 40,
    borderTopWidth: Utilies.lineWidth,
    borderTopColor: Utilies.lineColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10
  },
  logoIcon: {
    width: 30,
    height: 30,
    resizeMode: "cover"
  },
  pageControl: {
    textAlign: "center",
    color: "white",
    fontSize: 12
  }
});
BottomToolBar.defaultProps = {
  onPressLeft: () => {},
  onPressRight: () => {},
  pageCount: 0,
  selectIndex: 0
};

module.exports = {
  TitleView,
  BottomToolBar,
  TemperatureView
};
