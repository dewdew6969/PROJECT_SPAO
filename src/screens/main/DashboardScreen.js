import React, { useContext, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar, Animated, Modal, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import useAppStore from '../../store/useAppStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; // 20 padding left + 20 padding right
const ITEM_SIZE = CARD_WIDTH + 15; // card width + 15 marginRight

export default function DashboardScreen({ navigation }) {
  const { profile, t, language, setSelectedOpponent } = useAppStore();
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [aiFilterModal, setAiFilterModal] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState('5km');
  const [skillFilter, setSkillFilter] = useState('All');
  
  const [opponents, setOpponents] = useState([]);
  const [isLoadingOpponents, setIsLoadingOpponents] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOpponents().then(() => setRefreshing(false));
  }, []);

  const fetchOpponents = async () => {
    if (!profile) return;
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000';
      const queryParams = new URLSearchParams();
      if (profile.latitude !== null && profile.longitude !== null) {
        queryParams.append('lat', profile.latitude);
        queryParams.append('lon', profile.longitude);
      }
      
      const response = await fetch(`${API_URL}/opponents/?${queryParams.toString()}`);
      if (response.ok) {
         const data = await response.json();
         // Filter diri sendiri
         setOpponents(data.filter(u => u.id !== profile.id));
      }
    } catch (err) {
      console.error('Failed to fetch opponents:', err);
    } finally {
      setIsLoadingOpponents(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOpponents();
    }, [profile?.latitude, profile?.longitude])
  );

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  if (!profile) return null; // Cegah crash saat profile direset menjadi null ketika proses logout

  // Calculate win rate
  const winRate = profile.matches > 0 ? Math.round((profile.wins / profile.matches) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={['#0F1522', '#0A0F18']} style={styles.container}>
        <Animated.ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
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
          
          {/* Welcome Header */}
          <View style={styles.welcomeHeader}>
            <TouchableOpacity 
              style={styles.welcomeTextContainer}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}
            >
              <Text style={styles.welcomeText}>{t('welcome')}</Text>
              <Text style={styles.profileName}>{profile.fullName}</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{t('active_player')}</Text>
              </View>
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <TouchableOpacity 
                style={styles.inboxBtn}
                onPress={() => navigation.navigate('ChatList')}
                activeOpacity={0.7}
              >
                <Feather name="message-square" size={24} color="#8A95A5" />
                {/* Optional: Add unread badge here later */}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.avatarWrapper}
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ 
                    uri: (() => {
                      const str = profile?.avatar;
                      if (!str || str === "null") return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                      if (str.includes('gravatar.com') || str.startsWith('file://') || str.startsWith('content://')) return str;
                      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000';
                      try {
                        const urlObj = new URL(str);
                        return `${apiUrl}${urlObj.pathname}${urlObj.search}`;
                      } catch (e) {
                        return str.startsWith('/') ? `${apiUrl}${str}` : `${apiUrl}/${str}`;
                      }
                    })()
                  }} 
                  style={styles.avatarImage} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Stats Card */}
          <LinearGradient 
            colors={['#D4FF00', '#B9DE00']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={styles.heroCard}
          >
            <View style={styles.heroStat}>
              <Text style={styles.heroLabel}>{t('elo_rating')}</Text>
              <Text style={styles.heroValue}>{profile.elo}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroLabel}>{t('win_rate')}</Text>
              <Text style={styles.heroValue}>{winRate}%</Text>
            </View>
          </LinearGradient>

          {/* Secondary Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.miniStatBox}>
              <Text style={styles.miniStatValue}>{profile.matches}</Text>
              <Text style={styles.miniStatLabel}>{t('matches')}</Text>
            </View>
            <View style={styles.miniStatBox}>
              <Text style={[styles.miniStatValue, { color: '#D4FF00' }]}>{profile.wins}</Text>
              <Text style={styles.miniStatLabel}>{t('wins')}</Text>
            </View>
            <View style={styles.miniStatBox}>
              <Text style={[styles.miniStatValue, { color: '#FF6B6B' }]}>{profile.losses}</Text>
              <Text style={styles.miniStatLabel}>{t('losses')}</Text>
            </View>
          </View>

          {/* AI Best Match Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('ai_best_match')}</Text>
            <TouchableOpacity 
              style={styles.aiBadge}
              onPress={() => setAiFilterModal(true)}
            >
              <Feather name="settings" size={14} color="#0F1522" />
              <Text style={styles.aiBadgeText}>{t('ai_settings')}</Text>
            </TouchableOpacity>
          </View>

          <Animated.ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={{ marginHorizontal: -20 }}
            contentContainerStyle={styles.aiScroll}
            snapToInterval={ITEM_SIZE}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false } // Disabled native driver to allow shadow/elevation animation
            )}
          >
            {isLoadingOpponents ? (
              <View style={{ width: CARD_WIDTH, alignItems: 'center', justifyContent: 'center', height: 180 }}>
                <Text style={{ color: '#8A95A5' }}>Loading opponents...</Text>
              </View>
            ) : opponents.length === 0 ? (
              <View style={{ width: CARD_WIDTH, alignItems: 'center', justifyContent: 'center', height: 180 }}>
                <Text style={{ color: '#8A95A5' }}>No opponents found nearby</Text>
              </View>
            ) : opponents.map((match, index) => {
              const rank = { 'BEGINNER': 0, 'INTERMEDIATE': 1, 'ADVANCED': 2, 'EXPERT': 3 };
              const highestLevel = match.primary_level || 'BEGINNER'; // fallback
              const opponentDistance = match.distance !== undefined && match.distance !== null ? `${match.distance} km` : 'Unknown';
              const matchWinRate = match.matches > 0 ? Math.round((match.wins / match.matches) * 100) : 0;
              const inputRange = [
                (index - 1) * ITEM_SIZE,
                index * ITEM_SIZE,
                (index + 1) * ITEM_SIZE,
              ];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.75, 1, 0.75], // Mengecil lebih dramatis
                extrapolate: 'clamp',
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3], // Memudar saat digeser
                extrapolate: 'clamp',
              });

              const shadowOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0, 0.4, 0], // Shadow hilang perlahan saat digeser
                extrapolate: 'clamp',
              });

              const elevation = scrollX.interpolate({
                inputRange,
                outputRange: [0, 15, 0], // Untuk efek shadow di Android
                extrapolate: 'clamp',
              });

              return (
                <Animated.View 
                  key={match.id} 
                  style={[
                    styles.aiMatchCard, 
                    { 
                      width: CARD_WIDTH,
                      transform: [{ scale }], 
                      opacity,
                      shadowOpacity,
                      elevation
                    }
                  ]}
                >
                  <TouchableOpacity 
                    style={styles.aiMatchTop}
                    activeOpacity={0.7}
                    onPress={() => {
                      const fullOpponentData = { ...match, name: match.full_name || match.username, level: highestLevel, distance: opponentDistance, score: match.sportsmanship || '5.0', sports: [match.primary_sport || 'Badminton'] };
                      setSelectedOpponent(fullOpponentData);
                      navigation.navigate('OpponentProfile');
                    }}
                  >
                    <Image source={{ uri: match.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} style={styles.aiAvatar} />
                    <View style={styles.aiMatchDetails}>
                      <Text style={styles.aiMatchName}>{match.full_name || match.username}</Text>
                      <View style={styles.aiMatchBadges}>
                        <View style={styles.eloBadge}>
                          <Text style={styles.eloBadgeText}>ELO {match.elo}</Text>
                        </View>
                        <Text style={styles.rivalText}>• {t(highestLevel.toLowerCase()).toUpperCase()} • {opponentDistance}</Text>
                      </View>
                    </View>
                    <View style={styles.aiMatchScoreBox}>
                      <Text style={styles.aiMatchScore}>{matchWinRate}%</Text>
                      <Text style={styles.aiMatchScoreLabel}>{t('win_rate')}</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.aiMatchActions}>
                    <TouchableOpacity 
                      style={styles.challengeBtn}
                      onPress={() => {
                        const fullOpponentData = { ...match, name: match.full_name || match.username, level: highestLevel, distance: opponentDistance, score: match.sportsmanship || '5.0', sports: [match.primary_sport || 'Badminton'] };
                        setSelectedOpponent(fullOpponentData);
                        navigation.navigate('CreateChallenge');
                      }}
                    >
                      <Text style={styles.challengeBtnText}>{t('send_challenge')}</Text>
                      <Feather name="chevron-right" size={18} color="#0F1522" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.statsBtn}
                      onPress={() => {
                        const fullOpponentData = { ...match, name: match.full_name || match.username, level: highestLevel, distance: opponentDistance, score: match.sportsmanship || '5.0', sports: [match.primary_sport || 'Badminton'] };
                        setSelectedOpponent(fullOpponentData);
                        navigation.navigate('OpponentProfile');
                      }}
                    >
                      <Feather name="bar-chart-2" size={20} color="#E2E8F0" />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              );
            })}
          </Animated.ScrollView>

          {/* Upcoming Tournaments */}
          <Text style={[styles.sectionTitle, { marginTop: 25, marginBottom: 15 }]}>{t('upcoming_tournaments')}</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tournamentsScroll}>
            {[
              {
                id: 1,
                title: 'Sparo National Cup',
                organizer: 'Sparo Official',
                date: 'Dec 15 • Jakarta Arena',
                prize: '$5,000',
                type: t('official'),
                bgColor: '#D4FF00',
                textColor: '#000',
                icon: 'award'
              },
              {
                id: 2,
                title: 'Sudirman Futsal League',
                organizer: 'Sudirman SC (Business)',
                date: 'Nov 20 • Sudirman SC',
                prize: 'Member Voucher',
                type: t('sponsored'),
                bgColor: '#A0BEFF',
                textColor: '#000',
                icon: 'briefcase'
              },
              {
                id: 3,
                title: 'Jakarta Runners Meetup',
                organizer: 'IndoRunners (Verified)',
                date: 'Oct 30 • GBK',
                prize: 'Medals & Gear',
                type: t('community'),
                bgColor: '#FF7676',
                textColor: '#FFF',
                icon: 'users'
              }
            ].map((tourney) => (
              <TouchableOpacity key={tourney.id} style={styles.tournamentCard} activeOpacity={0.8}>
                <LinearGradient 
                  colors={['#1C2433', '#161C26']} 
                  style={styles.tournamentImagePlaceholder}
                >
                  <View style={[styles.openNowBadge, { backgroundColor: tourney.bgColor }]}>
                    <Text style={[styles.openNowText, { color: tourney.textColor }]}>{tourney.type}</Text>
                  </View>
                  <Feather name={tourney.icon} size={48} color="rgba(255,255,255,0.05)" />
                </LinearGradient>
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentTitle} numberOfLines={1}>{tourney.title}</Text>
                  <Text style={styles.tournamentDate}>
                    <Feather name="calendar" size={12} color="#8A95A5" /> {tourney.date}
                  </Text>
                  <Text style={{ color: '#A0BEFF', fontSize: 10, marginTop: 2 }}>{t('by')} {tourney.organizer}</Text>
                  <View style={styles.tournamentFooter}>
                    <Text style={styles.tournamentPrize}>{tourney.prize} {t('prize')}</Text>
                    <Text style={styles.tournamentRegister}>{t('register')} <Feather name="arrow-right" size={12} /></Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ height: 20 }} />
        </Animated.ScrollView>



        {/* AI Filter Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={aiFilterModal}
          onRequestClose={() => setAiFilterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Feather name="cpu" size={20} color="#D4FF00" style={{ marginRight: 10 }} />
                  <Text style={styles.modalTitle}>{t('ai_settings')}</Text>
                </View>
                <TouchableOpacity onPress={() => setAiFilterModal(false)}>
                  <Feather name="x" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>{t('ai_settings_desc')}</Text>

              {/* Distance Filter */}
              <Text style={styles.filterLabel}>{t('maximum_distance')}</Text>
              <View style={styles.filterRow}>
                {[{key: '2km', label: '2km'}, {key: '5km', label: '5km'}, {key: '10km', label: '10km'}, {key: 'Any', label: t('any')}].map((dist) => (
                  <TouchableOpacity 
                    key={dist.key} 
                    style={[styles.filterPill, distanceFilter === dist.key && styles.filterPillActive]}
                    onPress={() => setDistanceFilter(dist.key)}
                  >
                    <Text style={[styles.filterPillText, distanceFilter === dist.key && styles.filterPillTextActive]}>{dist.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Skill Filter */}
              <Text style={[styles.filterLabel, { marginTop: 20 }]}>{t('skill_level')}</Text>
              <View style={styles.filterRow}>
                {[
                  {key: 'All', label: t('any')}, 
                  {key: 'Beginner', label: t('beginner')}, 
                  {key: 'Intermediate', label: t('intermediate')}, 
                  {key: 'Advanced', label: t('advanced')}, 
                  {key: 'Expert', label: t('expert')}
                ].map((skill) => (
                  <TouchableOpacity 
                    key={skill.key} 
                    style={[styles.filterPill, skillFilter === skill.key && styles.filterPillActive]}
                    onPress={() => setSkillFilter(skill.key)}
                  >
                    <Text style={[styles.filterPillText, skillFilter === skill.key && styles.filterPillTextActive]}>{skill.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.applyFilterBtn}
                onPress={() => setAiFilterModal(false)}
              >
                <Text style={styles.applyFilterBtnText}>{t('apply_best_match')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F1522', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 5, paddingBottom: 20 },
  
  // Welcome Header
  welcomeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  welcomeTextContainer: { flex: 1 },
  welcomeText: { fontSize: 14, color: '#8A95A5', marginBottom: 4 },
  profileName: { fontSize: 26, fontWeight: '900', color: '#FFF', letterSpacing: 0.5, marginBottom: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C2433', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#2D3748' },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D4FF00', marginRight: 6 },
  statusText: { fontSize: 11, color: '#C2D0E8', fontWeight: '600' },
  
  avatarWrapper: {
    shadowColor: '#D4FF00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 8,
  },
  inboxBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#1C2433',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarImage: { width: 65, height: 65, borderRadius: 32.5, borderWidth: 2, borderColor: '#D4FF00' },

  // Hero Card
  heroCard: { flexDirection: 'row', borderRadius: 20, padding: 22, marginBottom: 20, alignItems: 'center', shadowColor: '#D4FF00', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 8 },
  heroStat: { flex: 1, alignItems: 'center' },
  heroDivider: { width: 1, height: '90%', backgroundColor: 'rgba(0,0,0,0.15)' },
  heroLabel: { fontSize: 11, color: '#0F1522', fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 6, opacity: 0.8 },
  heroValue: { fontSize: 38, fontWeight: '900', color: '#000', letterSpacing: -1 },

  // Secondary Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  miniStatBox: { width: '31%', backgroundColor: '#161C26', borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: '#2D3748' },
  miniStatValue: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  miniStatLabel: { fontSize: 10, color: '#8A95A5', fontWeight: 'bold', letterSpacing: 1 },

  // AI Match
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', flex: 1, marginRight: 15 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D4FF00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  aiBadgeText: { color: '#0F1522', fontSize: 11, fontWeight: 'bold', marginLeft: 6, letterSpacing: 0.5 },

  aiScroll: { paddingHorizontal: 20, paddingBottom: 15 },
  aiMatchCard: { marginRight: 15, backgroundColor: '#161C26', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#2D3748', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  aiMatchTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  aiAvatar: { width: 55, height: 55, borderRadius: 16, marginRight: 15 },
  aiMatchDetails: { flex: 1 },
  aiMatchName: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
  aiMatchBadges: { flexDirection: 'row', alignItems: 'center' },
  eloBadge: { backgroundColor: '#233045', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 8 },
  eloBadgeText: { color: '#A0BEFF', fontSize: 11, fontWeight: 'bold' },
  rivalText: { color: '#8A95A5', fontSize: 12, fontWeight: '600' },
  aiMatchScoreBox: { alignItems: 'flex-end', backgroundColor: '#1C2433', padding: 8, borderRadius: 10 },
  aiMatchScore: { fontSize: 20, fontWeight: '900', color: '#D4FF00' },
  aiMatchScoreLabel: { fontSize: 8, color: '#8A95A5', marginTop: 2, letterSpacing: 0.5, fontWeight: 'bold' },

  aiMatchActions: { flexDirection: 'row', gap: 12 },
  challengeBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#D4FF00', borderRadius: 12, paddingVertical: 14, justifyContent: 'center', alignItems: 'center' },
  challengeBtnText: { color: '#0F1522', fontSize: 15, fontWeight: 'bold' },
  statsBtn: { backgroundColor: '#233045', width: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2D3748' },

  // Tournaments
  tournamentsScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  tournamentCard: { width: 280, backgroundColor: '#161C26', borderRadius: 18, marginRight: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#2D3748', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  tournamentImagePlaceholder: { height: 130, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  openNowBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, zIndex: 2 },
  openNowText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  tournamentInfo: { padding: 18 },
  tournamentTitle: { fontSize: 18, fontWeight: '900', color: '#FFF', marginBottom: 6 },
  tournamentDate: { fontSize: 12, color: '#8A95A5', marginBottom: 14, fontWeight: '600' },
  tournamentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTopWidth: 1, borderTopColor: '#2D3748' },
  tournamentPrize: { color: '#D4FF00', fontSize: 14, fontWeight: '800' },
  tournamentRegister: { color: '#A0BEFF', fontSize: 13, fontWeight: 'bold' },



  // AI Filter Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#161C26', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, borderWidth: 1, borderColor: '#2D3748' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  modalSubtitle: { fontSize: 13, color: '#8A95A5', marginBottom: 25, lineHeight: 20 },
  
  filterLabel: { fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 12, letterSpacing: 0.5 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#1C2433', borderWidth: 1, borderColor: '#2D3748' },
  filterPillActive: { backgroundColor: '#D4FF00', borderColor: '#D4FF00' },
  filterPillText: { color: '#8A95A5', fontSize: 13, fontWeight: '600' },
  filterPillTextActive: { color: '#0F1522', fontWeight: 'bold' },

  applyFilterBtn: { backgroundColor: '#D4FF00', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 35, marginBottom: 10 },
  applyFilterBtnText: { color: '#0F1522', fontSize: 16, fontWeight: 'bold' }
});
