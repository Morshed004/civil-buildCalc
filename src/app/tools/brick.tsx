import React, { useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { C, styles as ui, Field, UnitPicker, ResultTile, IconLength, IconWidth, IconHeight, IconBag, IconSand, IconStone, IconBlock, IconWall, IconCircle, IconCount, IconScale, IconCrane, toFeet, type MeasureUnit } from '../../components/CalculatorUI';

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SafeAreaView style={ui.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={page.header}>
          <TouchableOpacity style={page.back} onPress={() => router.replace('/')} activeOpacity={0.8}>
            <Text style={page.backArrow}>‹</Text><Text style={page.backText}>সব টুল</Text>
          </TouchableOpacity>
          <Text style={page.title}>{title}</Text>
        </View>
        <ScrollView contentContainerStyle={ui.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {children}
          <Text style={ui.footerNote}>* হিসাব আনুমানিক। প্রকৃত নির্মাণে স্থানীয় নিয়ম ও মাপ যাচাই করুন।</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const page = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  back: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primarySoft, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 11 },
  backArrow: { color: C.primaryDark, fontSize: 22, lineHeight: 22, marginRight: 3 },
  backText: { color: C.primaryDark, fontSize: 12, fontWeight: '800' },
  title: { color: C.textPrimary, fontSize: 16, fontWeight: '900', flex: 1 },
});

export default function BrickPage() {
  const [wallLength,setWallLength]=useState('20'); const [wallHeight,setWallHeight]=useState('10');
  const [lengthUnit,setLengthUnit]=useState<MeasureUnit>('ft'); const [heightUnit,setHeightUnit]=useState<MeasureUnit>('ft');
  const [thickness,setThickness]=useState<'5'|'10'>('5');
  const result=useMemo(()=>{const area=toFeet(wallLength,lengthUnit)*toFeet(wallHeight,heightUnit);const five=thickness==='5';const bricks=Math.ceil(area*(five?5:10));const mortar=area*(five ? 0.225 : 0.45)*1.5;return {bricks,cement:((mortar/5)/1.25).toFixed(2),sand:(mortar*4/5).toFixed(2)}},[wallLength,wallHeight,lengthUnit,heightUnit,thickness]);
  return <PageShell title="ইটের গাথুনি"><View style={ui.card}>
    <View style={ui.cardHeader}><Text style={ui.cardTitle}>দেয়ালের ডাইমেনশন</Text></View>
    <Field label="দৈর্ঘ্য" unit={lengthUnit} IconComponent={IconLength} value={wallLength} onChange={setWallLength}/><UnitPicker value={lengthUnit} onChange={setLengthUnit}/>
    <Field label="উচ্চতা" unit={heightUnit} IconComponent={IconHeight} value={wallHeight} onChange={setWallHeight}/><UnitPicker value={heightUnit} onChange={setHeightUnit}/>
    <Text style={[ui.fieldLabel,{marginTop:10,marginBottom:10}]}>গাথুনির পুরুত্ব</Text><View style={ui.segmentRow}>{(['5','10'] as const).map(t=><TouchableOpacity key={t} onPress={()=>setThickness(t)} style={[ui.segmentBtn,thickness===t&&ui.segmentBtnActive]}><Text style={[ui.segmentText,thickness===t&&ui.segmentTextActive]}>{t}″ গাথুনি</Text></TouchableOpacity>)}</View>
  </View><View style={ui.resultCard}><View style={ui.resultCardHeader}><View style={ui.resultCardAccent}/><Text style={ui.resultHeaderText}>দেয়ালের হিসাব</Text></View><View style={ui.resultGrid}>
    <ResultTile index={0} title="মোট ইট" value={String(result.bricks)} unit="pcs" IconComponent={IconBlock} tint={C.danger} wide/>
    <ResultTile index={1} title="সিমেন্ট" value={result.cement} unit="bags" IconComponent={IconBag} tint={C.primary}/>
    <ResultTile index={2} title="বালু" value={result.sand} unit="CFT" IconComponent={IconSand} tint={C.warning}/>
  </View></View></PageShell>;
}
