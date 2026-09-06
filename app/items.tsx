import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { subscribeToActiveItems } from '../services/itemService.js';

type ItemFilter = 'all' | 'lost' | 'found';

type LostFoundItem = {
  id: string;
  itemName: string;
  type: 'lost' | 'found';
  category: string;
  location: string;
  date: string;
  reporterName: string;
  reporterPhoto?: string;
  createdAt?: number;
};

const filters: { label: string; value: ItemFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Lost', value: 'lost' },
  { label: 'Found', value: 'found' },
];

export default function ItemsScreen() {
  const [items, setItems] = React.useState<LostFoundItem[]>([]);
  const [activeFilter, setActiveFilter] = React.useState<ItemFilter>('all');
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribe = subscribeToActiveItems(
      (nextItems: LostFoundItem[]) => {
        setItems(nextItems);
        setIsLoading(false);
        setErrorMessage(null);
      },
      () => {
        setIsLoading(false);
        setErrorMessage('Unable to load campus reports. Please try again.');
      },
    );

    return unsubscribe;
  }, []);

  const visibleItems = activeFilter === 'all'
    ? items
    : items.filter((item) => item.type === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </Pressable>
        <Text style={styles.topBarTitle}>CAMPUS ITEMS</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>LOST & FOUND</Text>
        <Text style={styles.title}>Browse All Items</Text>
        <Text style={styles.subtitle}>See the latest active reports from campus.</Text>

        <View style={styles.filterBar}>
          {filters.map((filter) => (
            <Pressable
              key={filter.value}
              onPress={() => setActiveFilter(filter.value)}
              style={[styles.filterButton, activeFilter === filter.value && styles.activeFilter]}
            >
              <Text style={[styles.filterText, activeFilter === filter.value && styles.activeFilterText]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading && (
          <View style={styles.stateContainer}>
            <ActivityIndicator color="#0a7ea4" />
            <Text style={styles.stateText}>Loading reports...</Text>
          </View>
        )}

        {!isLoading && errorMessage && (
          <View style={styles.stateContainer}>
            <Ionicons name="cloud-offline-outline" size={32} color="#b42318" />
            <Text style={styles.stateText}>{errorMessage}</Text>
          </View>
        )}

        {!isLoading && !errorMessage && visibleItems.length === 0 && (
          <View style={styles.stateContainer}>
            <Ionicons name="file-tray-outline" size={32} color="#777777" />
            <Text style={styles.stateText}>No active reports found.</Text>
          </View>
        )}

        {!isLoading && !errorMessage && visibleItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push(`/item-details?id=${item.id}`)}
            style={styles.itemCard}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.typeBadge, item.type === 'lost' ? styles.lostBadge : styles.foundBadge]}>
                <Text style={[styles.typeBadgeText, item.type === 'lost' ? styles.lostBadgeText : styles.foundBadgeText]}>
                  {item.type.toUpperCase()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </View>
            <Text style={styles.itemName}>{item.itemName}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={16} color="#777777" />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.reporter}>
                {item.reporterPhoto ? (
                  <Image source={{ uri: item.reporterPhoto }} style={styles.reporterPhoto} />
                ) : (
                  <Ionicons name="person-circle-outline" size={18} color="#777777" />
                )}
                <Text style={styles.reporterName} numberOfLines={1}>{item.reporterName}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
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
  content: { padding: 24, paddingBottom: 40 },
  eyebrow: { marginBottom: 10, color: '#0a7ea4', fontSize: 12, fontWeight: '700', letterSpacing: 1.4 },
  title: { color: '#111111', fontSize: 30, fontWeight: '700' },
  subtitle: { marginTop: 10, color: '#666666', fontSize: 15 },
  filterBar: { marginTop: 28, marginBottom: 20, flexDirection: 'row', gap: 8 },
  filterButton: { paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: '#d8d8d8', borderRadius: 5 },
  activeFilter: { borderColor: '#111111', backgroundColor: '#111111' },
  filterText: { color: '#555555', fontSize: 14, fontWeight: '600' },
  activeFilterText: { color: '#ffffff' },
  stateContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 70, gap: 12 },
  stateText: { color: '#777777', fontSize: 15, textAlign: 'center' },
  itemCard: { marginBottom: 14, padding: 17, borderWidth: 1, borderColor: '#e1e1e1', borderRadius: 8, backgroundColor: '#ffffff', elevation: 1 },
  cardHeader: { alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' },
  typeBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 4 },
  lostBadge: { backgroundColor: '#fff1f0' },
  foundBadge: { backgroundColor: '#edf8f2' },
  typeBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  lostBadgeText: { color: '#b42318' },
  foundBadgeText: { color: '#237a57' },
  itemName: { marginTop: 14, color: '#111111', fontSize: 19, fontWeight: '700' },
  category: { marginTop: 5, color: '#777777', fontSize: 14 },
  metaRow: { marginTop: 14, alignItems: 'center', flexDirection: 'row', gap: 6 },
  metaText: { color: '#555555', fontSize: 14, flex: 1 },
  cardFooter: { marginTop: 16, paddingTop: 12, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eeeeee' },
  date: { color: '#777777', fontSize: 13 },
  reporter: { maxWidth: '55%', alignItems: 'center', flexDirection: 'row', gap: 5 },
  reporterPhoto: { width: 20, height: 20, borderRadius: 10 },
  reporterName: { color: '#555555', fontSize: 12 },
});