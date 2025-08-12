// src/screens/main/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import {
  fetchAppointments,
  fetchTrackingRequests,
  selectAppointments,
  selectTrackingRequests,
} from "../../store/slices/servicesSlice";
import { colors, spacing } from "../../styles";
import { SearchBar, DistrictPicker, Card, AppointmentCard, TrackingCard } from "../../components/common";
import QuickActions from "../../components/home/QuickActions";
import { RootState } from "../../store";

export default function HomeScreen({ navigation }) {
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const appointments = useSelector(selectAppointments);
  const trackingRequests = useSelector(selectTrackingRequests);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAppointments(userId));
      dispatch(fetchTrackingRequests(userId));
    }
  }, [userId, dispatch]);

  const handleServiceSearch = () => {
    navigation.navigate("NICReissue");
  };

  return (
    <ScrollView style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search government services..."
        onSubmitEditing={handleServiceSearch}
      />

      <DistrictPicker selectedValue={selectedDistrict} onValueChange={setSelectedDistrict} />

      <QuickActions onTrackPress={() => navigation.navigate("RequestDetails", { id: "TRK12345" })} />

      <Card title="Upcoming Appointments">
        {appointments.length > 0 ? (
          appointments.map((app) => (
            <AppointmentCard
              key={app.id}
              service={app.service}
              date={app.date}
              time={app.time}
              office={app.office}
              onPress={() => navigation.navigate("RequestDetails", { id: app.id })}
            />
          ))
        ) : (
          <AppointmentCard service="No upcoming appointments" date="" time="" office="" />
        )}
      </Card>

      <Card title="Track Requests">
        {trackingRequests.length > 0 ? (
          trackingRequests.map((req) => (
            <TrackingCard
              key={req.id}
              reference={req.id}
              service={req.service}
              status={req.status}
              date={req.date}
              onPress={() => navigation.navigate("RequestDetails", { id: req.id })}
            />
          ))
        ) : (
          <TrackingCard reference="" service="No tracking requests" status="" date="" />
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
});
