import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Event {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  selected?: boolean;
}

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        setHasPermission(false);
        return;
      }

      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars[0];

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);

        const eventsList = await Calendar.getEventsAsync(
          [defaultCalendar.id],
          startDate,
          endDate
        );

        setEvents(eventsList.map(event => ({
          id: event.id,
          title: event.title,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          selected: false,
        })));
      }
    })();
  }, []);

  const toggleEventSelection = (id: string) => {
    setEvents(currentEvents =>
      currentEvents.map(event =>
        event.id === id ? { ...event, selected: !event.selected } : event
      )
    );
  };

  const handleCreateAlarms = () => {
    const selectedEvents = events.filter(event => event.selected);
    // Here you would typically pass the selected events to create alarms
    // For now, we'll just navigate back to the alarms screen
    router.push('/alarms');
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Calendar Events</Text>
        <Text style={styles.noPermission}>
          Calendar functionality is not available on web platforms.
        </Text>
      </SafeAreaView>
    );
  }

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Calendar Events</Text>
        <Text style={styles.noPermission}>
          Please grant calendar permissions to use this feature.
        </Text>
      </SafeAreaView>
    );
  }

  const selectedCount = events.filter(event => event.selected).length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Calendar Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.eventCard, item.selected && styles.selectedCard]}
            onPress={() => toggleEventSelection(item.id)}
          >
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              {item.selected && (
                <View style={styles.selectedIndicator}>
                  <Clock size={16} color="#007AFF" />
                </View>
              )}
            </View>
            <Text style={styles.eventTime}>
              {format(item.startDate, 'MMM d, h:mm a')} - {format(item.endDate, 'h:mm a')}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
      {selectedCount > 0 && (
        <TouchableOpacity style={styles.createAlarmsButton} onPress={handleCreateAlarms}>
          <Text style={styles.createAlarmsText}>
            Create {selectedCount} Alarm{selectedCount !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 34,
    fontFamily: 'Inter_700Bold',
    color: '#000',
    padding: 16,
  },
  listContent: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#F0F8FF',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    flex: 1,
  },
  eventTime: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginTop: 4,
  },
  selectedIndicator: {
    marginLeft: 8,
  },
  noPermission: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  createAlarmsButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createAlarmsText: {
    color: '#FFF',
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
});