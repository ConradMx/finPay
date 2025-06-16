import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useAssets } from "expo-asset";
import { ResizeMode, Video } from 'expo-av';
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";



export default function Index() {
  const [assets] = useAssets([require('@/assets/videos/intro.mp4')])

  return (
    <View
      style={styles.container}
    >
      {assets && (

        <Video
          resizeMode={ResizeMode.COVER}
          isMuted
          isLooping
          shouldPlay
          source={{ uri: assets[0].uri }} style={styles.video} />
      )}

      <View style={{ padding: 20, marginTop: 80 }}>
        <Text style={styles.header}>Ready to change the way you money?</Text>
      </View>
      <View style={styles.buttons}>
        <Link href={'/login'} style=
          {[defaultStyles.pillButton,
          { flex: 1, backgroundColor: Colors.dark }]}
          asChild>
          <TouchableOpacity>
            <Text style=
              {{
                color: 'white',
                fontSize: 22, fontWeight: '500'
              }}>Login in</Text>
          </TouchableOpacity>
        </Link>
        <Link href={'/signup'} style=
          {[defaultStyles.pillButton,
          { flex: 1, backgroundColor: 'white' }]}
          asChild>
          <TouchableOpacity>
            <Text style=
              {{
                fontSize: 22, fontWeight: '500'
              }}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  header: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    textTransform: 'uppercase'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
    marginBottom: 60,
  }
})