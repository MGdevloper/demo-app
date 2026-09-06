import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { subscribeToItem } from '../services/itemService.js';

export default function ItemDetailsScreen() {
  const params = useLocalSearchParams();
  const itemId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [item, setItem] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => {
    if (!itemId) {
      setIsLoading(false);
      setErrorMessage('This item could not be found.');
      return undefined;
    }

    const unsubscribe = subscribeToItem(
      itemId,
      (nextItem) => {
        setItem(nextItem);
        setIsLoading(false);
        setErrorMessage(nextItem ? null : 'This item is no longer available.');
      },
      () => {
        setIsLoading(false);
        setErrorMessage('Unable to load this item. Please try again.');
      },
    );

    return unsubscribe;
  }, [itemId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </Pressable>
        <Text style={styles.topBarTitle}>ITEM DETAILS</Text>
        <View style={styles.iconButton} />
      </View>

      {isLoading && (
        <View style={styles.stateContainer}>
          <ActivityIndicator color="#0a7ea4" />
          <Text style={styles.stateText}>Loading item...</Text>
        </View>
      )}

      {!isLoading && errorMessage && (
        <View style={styles.stateContainer}>
          <Ionicons name="alert-circle-outline" size={34} color="#b42318" />
          <Text style={styles.stateText}>{errorMessage}</Text>
          <Pressable onPress={() => router.back()} style={styles.backToItemsButton}>
            <Text style={styles.backToItemsText}>Back to items</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !errorMessage && item && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headingRow}>
            <View style={[styles.typeBadge, item.type === 'lost' ? styles.lostBadge : styles.foundBadge]}>
              <Text style={[styles.typeText, item.type === 'lost' ? styles.lostText : styles.foundText]}>
                {item.type.toUpperCase()}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{item.status || 'Active'}</Text>
            </View>
          </View>

          <Text style={styles.title}>{item.itemName}</Text>
          <Text style={styles.category}>{item.category}</Text>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>DESCRIPTION</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>REPORT INFORMATION</Text>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#0a7ea4" />
              <View style={styles.infoCopy}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{item.location}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#0a7ea4" />
              <View style={styles.infoCopy}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{item.date}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>REPORTED BY</Text>
            <View style={styles.reporterRow}>
              {item.reporterPhoto ? (
                <Image source={{ uri: item.reporterPhoto }} style={styles.reporterPhoto} />
              ) : (
                <Ionicons name="person-circle-outline" size={46} color="#777777" />
              )}
              <View style={styles.reporterCopy}>
                <Text style={styles.reporterName}>{item.reporterName}</Text>
                <Text style={styles.reporterEmail}>{item.reportedBy}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topBar: {
    height: 76,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  iconButton: { width: 42, height: 42, justifyContent: 'center' },
  topBarTitle: { color: '#111111', fontSize: 14, fontWeight: '800', letterSpacing: 1.2 },
  content: { padding: 28, paddingBottom: 44 },
  headingRow: { alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4 },
  lostBadge: { backgroundColor: '#fff1f0' },
  foundBadge: { backgroundColor: '#edf8f2' },
  typeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.7 },
  lostText: { color: '#b42318' },
  foundText: { color: '#237a57' },
  statusBadge: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#237a57' },
  statusText: { color: '#237a57', fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
  title: { marginTop: 22, color: '#111111', fontSize: 32, fontWeight: '700' },
  category: { marginTop: 7, color: '#777777', fontSize: 15 },
  infoSection: { marginTop: 36, paddingTop: 18, borderTopWidth: 1, borderTopColor: '#eeeeee' },
  sectionTitle: { marginBottom: 14, color: '#0a7ea4', fontSize: 12, fontWeight: '700', letterSpacing: 1.3 },
  description: { color: '#333333', fontSize: 16, lineHeight: 24 },
  infoRow: { marginBottom: 18, alignItems: 'center', flexDirection: 'row', gap: 13 },
  infoCopy: { flex: 1 },
  infoLabel: { color: '#777777', fontSize: 12 },
  infoValue: { marginTop: 3, color: '#222222', fontSize: 16 },
  reporterRow: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  reporterPhoto: { width: 46, height: 46, borderRadius: 23 },
  reporterCopy: { flex: 1 },
  reporterName: { color: '#222222', fontSize: 16, fontWeight: '600' },
  reporterEmail: { marginTop: 4, color: '#777777', fontSize: 14 },
  stateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12 },
  stateText: { color: '#777777', fontSize: 15, textAlign: 'center' },
  backToItemsButton: { marginTop: 8, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 5, backgroundColor: '#111111' },
  backToItemsText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});