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

export default function SteelPage() {
  const [diameter,setDiameter]=useState('16'); const [length,setLength]=useState('40'); const [lengthUnit,setLengthUnit]=useState<MeasureUnit>('ft'); const [quantity,setQuantity]=useState('10');
  const result=useMemo(()=>{const d=Number(diameter)||0;const l=toFeet(length,lengthUnit);const q=Number(quantity)||0;const kg=(d*d/533)*l*q;return {kg:kg.toFixed(2),ton:(kg/1000).toFixed(3)}},[diameter,length,lengthUnit,quantity]);
  return <PageShell title="রডের ওজন"><View style={ui.card}>
    <View style={ui.cardHeader}><Text style={ui.cardTitle}>রডের বিবরণ</Text><View style={ui.ratioChip}><Text style={ui.ratioChipText}>D² / 533</Text></View></View>
    <Field label="ডায়ামিটার (সবসময় mm)" unit="mm" IconComponent={IconCircle} value={diameter} onChange={setDiameter}/>
    <Field label="রডের দৈর্ঘ্য" unit={lengthUnit} IconComponent={IconLength} value={length} onChange={setLength}/><UnitPicker value={lengthUnit} onChange={setLengthUnit}/>
    <Field label="রডের সংখ্যা" unit="pcs" IconComponent={IconCount} value={quantity} onChange={setQuantity}/>
  </View><View style={ui.resultCard}><View style={ui.resultCardHeader}><View style={ui.resultCardAccent}/><Text style={ui.resultHeaderText}>মোট ওজন</Text></View><View style={ui.resultGrid}>
    <ResultTile index={0} title="কেজি" value={result.kg} unit="Kg" IconComponent={IconScale} tint={C.primary}/>
    <ResultTile index={1} title="টন" value={result.ton} unit="Ton" IconComponent={IconCrane} tint={C.success}/>
  </View></View></PageShell>;
}
