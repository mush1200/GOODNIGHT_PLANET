import { StyleSheet, View } from 'react-native';

import { dreamVisualAccent } from '../contentVisual';

import { colors, radius } from '../theme/tokens';



type Props = {

  dreamKey?: string;

  nightSkyKey?: string;

  testID?: string;

};



export function MemoryIllustration({ dreamKey, nightSkyKey, testID }: Props) {

  const accent = accentFor(dreamKey, nightSkyKey);

  return (

    <View

      testID={testID ?? 'memory-illustration-slot'}

      accessibilityLabel={dreamVisualAccent(dreamKey, nightSkyKey)}

      style={styles.slot}

    >

      <View style={[styles.hill, { backgroundColor: accent.hill }]} />

      <View style={[styles.star, { backgroundColor: accent.star }]} />

      {nightSkyKey ? (

        <View testID={`memory-illustration-sky-${nightSkyKey}`} style={[styles.skyBand, accent.sky]} />

      ) : null}

    </View>

  );

}



function accentFor(dreamKey?: string, nightSkyKey?: string) {

  const sky =

    nightSkyKey === 'blue_moon'

      ? { backgroundColor: 'rgba(147,197,253,0.18)' }

      : nightSkyKey === 'soft_rain'

        ? { backgroundColor: 'rgba(148,163,184,0.16)' }

        : { backgroundColor: 'rgba(196,181,253,0.12)' };



  switch (dreamKey) {

    case 'rain_city':

      return { hill: 'rgba(148,163,184,0.35)', star: 'rgba(196,181,253,0.5)', sky };

    case 'star_path':

      return { hill: 'rgba(196,181,253,0.28)', star: 'rgba(252,211,138,0.55)', sky };

    case 'train_whisper':

      return { hill: 'rgba(252,211,138,0.2)', star: 'rgba(196,181,253,0.45)', sky };

    case 'lake_mirror':

      return { hill: 'rgba(147,197,253,0.24)', star: 'rgba(134,239,172,0.45)', sky };

    case 'aurora_hint':

      return { hill: 'rgba(134,239,172,0.22)', star: 'rgba(147,197,253,0.5)', sky };

    default:

      return { hill: 'rgba(255,255,255,0.08)', star: colors.accentSoft, sky };

  }

}



const styles = StyleSheet.create({

  slot: {

    height: 120,

    borderRadius: radius.md,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.1)',

    backgroundColor: 'rgba(0,0,0,0.18)',

    overflow: 'hidden',

    justifyContent: 'flex-end',

  },

  hill: {

    height: 56,

    borderTopLeftRadius: 80,

    borderTopRightRadius: 80,

    marginHorizontal: 12,

  },

  star: {

    position: 'absolute',

    top: 22,

    right: 28,

    width: 14,

    height: 14,

    borderRadius: 7,

    opacity: 0.9,

  },

  skyBand: {

    position: 'absolute',

    top: 0,

    left: 0,

    right: 0,

    height: 42,

  },

});


