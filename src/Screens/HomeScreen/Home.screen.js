import react, { useEffect, useRef, useState } from "react";
import {View, Text, ActivityIndicator, StyleSheet, Pressable, TouchableOpacity} from "react-native";
import MapView, {Marker} from "react-native-maps";
import { fetchPlaces, fetchPlacesByCategory } from "../../utils/api";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { RNGestureHandlerModule } from 'react-native-gesture-handler';
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Image } from "react-native";
import { Modalize } from "react-native-modalize"


const Home = () => {
  const getIconName = (category) => {
    switch (category) {
      case "school":
        return "school-outline";
      case "restaurant":
        return "restaurant-outline";
      case "cocktails":
        return "wine-outline";
      case "hair dresser":
        return "cut-outline";
      case "library":
        return "library-outline";
      case "park":
      return  "park-outline";
      case "museum":
        return "museum-outline"
      default:
        return "ellipsis-horizontal-outline";
    }
  };

  const [placesData, setPlacesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
   const [photo,setPhoto]=useState("")  ;
   const [data,setData]=useState([])
  const [photos,setPhotos]=useState([]);
  const categories = ["school", "restaurant", "cocktails", "hair dresser",  "library", "park", "hotel"];
  const { width } = Dimensions.get("window");
  const modalizeRef=useRef(null);
   const[placesByCategory, setPLacesByCategory]=useState("");
   const[selectedItem, setSelectedItem]=useState(null);
 
   const fetchPlaces = async (category) => {
    try {
      const response = await fetchPlacesByCategory(category);
      setPlacesData(response.results);
      setLoading(false);
      const data = response.results.map((res)=>{
        return res.photos
        })
        setPhotos(data)
      setData(response.result.map(place=>`${place.name}: ${place.vicinity}`));
    } catch (error) {
      console.log("Something went wrong", error);
      // alert(JSON.stringify(category))

      setLoading(false);
    }
  };
   useEffect(() => {
   fetchPlaces(selectedCategory);
  }, [selectedCategory]);

    const handleCategoryPress=(category)=>{
      setSelectedCategory(category);
      fetchPlaces(category);
              //alert(JSON.stringify(category))

    }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <View style={{ position: 'absolute', zIndex: 10 }}>
        
          <FlatList
            horizontal
            data={categories}
            contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 15}}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  width: 120,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: "center",
                  borderWidth: 1,
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  marginHorizontal: 5,
                  marginVertical: 5,
                  height: 60,
                  marginBottom: 50,
                  borderRadius: 10,
                  backgroundColor: selectedCategory === item ? 'blue' : 'white',
                 
                }}
                onPress={() =>handleCategoryPress(item)}
              >
                 {item === 'park' ? <MaterialIcons name='park' size={24} color='black' /> : 
                 item === 'hotel' ? <MaterialIcons name='hotel' size={24} color='black' /> :
                 <Icon name={getIconName(item)} size={20} color="black" />}

                <Text>{item}</Text>
              </Pressable>
            )}
          />
          
        </View>
      )}
  
  <MapView
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 25.3960,
    longitude: 68.3578,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  }}
>
  <View style={{ flex: 1 }}>
    {placesData.map((place, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        }}
        title={place.name}
        description={place.vicinity}
      />
    ))}
  </View>
  
</MapView>

  
{/* <SafeAreaView style={styles.listContainer}> */}
<FlatList
      style={{ position: "absolute", bottom: 0 }}
      horizontal
      data={placesData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
       
        <TouchableOpacity
        onPress={() => {
          setSelectedItem(item);
         if (item.photos && item.photos.length>0 && item.photos [0].photo_reference) {setPhoto(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=AIzaSyD4Is2PW3mxKJLhsdB2d02OETJSIkcPhpY`);
           } else {
            setPhoto ('')
           }
          modalizeRef.current.open();
        }}
      >
        {setData(data?.results)}
      
      
  
       <View style={styles.itemContainer}>
          { item?.photos?.length>0?
          <Image
            style={styles.image}
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=AIzaSyD4Is2PW3mxKJLhsdB2d02OETJSIkcPhpY`
            }}
          />
          :
          null
          }
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>{item.vicinity}</Text>
              
            </View>
            </TouchableOpacity>
          )}
         
        />
              <Modalize
        ref={modalizeRef}
        modalStyle={{
          backgroundColor: 'white',
          borderTopLeftRadius: 30,
          
          borderTopRightRadius: 30,
        }}
        modalHeight={Dimensions.get('screen').height / 1.5}
        handlePosition="outside" >
          <View>
          <Image
          style={styles.photo}
           source={{
            uri:photo
           }}
      
      />
        {selectedItem && (
          <View>
          <Text style={{
            fontSize: 30,
            
          }}>{selectedItem.name}</Text>
          <Text>{selectedItem.vicinity}</Text>
          </View>

        )}
          </View>
      </Modalize>
        
      {/* </SafeAreaView> */}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 20,
    position:"absolute",
    zIndex: 10,
    bottom: 0,
    

    
    
  },
  itemContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "white",
    marginTop: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 1,
    alignSelf: "center",
    width: 160,
    height: 300,
    borderRadius: 10,
    marginBottom:20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemName: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
    color: "#333",
    textAlign: 'center', 
  },
  itemDescription: {
    textAlign: 'center', 
  },

  image: {
    height: 100,
    
    width: "100%",
   

  },

  photo: {
    height:300,
    width:"100%",
    justifyContent:"center"
  }
  
});


export default Home;