import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { styles } from '../components/tabs/alarms';

interface Alarm {
  id: string;
  title: string;
  time: string;
  days: string[];
}

const STORAGE_KEY = '@alarms';

const DEFAULT_ALARMS: Alarm[] = [
  {
    id: '1',
    title: 'Team Meeting',
    time: '10:00 AM',
    days: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: '2',
    title: 'Daily Standup',
    time: '9:30 AM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
];


export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Load alarms from storage
  useEffect(() => {
    loadAlarms();
  }, []);

  // Handle new alarms when they arrive
  useEffect(() => {
    console.log('newAlarms params:', params.newAlarms); // Add this line
    if (params.newAlarms) {
      try {
        const newAlarms = JSON.parse(params.newAlarms as string) as Alarm[];
        addNewAlarms(newAlarms);
      } catch (error) {
        console.error('Error parsing new alarms:', error);
        Alert.alert('Error', 'Failed to add new alarms');
      }
    }
  }, [params.newAlarms]);

  const addNewAlarms = async (newAlarms: Alarm[]) => {
    try {
      const updatedAlarms = [...alarms, ...newAlarms];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlarms));
      setAlarms(updatedAlarms);
      Alert.alert('Success', 'Alarms have been created successfully');
    } catch (error) {
      console.error('Error adding new alarms:', error);
      Alert.alert('Error', 'Failed to add new alarms');
    }
  };

  const loadAlarms = async () => {
    try {
      const storedAlarms = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedAlarms === null) {
        // First time: Initialize with default alarms
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ALARMS));
        setAlarms(DEFAULT_ALARMS);
      } else {
        setAlarms(JSON.parse(storedAlarms));
      }
    } catch (error) {
      console.error('Error loading alarms:', error);
      Alert.alert('Error', 'Failed to load alarms');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAlarm = async (id: string) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlarms));
              setAlarms(updatedAlarms);
            } catch (error) {
              console.error('Error deleting alarm:', error);
              Alert.alert('Error', 'Failed to delete alarm');
            }
          }
        },
      ],
    );
  };

  const handleAddFromEvents = () => {
    router.push('/');
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Alarms</Text>
        <Text style={styles.noPermission}>
          Alarm functionality is not available on web platforms.
        </Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Alarms</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading alarms...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Alarms</Text>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.alarmCard}>
            <View style={styles.alarmInfo}>
              <Text style={styles.alarmTime}>{item.time}</Text>
              <Text style={styles.alarmTitle}>{item.title}</Text>
              <View style={styles.daysContainer}>
                {item.days.map((day, index) => (
                  <Text key={index} style={styles.dayPill}>
                    {day}
                  </Text>
                ))}
              </View>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deleteAlarm(item.id)}
            >
              <Trash2 size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No alarms set</Text>
            <Text style={styles.emptySubtext}>Add alarms from your calendar events</Text>
          </View>
        }
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddFromEvents}
      >
        <Text style={styles.addButtonText}>Add Alarm from Events</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}