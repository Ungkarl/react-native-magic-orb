import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ClassicOrb, Orb } from 'react-native-magic-orb';
import type { ReactNode } from 'react';

const SIZE = 170;

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.demo}>
      {children}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default function App() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.grid}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Demo label="3 colors">
        <Orb colors={['#00F5FF', '#9D00FF', '#FF00C8']} size={SIZE} />
      </Demo>
      <Demo label="2 colors">
        <Orb colors={['#FF512F', '#DD2476']} size={SIZE} />
      </Demo>
      <Demo label="5 colors">
        <Orb
          colors={['#00F5FF', '#2B6CFF', '#9D00FF', '#FF00C8', '#FFB800']}
          size={SIZE}
        />
      </Demo>
      <Demo label='color="#7c3aed"'>
        <Orb color="#7c3aed" size={SIZE} />
      </Demo>
      <Demo label="hueShift={30}">
        <Orb colorScheme="aurora" hueShift={30} size={SIZE} />
      </Demo>
      <Demo label="intensity={5} noiseScale={9}">
        <Orb colorScheme="synthwave" intensity={5} noiseScale={9} size={SIZE} />
      </Demo>
      <Demo label="ClassicOrb">
        <ClassicOrb colors={['#00F5FF', '#9D00FF', '#FF00C8']} size={SIZE} />
      </Demo>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  demo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#8b8f9c',
    fontSize: 12,
    marginTop: -6,
  },
});
