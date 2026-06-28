import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, Platform, StatusBar, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import useAppStore from '../../store/useAppStore';

export default function LeaderboardScreen() {
  const { t, language } = useAppStore();
  const [activeTab, setActiveTab] = useState('global');
  const leaderboardData = [
    { rank: 1, name: 'Samsudin', rating: 1540, winRate: '80%' },
    { rank: 2, name: 'Alex', rating: 1420, winRate: '75%' },
    { rank: 3, name: 'Budi', rating: 1390, winRate: '70%' },
    { rank: 4, name: 'Citra', rating: 1350, winRate: '68%' },
    { rank: 5, name: 'Dina', rating: 1200, winRate: '60%' },
  ];

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={['#0F1522', '#0A0F18']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('leaderboard')}</Text>
        </View>

        <View style={styles.tabs}>
          <Text style={styles.tabActive}>City</Text>
          <Text style={styles.tab}>Province</Text>
          <Text style={styles.tab}>National</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 0.5 }]}>#</Text>
          <Text style={[styles.th, { flex: 2 }]}>Player</Text>
          <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>{t('elo_rating')}</Text>
          <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>{t('win_rate')}</Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#D4FF00"
              colors={['#D4FF00']}
              progressBackgroundColor="#161C26"
            />
          }
        >
          {leaderboardData.map((item) => (
            <View key={item.rank} style={styles.row}>
              <Text style={[styles.tdRank, { flex: 0.5 }]}>{item.rank}</Text>
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.avatarMini}>
                  <Feather name="user" size={14} color="#8A95A5" />
                </View>
                <Text style={styles.tdName}>{item.name}</Text>
              </View>
              <Text style={[styles.tdRating, { flex: 1 }]}>{item.rating}</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>{item.winRate}</Text>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F1522' },
  container: { flex: 1 },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, marginHorizontal: 20, backgroundColor: '#1C2433', borderRadius: 12, marginBottom: 20 },
  tabActive: { color: '#D4FF00', fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 15, backgroundColor: '#2D3748', borderRadius: 8 },
  tab: { color: '#8A95A5', paddingVertical: 5, paddingHorizontal: 15 },
  tableHeader: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#2D3748', marginBottom: 10 },
  th: { fontWeight: 'bold', color: '#5C677D', fontSize: 12, textTransform: 'uppercase' },
  row: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1C2433' },
  tdRank: { color: '#8A95A5', fontWeight: 'bold', fontSize: 16 },
  avatarMini: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2D3748', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  tdName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  tdRating: { color: '#D4FF00', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  td: { color: '#C2D0E8' }
});
