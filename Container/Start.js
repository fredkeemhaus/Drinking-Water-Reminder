import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Button,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import styled from "styled-components";
import BaseHeader from "../Component/BaseHeader";
import { Entypo } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import _ from "lodash";
import moment from "moment";
import uuid from "react-native-uuid";
// import schedule from "node-schedule";

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Actions } from "react-native-router-flux";

const Container = styled.ScrollView`
  padding: 0 20px;
`;

const SpaceBetweenTouch = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
  padding: 24px 0;
`;

const SpaceBetweenView = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px;
`;

const BoldText = styled.Text`
  font-family: "NanumSquareBold";
  font-size: 18px;
`;

const RegularText = styled.Text`
  font-family: "NanumSquareRegular";
  font-size: 18px;
`;

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true
    };
  }
});

const Start = () => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isWakeUpTime, setWakeUpTime] = useState(null);
  const [isSleepTime, setSleepTime] = useState(null);
  const [isType, setType] = useState(-1);
  const [isRecordDrink, setRecordDrink] = useState([]);

  useEffect(() => {
    // Permission for iOS
    if (isEnabled) {
      Permissions.getAsync(Permissions.NOTIFICATIONS)
        .then(statusObj => {
          // Check if we already have permission
          if (statusObj.status !== "granted") {
            // If permission is not there, ask for the same
            return Permissions.askAsync(Permissions.NOTIFICATIONS);
          }
          return statusObj;
        })
        .then(statusObj => {
          // If permission is still not given throw error
          if (statusObj.status !== "granted") {
            throw new Error("Permission not granted");
          }
        })
        .catch(err => {
          return null;
        });
    }
  }, []);

  useEffect(() => {
    const isCheckPermission = async () => {
      try {
        const result = await AsyncStorage.getItem("switchEnabled");
        console.log(result, "-");
        setIsEnabled(JSON.parse(result));
      } catch (e) {
        console.log(e);
      }
    };

    isCheckPermission();
  }, []);

  useEffect(() => {
    // AsyncStorage.removeItem("isWakeUp");
    const isCheckWakeUpTime = async () => {
      try {
        const result = await AsyncStorage.getItem("isWakeUp");
        console.log(result);
        if (!_.isNil(result)) {
          setWakeUpTime(JSON.parse(result));
        }
      } catch (e) {
        console.log(e);
      }
    };

    const isCheckSleepTime = async () => {
      try {
        const result = await AsyncStorage.getItem("isSleep");
        if (!_.isNil(result)) {
          setSleepTime(JSON.parse(result));
        }
      } catch (e) {
        console.log(e);
      }
    };

    isCheckWakeUpTime();
    isCheckSleepTime();
  }, []);

  const triggerLocalNotificationHandler = async () => {
    // console.log(isWakeUpTime, isSleepTime, "---");
    // const now = moment().format("HH:mm");
    // if (!_.isNil(isWakeUpTime)) {
    //   for (let i = parseInt(isWakeUpTime); i < parseInt(isSleepTime); i++) {
    //     if (i > parseInt(now)) {
    //       console.log(i);
    //       setInterval(() => {
    //         Notifications.scheduleNotificationAsync({
    //           content: {
    //             title: "????????? ???????????????.",
    //             body: "???????????????. ?????? ?????? ?????? ????????? ???????????? ????"
    //           },
    //           trigger: {
    //             seconds: 1
    //             // repeats: true
    //           }
    //         });
    //       }, 1000 * 10);
    //     }
    //   }
    // }
    // schedule.scheduleJob("10 * * * *", () => {
    //   console.log(1);
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "????????? ???????????????.",
    //     body: "???????????????. ?????? ?????? ?????? ????????? ???????????? ????"
    //   },
    //   trigger: {
    //     seconds: 1
    //   }
    // });
    // await agenda.every("*/3 * * * *", "delete old users");
    // const nextTriggerDate = await Notifications.getNextTriggerDateAsync({
    //   hour: 9,
    //   minute: 0,
    // });
  };

  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);

    await setNotiSwitch();
  };

  const setNotiSwitch = async () => {
    try {
      await AsyncStorage.setItem("switchEnabled", JSON.stringify(!isEnabled));
    } catch (e) {
      console.log(e);
    }
  };

  const showDatePicker = type => {
    setTimePickerVisibility(true);
    setType(type);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = time => {
    hideTimePicker();

    if (!isType) {
      setWakeUpTime(moment(time).format("HH:mm"));
    } else {
      setSleepTime(moment(time).format("HH:mm"));
    }
  };

  const isSaveTime = async () => {
    try {
      if (_.isNil(isWakeUpTime)) {
        return Alert.alert("?????? ????????? ??????????????????.");
      } else if (_.isNil(isSaveTime)) {
        return Alert.alert("?????? ????????? ??????????????????.");
      }
      await AsyncStorage.setItem("isWakeUp", JSON.stringify(isWakeUpTime));
      await AsyncStorage.setItem("isSleep", JSON.stringify(isSleepTime));
      Alert.alert("????????? ?????????????????????.");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BaseHeader title={"?????? ??????"} closed />
      <Container>
        <SpaceBetweenTouch onPress={() => Actions.push("userInfo")}>
          <BoldText>????????? ??????</BoldText>
          <Entypo name="chevron-small-right" size={24} color="black" />
        </SpaceBetweenTouch>
        <SpaceBetweenTouch>
          <BoldText>?????? ??????&nbsp;&nbsp;????</BoldText>
        </SpaceBetweenTouch>
        <SpaceBetweenView>
          <BoldText>??????</BoldText>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </SpaceBetweenView>
        {isEnabled ? (
          <>
            <SpaceBetweenView>
              <BoldText>?????? ?????? ??????</BoldText>
              <TouchableOpacity onPress={() => showDatePicker(0)}>
                {_.isNil(isWakeUpTime) ? (
                  <BoldText style={{ color: "#81b0ff" }}>??????</BoldText>
                ) : (
                  <BoldText>{isWakeUpTime}</BoldText>
                )}
              </TouchableOpacity>
            </SpaceBetweenView>
            <SpaceBetweenView>
              <BoldText>?????? ?????? ????</BoldText>
              <TouchableOpacity onPress={() => showDatePicker(1)}>
                {_.isNil(isSleepTime) ? (
                  <BoldText style={{ color: "#81b0ff" }}>??????</BoldText>
                ) : (
                  <BoldText>{isSleepTime}</BoldText>
                )}
              </TouchableOpacity>
            </SpaceBetweenView>
            <SpaceBetweenView>
              <BoldText>?????? ?????? ???</BoldText>
              <BoldText>??????</BoldText>
            </SpaceBetweenView>
            <View
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Button
                title="????????? ????????? ????????? ????????????."
                onPress={triggerLocalNotificationHandler}
              />
              <View style={{ marginTop: 10 }}>
                <RegularText style={{ fontSize: 12 }}>
                  ????????? ?????? ????????????, ???????????? ????????? ??????????????????.
                </RegularText>
              </View>
            </View>
          </>
        ) : (
          <View
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                marginTop: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderStyle: "dashed",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <RegularText style={{ fontSize: 14 }}>
                ????????? ?????? ????????? ??? ?????? ????????? ?????????...&nbsp;&nbsp;
              </RegularText>
              <RegularText style={{ fontSize: 14 }}>????</RegularText>
            </View>
          </View>
        )}
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideTimePicker}
        />
      </Container>
      <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={() => isSaveTime()}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            backgroundColor: "#81b0ff",
            borderRadius: 8
          }}
        >
          <BoldText style={{ color: "#f5dd4b" }}>??????</BoldText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Start;
