import axios from "axios";

const API_KEY = "AIzaSyD4Is2PW3mxKJLhsdB2d02OETJSIkcPhpY"; 

export const fetchPlacesByCategory = async (category) => {
 
  const API_URL = ` https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=25.3960,68.3578&radius=5000&&key=AIzaSyD4Is2PW3mxKJLhsdB2d02OETJSIkcPhpY&type=${category}` 
  //alert(JSON.stringify(category))
  try {
    const response = await axios.get(API_URL);
    return response.data;
    
  } catch (error) {
    //alert(JSON.stringify(category))

    console.log("Something went wrong", error);
    throw error;
  }
};
