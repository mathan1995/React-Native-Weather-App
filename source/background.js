"use strict";

import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";

class BackgroundView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("./../assets/hello1.jpg")}
          style={{ flex: 1, width: null }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

module.exports = BackgroundView;
