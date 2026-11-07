import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { C, styles as ui } from '../components/CalculatorUI';

const TOOLS = [
  { title: 'কংক্রিট ক্যালকুলেটর', description: 'সিমেন্ট, বালু ও খোয়ার পরিমাণ হিসাব', route: '/tools/concrete' as const },
  { title: 'ইটের গাথুনি', description: 'ইট, সিমেন্ট ও বালুর পরিমাণ হিসাব', route: '/tools/brick' as const },
  { title: 'রডের ওজন', description: 'ডায়ামিটার ও দৈর্ঘ্য অনুযায়ী ওজন হিসাব', route: '/tools/steel' as const },
];

export default function IndexPage() {
  return (
    <SafeAreaView style={[ui.container, home.safe]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content"/>
      <ScrollView contentContainerStyle={home.content} showsVerticalScrollIndicator={false}>
        <View style={home.intro}>
          <Text style={home.eyebrow}>CONSTRUCTION TOOLS</Text>
          <Text style={home.title}>সব টুল</Text>
          <Text style={home.subtitle}>আপনার প্রয়োজনীয় কনস্ট্রাকশন ক্যালকুলেটর বেছে নিন।</Text>
        </View>
        <View style={home.list}>
          {TOOLS.map((tool) => (
            <TouchableOpacity key={tool.route} style={home.card} activeOpacity={0.82} onPress={() => router.push(tool.route)}>
              <View style={home.cardText}>
                <Text style={home.cardTitle}>{tool.title}</Text>
                <Text style={home.cardDescription}>{tool.description}</Text>
              </View>
              <Text style={home.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={home.note}>নতুন টুলস যোগ হলে সেগুলোও এই তালিকায় দেখা যাবে।</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const home = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 34, paddingBottom: 40 },
  intro: { paddingBottom: 24 },
  eyebrow: { color: C.primaryDark, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 9 },
  title: { color: C.textPrimary, fontSize: 30, fontWeight: '900', letterSpacing: -0.6 },
  subtitle: { color: C.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 8 },
  list: { gap: 12 },
  card: { minHeight: 86, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, paddingHorizontal: 18, paddingVertical: 16, ...({ shadowColor: '#9A6700', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 9, elevation: 2 }) },
  cardText: { flex: 1 },
  cardTitle: { color: C.textPrimary, fontSize: 15, fontWeight: '800' },
  cardDescription: { color: C.textMuted, fontSize: 11, marginTop: 5, lineHeight: 16 },
  arrow: { color: C.primary, fontSize: 30, marginLeft: 12 },
  note: { color: C.textMuted, fontSize: 11, textAlign: 'center', marginTop: 24 },
});
