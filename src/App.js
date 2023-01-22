import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import Geolocation from 'react-native-geolocation-service'
import {CLIENT_ID,CLIENT_SECRET} from '@env';
import axios from 'axios';
import Card from  './Components/Card';
import CustomMarker from './Components/CustomMarker';
import AntD from 'react-native-vector-icons/AntDesign';
import { initialRegion, OUTER_CARD_WIDTH } from './utils/constants';
import { getAnalytics } from "firebase/analytics";
import { ref, get, getDatabase, set, child, onValue } from "firebase/database"
import * as RNLocalize from "react-native-localize";
import { database } from './utils/fire';
import { darkStyle } from './styles/mapStyles';

const initialCords = {
  latitude: 54.6858,
  longitude: 25.2877,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
}
const getDistance =  (lat1, lon1, lat2, lon2, unit) => {
  if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
  }
  else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
          dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
  }
}

 const ExploreScreen = () => {


  
  const [loading, setLoading] = useState(true)

  const [markers, setMarkers] = React.useState([]);
  const [currentLoc, setCurrentLoc] = useState(null);
  const [locations, setLocations] = useState(null)

  const [mapReady, setReady] = useState(false)
  useEffect(() => {
   
     const database1 = database
   const dbRef = ref(database1, `locations` )
//   const auth = getAuth();
// signInAnonymously(auth)
 const country = RNLocalize.getLocales()
 console.log(country)
   onValue(dbRef, (snapshot) => {

    if(snapshot.exists()){

 
     const keys = Object.keys(snapshot.val())
     const payload = []
     keys.map((key) => payload.push(snapshot.val()[key]))
     setLocations(payload)
    }
   
  } ) 
  
  }, []);

  useEffect(() => {

    if(currentLoc && locations){
    for(let loc of locations) {
 
       loc.distance=getDistance(loc.latitude, loc.longitude, currentLoc.latitude, currentLoc.longitude, 'K')
      // console.log((loc.latitude + ' ' + loc.longitude) + 'and' + (location.coords.latitude + ' ' + location.coords.longitude) + 'distance is' + getDistance(loc.latitude, loc.longitude, location.coords.latitude, location.coords.longitude, 'K'))
 
     }
     const sortedDistanceArr = locations.sort((a,b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0))
 
 
     setMarkers(sortedDistanceArr)

     const payload = {
      ...initialCords,
      ...sortedDistanceArr[0]
    }
    _map?.current?.animateToRegion(payload, 1.3 * 1000);
    flatlistRef.current?.scrollToIndex({index: 0, animate: true});
  

     setLoading(false)
    }
 
 }, [currentLoc,locations] )

  let _map = React.useRef(null);
  let flatlistRef = React.useRef(null);
  let mapIndex = useRef(0);
  let scrollAnimation = useRef(new Animated.Value(0)).current;

  useEffect(()=>{
      requestPermission();
  },[])

  useEffect(()=>{
  if(currentLoc && markers?.length>0 && mapReady && _map){
    const payload = {
      ...initialCords,
      ...markers[0]
    }
    _map?.current?.animateToRegion(payload, 1.3 * 1000);
  }
},[currentLoc, markers, mapReady, _map?.current])

  const requestPermission = async () => {
    if (Platform.OS == 'ios') {
      Geolocation.requestAuthorization();
      getCurrentLocation();
    } else {
     const granted = await PermissionsAndroid.request(
       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
     );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) getCurrentLocation();
      else {
        setLoading(false)
        alert('Permission Denied');
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLoc(position.coords)
        
      },
      (error) => {
        alert('Unable to fetch your current location')
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };



  const onMapReady = () => {
    setReady(true)
    if(!markers.length) return;

    if(markers?.length>0){
      const payload = {
        ...initialCords,
        ...markers[0]
      }
      _map?.current?.animateToRegion(payload, 1.3 * 1000);
      return
    }
   
        //  _map.current.animateToRegion({
        //    ...(markers[0] ? markers[0].coordinate : initialRegion),
        //    latitudeDelta: initialRegion.latitudeDelta,
        //    longitudeDelta: initialRegion.longitudeDelta,
        //  });
 
  }

  const onMarkerPress = ({_targetInst : { return : { key : markerID} }}) => {
    // In this case we dont need to animate to region, it happens by default
    mapIndex.current = markerID;
    flatlistRef.current?.scrollToIndex({index: markerID, animate: true});
    const payload = {
      ...initialCords,
      ...markers[markerID]
    }
    _map?.current?.animateToRegion(payload, 1.3 * 1000);
  };

  const onPressLeft = () => {
    if((!mapIndex.current) || (mapIndex.current<0)) return
    let newIndex = parseInt(mapIndex.current) - 1;
    flatlistRef.current?.scrollToIndex({index: newIndex, animate: true});
  }

  const onPressRight = () => {
    if (mapIndex.current >= (markers.length -1)) return;
    let newIndex = parseInt(mapIndex.current) + 1;
    flatlistRef.current?.scrollToIndex({index: newIndex, animate: true});
  }

  const onScroll = (event) => {
    let xDistance = event.nativeEvent.contentOffset.x;
     if ( xDistance % OUTER_CARD_WIDTH ==  0) {        // When scroll ends
       let index = xDistance / OUTER_CARD_WIDTH;
       if (mapIndex.current == index) return;
  
       mapIndex.current = index;
       
       const coordinate = markers[index] && markers[index].coordinate;
   
     }
   
     const index = Math.floor(
      Math.floor(event.nativeEvent.contentOffset.x) /
      Math.floor(event.nativeEvent.layoutMeasurement.width)
  );
  const payload = {
    ...initialCords,
    ...markers[index]
  }
  _map?.current?.animateToRegion(payload, .7 * 1000);
  mapIndex.current = index;
 }

 const _onViewableItemsChanged = React.useCallback(({ viewableItems, changed }) => {

  //console.log("Changed in this iteration, ", changed);
}, []);

  const renderCard = ({item}) => <Card item={item}/>

  const renderMarker = (item, index) => (
    <CustomMarker
      key={index}
      index={index}
      marker={item}
      scrollAnimation={scrollAnimation}
      onMarkerPress={onMarkerPress}
    />
  );

  if(loading) return (
    <View style={styles.loadContainer}>
      <ActivityIndicator size={55} color="#1bbfe0" />
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
     
        initialRegion={initialRegion}
        onMapReady={onMapReady}
        showsUserLocation={true}
        followsUserLocation={false}
        showsMyLocationButton={true}
        style={styles.container}
        customMapStyle={darkStyle}
        provider={PROVIDER_GOOGLE}
        >
        {markers.map(renderMarker)}
      </MapView>
      <View style={styles.outerCard}>
       <TouchableOpacity hitSlop={styles.hitslop} onPress={onPressLeft}  style={styles.left}>
        <AntD name="leftcircle" style={styles.icon}/>
       </TouchableOpacity>
       <Animated.FlatList
    
        initialNumToRender={markers.length}
        ref={flatlistRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={OUTER_CARD_WIDTH}
        snapToAlignment="center"
        keyExtractor={(item, index) => index.toString()}
        style={styles.scrollView}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollAnimation,
                },
              },
            },
          ],
          {useNativeDriver: true, listener: onScroll},
        )}
        data={markers}
        renderItem={renderCard}
       />
       <TouchableOpacity hitSlop={styles.hitslop}  onPress={onPressRight} style={styles.right}>
        <AntD name="rightcircle" style={styles.icon}/>
       </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExploreScreen;
const SplashScreen = () => {
  return <View></View>
}
const styles = StyleSheet.create({

  loadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#037ffc',
  },
  container: {
    flex: 1,
    ...StyleSheet.absoluteFill,
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  outerCard: {
    height: 210,
    width: OUTER_CARD_WIDTH,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
  },
  hitslop: {
    top: 30,
    right: 30,
    left: 30,
    bottom: 30,
  },
  icon: {fontSize: 22, color: 'grey'},
  left: {position: 'absolute', left: 5, zIndex: 10},
  right: {position: 'absolute', right: 5},
});