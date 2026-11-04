import { StyleSheet, Text, View } from 'react-native';
import { ClassicOrb, Orb } from 'react-native-magic-orb';

export default function App() {
  return (
    <View style={styles.container}>
      <Orb colors={['#00F5FF', '#9D00FF', '#FF00C8']} size={260} />
      <Text style={styles.label}>Orb</Text>
      <ClassicOrb colors={['#00F5FF', '#9D00FF', '#FF00C8']} size={260} />
      <Text style={styles.label}>ClassicOrb</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    gap: 4,
  },
  label: {
    color: '#8b8f9c',
    fontSize: 13,
    marginBottom: 16,
  },
});
