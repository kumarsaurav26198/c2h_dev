import React, { useEffect, useRef } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon, { Icons } from './src/components/Icons';
import * as colors from './src/assets/css/Colors';
import { img_url } from './src/config/Constants';
import * as Animatable from 'react-native-animatable';

/* Screens */
import Splash from './src/views/Splash';
import Dashboard from './src/views/Dashboard';
import LoginHome from './src/views/LoginHome';
import Faq from './src/views/Faq';
import FaqCategories from './src/views/FaqCategories';
import FaqDetails from './src/views/FaqDetails';
import PrivacyPolicies from './src/views/PrivacyPolicies';
import Otp from './src/views/Otp';
import DoctorList from './src/views/DoctorList';
import Hospital from './src/views/Hospital';
import CheckPhone  from './src/views/CheckPhone';
import CreatePassword  from './src/views/CreatePassword';
import Password  from './src/views/Password';
import DoctorCategories from './src/views/DoctorCategories';
import MyOrders from './src/views/MyOrders';
import TermsAndConditions from './src/views/TermsAndConditions';
import More from './src/views/More';
import CreateAppointment from './src/views/CreateAppointment';
import PharmCart from './src/views/PharmCart';
import Register from './src/views/Register';
import LocationEnable from './src/views/LocationEnable';
import AppointmentDetails from './src/views/AppointmentDetails';
import MyAppointments from './src/views/MyAppointments';
import PaymentMethods from './src/views/PaymentMethods';
import SelectCurrentLocation from './src/views/SelectCurrentLocation';
import CurrentLocation from './src/views/CurrentLocation';
import AddressList from './src/views/AddressList';
import AddAddress from './src/views/AddAddress';
import Profile from './src/views/Profile';
import LabOrders from './src/views/LabOrders';
import MyOnlineConsultations from './src/views/MyOnlineConsultations';
import MyOrderHistories from './src/views/MyOrderHistories';
import VideoCall from './src/views/VideoCall';
import PromoCode from './src/views/PromoCode';
import Pharmacies from './src/views/Pharmacies';
import PharmCategories from './src/views/PharmCategories';
import PharmProducts from './src/views/PharmProducts';
import PharmProductDetails from './src/views/PharmProductDetails';
import DoctorSearch from './src/views/DoctorSearch';
import HospitalSearch from './src/views/HospitalSearch';
import PharmacySearch from './src/views/PharmacySearch';
import OrderRating from './src/views/OrderRating';
import ConsultationRating from './src/views/ConsultationRating';
import AppointmentRating from './src/views/AppointmentRating';
import Lab from './src/views/Lab';
import LabDetails from './src/views/LabDetails';
import PackageDetail from './src/views/PackageDetail';
import Packages from './src/views/Packages';
import PatientDetails from './src/views/PatientDetails';
import LabCart from './src/views/LabCart';
import LabOrderDetails from './src/views/LabOrderDetails';
import UploadPrescription from './src/views/UploadPrescription';
import Notifications from './src/views/Notifications';
import NotificationDetails from './src/views/NotificationDetails';
import Blog from './src/views/Blog';
import BlogDetails from './src/views/BlogDetails';
import ViewPrescription from './src/views/ViewPrescription';
import HospitalDetails from './src/views/HospitalDetails';
import Chat from './src/views/Chat';
import PillsReminder from './src/views/PillsReminder';
import TodayReminder from './src/views/TodayReminder';
import ConfirmReminder from './src/views/ConfirmReminder';
import LabSearch from './src/views/LabSearch';
import DoctorProfile from './src/views/DoctorProfile'; 
import ViewList from './src/views/ViewList';
import UploadDoctorPrescription from './src/views/UploadDoctorPrescription'; 
import DoctorChat from './src/views/DoctorChat'; 

const forFade = ({ current, next }) => {
  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: { opacity },
  };
};
const TabArr = [
  { route: 'Dashboard', label: 'Home', type: Icons.Feather, icon: 'home', component: Dashboard, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'MyOrders', label: 'MyOrders', type: Icons.Feather, icon: 'file-text', component: MyOrders, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'Blog', label: 'Blog', type: Icons.Feather, icon: 'list', component: Blog, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'More', label: 'More', type: Icons.FontAwesome, icon: 'user-circle-o', component: More, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
];

const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);

  useEffect(() => {
    if (focused) { // 0.3: { scale: .7 }, 0.5: { scale: .3 }, 0.8: { scale: .7 },
      viewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
      textViewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
    } else {
      viewRef.current.animate({ 0: { scale: 1, }, 1: { scale: 0, } });
      textViewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 1 : 0.65}]}>
      <View>
        <Animatable.View
          ref={viewRef}
          style={[StyleSheet.absoluteFillObject, { backgroundColor: item.color, borderRadius: 16 }]} />
        <View style={[styles.btn, { backgroundColor: focused ? null : item.alphaClr }]}>
          <Icon type={item.type} name={item.icon} color={focused ? colors.theme_fg_three : colors.grey} />
          <Animatable.View
            ref={textViewRef}>
            {focused && <Text style={{
              color: colors.theme_fg_three, paddingHorizontal: 8
            }}>{item.label}</Text>}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 16
        }
      }}
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen key={index} name={item.route} component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />
            }}
          />
        )
      })}
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" options={{headerShown: false}} >
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} options={{ title: 'Select Payment Mode' }} />
      <Stack.Screen name="OrderRating" component={OrderRating} options={{headerShown: false}} />
      <Stack.Screen name="HospitalDetails" component={HospitalDetails} options={{ title: 'Hospital Details' }} />
      <Stack.Screen name="ViewList" component={ViewList} options={({ route }) => ({ title: route.params.title })} />
      <Stack.Screen name="ConsultationRating" component={ConsultationRating} options={{headerShown: false}} />
      <Stack.Screen name="AppointmentRating" component={AppointmentRating} options={{headerShown: false}} />
      <Stack.Screen name="LabCart" component={LabCart} options={{ title: 'Cart' }} />
      <Stack.Screen name="PharmacySearch" component={PharmacySearch} options={{headerShown: false}} />
      <Stack.Screen name="HospitalSearch" component={HospitalSearch} options={{headerShown: false}} />
      <Stack.Screen name="FaqDetails" component={FaqDetails} options={{ title: 'Faq Details' }} />
      <Stack.Screen name="DoctorSearch" component={DoctorSearch} options={{headerShown: false}} />
      <Stack.Screen name="LabSearch" component={LabSearch} options={{headerShown: false}} />
      <Stack.Screen name="Hospital" component={Hospital} options={{ title: 'Hospitals' }} />
      <Stack.Screen name="Pharmacies" component={Pharmacies} options={{ title: 'Nearest Pharmacies' }} />
      <Stack.Screen name="PharmCategories" component={PharmCategories} options={({ route }) => ({ title: route.params.vendor_name })} />
      <Stack.Screen name="PharmProducts" component={PharmProducts} options={({ route }) => ({ title: route.params.sub_category_name })} />
      <Stack.Screen name="PharmProductDetails" component={PharmProductDetails} options={{headerShown: false}} />
      <Stack.Screen name="FaqCategories" component={FaqCategories} options={{ title: 'Faq Categories' }} />
      <Stack.Screen name="Faq" component={Faq} options={{ title: 'Faq' }}  />
      <Stack.Screen name="MyAppointments" component={MyAppointments} options={{ title: 'My Appointments' }}  />
      <Stack.Screen name="Home" component={TabNavigator}  options={{headerShown: false}} />
      <Stack.Screen name="LoginHome" component={LoginHome} options={{headerShown: false}} />
      <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}} />
      <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}} />
      <Stack.Screen name="DoctorList" component={DoctorList} options={{ title: 'Find your doctor' }} />
      <Stack.Screen name="CheckPhone" component={CheckPhone} options={{ title: 'Enter your phone number' }} />
      <Stack.Screen name="CreatePassword" component={CreatePassword} options={{headerShown: false}} />
      <Stack.Screen name="Password" component={Password} options={{headerShown: false}} />
      <Stack.Screen name="PrivacyPolicies" component={PrivacyPolicies} options={{ title: 'Privacy Policies' }} />
      <Stack.Screen name="DoctorCategories" component={DoctorCategories} options={{ title: 'Common Symptoms' }} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} options={{ title: 'Terms and Conditions' }} />
      <Stack.Screen name="CreateAppointment" component={CreateAppointment} options={{ title: 'Create Appointment' }} />
      <Stack.Screen name="PharmCart" component={PharmCart} options={{ title: 'Cart' }} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} options={{headerShown: false}} />
      <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
      <Stack.Screen name="LocationEnable" component={LocationEnable} options={{ title: 'Location Enable' }} />
      <Stack.Screen name="SelectCurrentLocation" component={SelectCurrentLocation} options={{ title: 'Pick your Location' }} />
      <Stack.Screen name="CurrentLocation" component={CurrentLocation} options={{ headerShown: false }} />
      <Stack.Screen name="AddressList" component={AddressList} options={{ title: 'Address List' }} />
      <Stack.Screen name="AddAddress" component={AddAddress} options={{ title: 'Add Address' }} />
      <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
      <Stack.Screen name="LabOrders" component={LabOrders} options={{ title: 'My Lab Tests' }} />
      <Stack.Screen name="MyOnlineConsultations" component={MyOnlineConsultations} options={{ title: 'My Consultations' }} />
      <Stack.Screen name="MyOrderHistories" component={MyOrderHistories} options={{ title: 'My Orders' }} />
      <Stack.Screen name="VideoCall" component={VideoCall} options={{ headerShown: false }} />
      <Stack.Screen name="PromoCode" component={PromoCode} options={{ title: 'Apply Promo Code' }} />
      <Stack.Screen name="Lab" component={Lab} options={{ title: 'Laboratories' }} />
      <Stack.Screen name="LabDetails" component={LabDetails} options={{headerShown: false}}/>
      <Stack.Screen name="PackageDetail" component={PackageDetail}  options={({ route }) => ({ title: route.params.package_name })}  />
      <Stack.Screen name="Packages" component={Packages} options={{ title: 'Select what you need...' }} />
      <Stack.Screen name="PatientDetails" component={PatientDetails} />
      <Stack.Screen name="LabOrderDetails" component={LabOrderDetails} options={{ title: 'Lab Order Details' }}/>
      <Stack.Screen name="UploadPrescription" component={UploadPrescription} options={{ title: 'Upload Prescription' }} />
      <Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Notifications' }} />
      <Stack.Screen name="NotificationDetails" component={NotificationDetails} options={{ title: '' }} />
      <Stack.Screen name="BlogDetails" component={BlogDetails} options={{ title: '' }} />
      <Stack.Screen name="ViewPrescription" component={ViewPrescription} options={{ title: 'View Prescription' }} />
      <Stack.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />
      <Stack.Screen name="PillsReminder" component={PillsReminder} options={{ title: 'Pills Reminder' }} />
      <Stack.Screen name="TodayReminder" component={TodayReminder} options={{ title: 'Today Reminders' }} />
      <Stack.Screen name="ConfirmReminder" component={ConfirmReminder} options={{ title: 'Confirm Reminder' }} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfile} options={{ title: 'Doctor Profile' }} /> 
      <Stack.Screen name="UploadDoctorPrescription" component={UploadDoctorPrescription} options={{ title: 'Upload Doctor Prescription' }} /> 
      <Stack.Screen name="DoctorChat" component={DoctorChat} options={{ title: 'Chat with doctor' }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  }
})

export default App;