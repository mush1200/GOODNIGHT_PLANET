import { StyleSheet, View } from 'react-native';

import { nightSkyAssetSceneForKey } from '../theme/nightSkyAssets';

import { nightSkyThemeForKey } from '../theme/nightSkyTheme';



type Props = {

  nightSkyKey?: string;

  glowColor?: string;

  testID?: string;

};



export function NightSkyBackdrop({ nightSkyKey, glowColor, testID }: Props) {

  const theme = nightSkyThemeForKey(nightSkyKey ?? 'clear_star');

  const scene = nightSkyAssetSceneForKey(nightSkyKey ?? 'clear_star');



  return (

    <View

      testID={testID ?? 'night-sky-backdrop'}

      pointerEvents="none"

      style={[

        StyleSheet.absoluteFillObject,

        {

          backgroundColor: theme.bottom,

        },

      ]}

    >

      <View

        style={[

          styles.topGlow,

          {

            backgroundColor: theme.top,

            opacity: 0.92,

          },

        ]}

      />

      <View

        testID={`night-sky-asset-${scene.assetId}`}

        style={[

          styles.horizonGlow,

          { backgroundColor: glowColor ?? theme.glow },

        ]}

      />

      <View testID={`night-sky-scene-${nightSkyKey ?? 'clear_star'}`} style={styles.scene}>

        {scene.layers.includes('stars') ? <View testID="night-sky-layer-stars" style={styles.stars} /> : null}

        {scene.layers.includes('rain') ? <View testID="night-sky-layer-rain" style={styles.rain} /> : null}

        {scene.layers.includes('moon') ? <View testID="night-sky-layer-moon" style={styles.moon} /> : null}

        {scene.layers.includes('horizon') ? (

          <View testID="night-sky-layer-horizon" style={styles.horizon} />

        ) : null}

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  topGlow: {

    ...StyleSheet.absoluteFillObject,

  },

  horizonGlow: {

    position: 'absolute',

    left: '8%',

    right: '8%',

    bottom: '18%',

    height: '28%',

    borderRadius: 999,

    opacity: 0.85,

  },

  scene: {

    ...StyleSheet.absoluteFillObject,

  },

  stars: {

    position: 'absolute',

    top: '12%',

    left: '18%',

    width: 6,

    height: 6,

    borderRadius: 3,

    backgroundColor: 'rgba(255,255,255,0.75)',

  },

  rain: {

    position: 'absolute',

    top: '10%',

    right: '22%',

    width: 2,

    height: 48,

    backgroundColor: 'rgba(148,163,184,0.45)',

  },

  moon: {

    position: 'absolute',

    top: '14%',

    right: '16%',

    width: 28,

    height: 28,

    borderRadius: 14,

    backgroundColor: 'rgba(147,197,253,0.55)',

  },

  horizon: {

    position: 'absolute',

    left: 0,

    right: 0,

    bottom: '12%',

    height: 64,

    backgroundColor: 'rgba(0,0,0,0.18)',

    borderTopLeftRadius: 120,

    borderTopRightRadius: 120,

  },

});


