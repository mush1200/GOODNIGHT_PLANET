import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VerticalSliceApp } from './src/VerticalSliceApp';

export default function App() {
  return (
    <SafeAreaProvider>
      <VerticalSliceApp />
    </SafeAreaProvider>
  );
}
