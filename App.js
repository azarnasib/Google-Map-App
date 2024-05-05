import react from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/Screens/HomeScreen/Home.screen";

function App() {
   const stack=createNativeStackNavigator();
   const MainNavigator=()=>{
    return (
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.screen
        name="Home"
        component={HomeScreen}
        
        />



      </Stack.Navigator>
    )
   }
   return (
    <NavigationContainer>
      <HomeScreen/>
    </NavigationContainer>
   )

}

export default App;