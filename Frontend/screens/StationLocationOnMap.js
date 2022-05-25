import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSelector } from "react-redux";
import { selectOrigin } from "../slices/navSlice";

import { SafeAreaView } from "react-native-safe-area-context";
import { getGlobalState, setGlobalState } from "../globals/global";
import Constants from "expo-constants";
import MarkerComponent from '../components/Marker'; 
import { useIsFocused } from "@react-navigation/native";
import { useBackButton } from "../hocs/backButtonHandler";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");
const mapDelta = 0.007;

const StationLocationOnMap = ({ navigation }) => {
  const [region, setRegion] = useState({
    longitude: 0,
    latitude: 0,
    longitudeDelta: mapDelta,
    latitudeDelta: mapDelta,
  });
  const [initialPosition, setInitialPosition] = useState({
    latitude: 0,
    longitude: 0,
    longitudeDelta: mapDelta,
    latitudeDelta: mapDelta,
  })
  useBackButton(() => {navigation.goBack(); return true;});
  
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const origin = useSelector(selectOrigin);
  useEffect(() => {
    if(!isFocused) return;
    setInitialPosition({
      longitude: getGlobalState("stationChangeMode")?.coordinates?.longitude || origin?.location?.longitude,
      latitude: getGlobalState("stationChangeMode")?.coordinates?.latitude || origin?.location?.latitude,
      longitudeDelta: mapDelta,
      latitudeDelta: mapDelta,
    })
    setRegion(initialPosition);
    setLoading(false);
  },[isFocused]);
  const pressStationBack = (station) => {
    setGlobalState("stationChangeModeActive", true);
    const data = {
      ...getGlobalState("stationChangeMode"),
    }

    if(region.latitude !== 0 && region.longitude !== 0) {
      data.coordinates = {
        latitude: region.latitude,
        longitude: region.longitude,
      }
    }
    setGlobalState("stationChangeMode", data);
    navigation.navigate("Edit Station");
  };
  const changeRegion = (region) => {
    setRegion(region);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.mainContainer, styles.containerProps]}>
          <>
            <View style={styles.mapContainer}>
              {/*Render our MapView*/}
              {
                loading === false ? (
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    showsUserLocation={true}
                    zoomEnable={true}
                    toolbarEnabled={true}
                    showsMyLocationButton={true}
                    initialRegion={initialPosition}
                    onRegionChange={changeRegion}
                  />
                ) : (<Text>"Loading..."</Text>)
              }
            </View>
            <View style={styles.markerFixed}>
              <MarkerComponent style={styles.marker} onPress={() => setModalVisible(true)} />
              {/* <Image style={styles.marker} source={marker} /> */}
            </View>
          </>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onStartShouldSetResponder={() => true}
        // on
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirm location</Text>

            <View style={{flexDirection: "row", width, alignItems: "center", justifyContent: "center"}}>

              <TouchableOpacity
               accessible={true}
               activeOpacity={0.5}
                style={[styles.button, styles.buttonClose]}
                onPress={pressStationBack}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
              accessible={true}
              activeOpacity={0.5}
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    top: "40%"
  },
  markerFixed: {
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
    top: "50%",
  },
  marker: {
    height: 48,
    width: 48,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
  },
  mainView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#0A1613",
    alignItems: "center",
    justifyContent: "center",
  },

  headerContainer: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },
  scrollView: {
    paddingTop: 10,
  },
  mainContainer: {
    backgroundColor: "#0A1613",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  containerProps: {
    width,
    alignItems: "center",
    justifyContent: "center",
  },

  locationButton: {
    bottom: 10,
  },

  
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 700,
    borderRadius: 20,
  
  },
  
  
  modalView: {    
    backgroundColor: "#182724",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    bottom: 0,
    margin: 0,
    flex: 1, 
    paddingTop:  20

  },
  
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginRight:10,
    width: 150,

  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#16a085",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

  modalText: {
    marginBottom: 20,
    color: "white",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "center",
    borderBottomColor: "white",
    borderBottomWidth: 2,
    width,
  },

 
});

export default StationLocationOnMap;
