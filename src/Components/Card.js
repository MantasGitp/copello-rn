import React, {memo} from 'react';
import {Rating} from 'react-native-ratings';
import FastImage from 'react-native-fast-image';
import {StyleSheet, Text, View} from 'react-native';
import {
  INNER_CARD_HEIGHT,
  INNER_CARD_WIDTH,
  OUTER_CARD_HEIGHT,
  OUTER_CARD_WIDTH,
} from '../utils/constants';
import AntD from 'react-native-vector-icons/AntDesign';
const Card = ({item}) => (
  <View style={styles.outerCard}>
    <View style={styles.innerCard}>
      {!item?.hasOwnProperty('image') ? (
        <View style={styles.noView}>
            <Text style={{...styles.noTxt, fontSize:11, marginBottom:2}} numberOfLines={2}>
          📷
         
          </Text>
          <Text style={styles.noTxt} numberOfLines={2}>
          
           Nėra foto 
          </Text>
        </View>
      ) : (
        <FastImage
          source={{
            uri: image,
          }}
          style={styles.img}
          resizeMode={FastImage.resizeMode.stretch}
        />
      )}
      <View style={styles.right}>
        <View style={{...styles.top, justifyContent:'space-between'}}>
          <View style={{display: 'flex', flexDirection:'row', alignItems:'center'}}>
      
       <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
       <View style={{
          backgroundColor: '#F0DFFF', borderRadius:50, padding:5
         }}>
         <AntD name="clockcircle" style={{
            fontSize:12, color: '#36d1aa'
          }} />
         </View>
       <Text style={{ fontFamily: 'Montserrat-SemiBold', color:'#dadada', fontSize:12}}> {item.startingTime.slice(5) }</Text>
       </View>

       <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginLeft:10}}>
       <View style={{
          backgroundColor: '#F0DFFF', borderRadius:50, padding:5
         }}>
         <AntD name="calculator" style={{
            fontSize:12, color: '#36d1aa'
          }} />
         </View>
       <Text style={{ fontFamily: 'Montserrat-SemiBold', color:'#dadada', fontSize:12}}> {item.distance.toFixed(2) +' km' }</Text>
       </View>
      
          </View>


          <Text numberOfLines={2} style={{...styles.name, marginTop:5, paddingBottom:5, marginBottom:0}}>
          {item.address}
        
          </Text>
        </View>
        <View style={styles.bottom}>
          <View style={styles.rating}>
            <Rating
           tintColor ="rgba(80, 39, 245, 0.9)"
           readonly
              ratingCount={5}
              type="bell"
          
              startingValue={item.reliability/2 || 0}
              imageSize={14}
            />
          
          </View>
          <Text numberOfLines={2} style={styles.status}>
            <Text style={styles.black}>{item?.details}</Text>
          </Text>
        
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  outerCard: {
    flex: 1,
    height: OUTER_CARD_HEIGHT,
    width: OUTER_CARD_WIDTH,
    paddingHorizontal: 10,
   
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  innerCard: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: 'rgba(80, 39, 245, 0.9)',
    borderRadius: 30,

    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: INNER_CARD_HEIGHT,
    width: INNER_CARD_WIDTH,
    overflow: 'hidden',
    elevation: 6,
    padding: 10,
    paddingLeft: 0,
  },
  img: {height: '100%', width: '33%', borderRadius: 6},
  noView: {
    height: '100%',
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 24, 28, 0.9)',
    borderRadius: 5
  },
  noTxt: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'grey',
    textAlign: 'center',
  },
  right: {flex: 1, paddingLeft: 10},
  top: {
 
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
    padding:15,
  paddingBottom:0,
    paddingLeft: 0
  },
  name: {fontFamily: 'Montserrat-SemiBold', fontSize: 14.5, color: '#fafafa'},
  bottom: {flex: 1, alignItems: 'flex-start'},
  rating: {
    backgroundColor:'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    width:'100%',
    height:'50%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  ratingTxt: {
    backgroundColor:'transparent',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12.5,
    marginLeft: 5,
    color: 'rgb(33,186,69)',
  },
  status: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    color: 'grey',
    marginVertical:1
  },
  black: {color: 'black'},
});

export default memo(Card);
