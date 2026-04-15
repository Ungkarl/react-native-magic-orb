import { StyleSheet, View } from 'react-native';
import { Orb } from 'react-native-magic-orb';

export default function App() {
  return (
    <View style={styles.container}>
      <Orb colors={['#00F5FF', '#9D00FF', '#FF00C8']} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
});
