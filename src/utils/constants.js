import { Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const OUTER_CARD_HEIGHT = 220;
export const OUTER_CARD_WIDTH = width;

export const INNER_CARD_HEIGHT = 250
export const INNER_CARD_WIDTH = width * 0.8;

export const initialRegion = {
  latitude: 54.6858,
  longitude: 25.2877,
  latitudeDelta: 0.04864195044303443,
  longitudeDelta: 0.040142817690068,
};