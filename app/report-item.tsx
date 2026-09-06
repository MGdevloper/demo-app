import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSavedUser } from '../authentication.config.js';
import { createLostFoundItem } from '../services/itemService.js';

type ItemType = 'lost' | 'found';

const categories = [
  'Electronics',
  'Documents / ID Card',
  'Wallet / Money',
  'Keys',
  'Bags',
  'Clothing',
  'Accessories',
  'Other',
];

export default function ReportItemScreen() {
  const params = useLocalSearchParams<{ type?: string | string[] }>();
  const type: ItemType = params.type === 'found' ? 'found' : 'lost';
  const [itemName, setItemName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [date, setDate] = React.useState('');
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formatDate = (selectedDate: Date) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (event.type === 'set' && selectedDate) {
      setDate(formatDate(selectedDate));
    }
  };

  const submitReport = async () => {
    if (!itemName.trim() || !category || !description.trim() || !location.trim() || !date.trim()) {
      Alert.alert('Incomplete form', 'Please complete every field before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await getSavedUser();

      if (!user?.email) {
        throw new Error('Your session could not be found. Please log in again.');
      }

      await createLostFoundItem({
        itemName: itemName.trim(),
        type,
        category,
        description: description.trim(),
        location: location.trim(),
        date: date.trim(),
        reportedBy: user.email,
        reporterName: user.name || user.email,
        reporterPhoto: user.picture || '',
        status: 'active',
      });

      Alert.alert(
        'Report submitted',
        `Your ${type} item has been added to the campus board.`,
        [{ text: 'OK', onPress: () => router.replace('/home') }],
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit your report.';
      Alert.alert('Submission failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        style={styles.keyboardView}
      >
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111111" />
          </Pressable>
          <Text style={styles.topBarTitle}>{type === 'lost' ? 'REPORT LOST ITEM' : 'REPORT FOUND ITEM'}</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.eyebrow}>{type === 'lost' ? 'LOST & FOUND' : 'CAMPUS COMMUNITY'}</Text>
          <Text style={styles.title}>{type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}</Text>
          <Text style={styles.subtitle}>Add clear details so the right person can identify it.</Text>

          <Text style={styles.label}>Item Name</Text>
          <TextInput
            placeholder="e.g. Black wallet"
            placeholderTextColor="#999999"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryList}>
            {categories.map((option) => (
              <Pressable
                key={option}
                onPress={() => setCategory(option)}
                style={[styles.categoryChip, category === option && styles.selectedChip]}
              >
                <Text style={[styles.categoryText, category === option && styles.selectedChipText]}>{option}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Describe the item and any identifying details"
            placeholderTextColor="#999999"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            placeholder="e.g. CHARUSAT Canteen"
            placeholderTextColor="#999999"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />

          <Text style={styles.label}>Date</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Choose report date"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInput}
            >
              <Text style={date ? styles.dateText : styles.datePlaceholder}>{date || 'Choose a date'}</Text>
              <Ionicons name="calendar-outline" size={21} color="#0a7ea4" />
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={date ? new Date(`${date}T12:00:00`) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}

          <Pressable disabled={isSubmitting} onPress={submitReport} style={[styles.submitButton, isSubmitting && styles.disabledButton]}>
            <Text style={styles.submitText}>{isSubmitting ? 'Submitting...' : 'Submit Report'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  keyboardView: { flex: 1 },
  topBar: {
    height: 76,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: { width: 42, height: 42, justifyContent: 'center' },
  topBarTitle: { color: '#111111', fontSize: 14, fontWeight: '800', letterSpacing: 1.2 },
  content: { padding: 28, paddingBottom: 180 },
  eyebrow: { marginBottom: 12, color: '#0a7ea4', fontSize: 12, fontWeight: '700', letterSpacing: 1.4 },
  title: { color: '#111111', fontSize: 30, fontWeight: '700' },
  subtitle: { marginTop: 10, marginBottom: 30, color: '#666666', fontSize: 15, lineHeight: 21 },
  label: { marginTop: 18, marginBottom: 8, color: '#222222', fontSize: 14, fontWeight: '700' },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 6,
    color: '#111111',
    fontSize: 15,
    backgroundColor: '#ffffff',
  },
  dateInput: {
    minHeight: 50,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  dateText: { color: '#111111', fontSize: 15 },
  datePlaceholder: { color: '#999999', fontSize: 15 },
  textArea: { minHeight: 110, paddingTop: 14, textAlignVertical: 'top' },
  categoryList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#d8d8d8', borderRadius: 5 },
  selectedChip: { borderColor: '#0a7ea4', backgroundColor: '#e8f5f8' },
  categoryText: { color: '#555555', fontSize: 13 },
  selectedChipText: { color: '#0a617e', fontWeight: '700' },
  submitButton: { marginTop: 32, paddingVertical: 15, alignItems: 'center', borderRadius: 6, backgroundColor: '#111111' },
  disabledButton: { opacity: 0.55 },
  submitText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});