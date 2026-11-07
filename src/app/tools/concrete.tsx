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

export default function ConcretePage() {
  const [length, setLength] = useState('10');
  const [width, setWidth] = useState('10');
  const [thickness, setThickness] = useState('5');
  const [lengthUnit, setLengthUnit] = useState<MeasureUnit>('ft');
  const [widthUnit, setWidthUnit] = useState<MeasureUnit>('ft');
  const [thicknessUnit, setThicknessUnit] = useState<MeasureUnit>('in');
  const [cementRatio, setCementRatio] = useState('1');
  const [sandRatio, setSandRatio] = useState('2');
  const [stoneRatio, setStoneRatio] = useState('4');
  const [ratioOpen, setRatioOpen] = useState(false);
  const volume = useMemo(() => {
    const wet = toFeet(length, lengthUnit) * toFeet(width, widthUnit) * toFeet(thickness, thicknessUnit);
    const dry = wet * 1.54;
    const c = Math.max(0, Number(cementRatio) || 0), s = Math.max(0, Number(sandRatio) || 0), k = Math.max(0, Number(stoneRatio) || 0);
    const sum = c + s + k;
    return { wet: wet.toFixed(2), cement: sum ? ((dry * c / sum) / 1.25).toFixed(2) : '0.00', sand: sum ? (dry * s / sum).toFixed(2) : '0.00', stone: sum ? (dry * k / sum).toFixed(2) : '0.00' };
  }, [length, width, thickness, lengthUnit, widthUnit, thicknessUnit, cementRatio, sandRatio, stoneRatio]);
  return <PageShell title="কংক্রিট ক্যালকুলেটর">
    <View style={ui.card}>
      <View style={ui.cardHeader}><Text style={ui.cardTitle}>ঢালাইয়ের মাপ</Text>
        <TouchableOpacity style={ui.ratioChip} onPress={() => setRatioOpen(true)}><Text style={ui.ratioChipText}>Ratio {cementRatio}:{sandRatio}:{stoneRatio}  ✎</Text></TouchableOpacity>
      </View>
      <Field label="দৈর্ঘ্য" unit={lengthUnit} IconComponent={IconLength} value={length} onChange={setLength} /><UnitPicker value={lengthUnit} onChange={setLengthUnit} />
      <Field label="প্রস্থ" unit={widthUnit} IconComponent={IconWidth} value={width} onChange={setWidth} /><UnitPicker value={widthUnit} onChange={setWidthUnit} />
      <Field label="পুরুত্ব" unit={thicknessUnit} IconComponent={IconHeight} value={thickness} onChange={setThickness} /><UnitPicker value={thicknessUnit} onChange={setThicknessUnit} />
    </View>
    <View style={ui.resultCard}>
      <View style={ui.resultCardHeader}><View style={ui.resultCardAccent}/><Text style={ui.resultHeaderText}>প্রয়োজনীয় উপকরণ</Text><View style={ui.volumeChip}><Text style={ui.volumeChipText}>{volume.wet} CFT</Text></View></View>
      <View style={ui.resultGrid}>
        <ResultTile index={0} title="সিমেন্ট" value={volume.cement} unit="bags" IconComponent={IconBag} tint={C.primary}/>
        <ResultTile index={1} title="বালু" value={volume.sand} unit="CFT" IconComponent={IconSand} tint={C.warning}/>
        <ResultTile index={2} title="খোয়া / পাথর" value={volume.stone} unit="CFT" IconComponent={IconStone} tint={C.danger} wide/>
      </View>
    </View>
    <Modal visible={ratioOpen} transparent animationType="slide" onRequestClose={() => setRatioOpen(false)}>
      <View style={modal.backdrop}><View style={modal.sheet}>
        <View style={modal.heading}><Text style={modal.title}>কংক্রিট মিক্স রেশিও</Text><TouchableOpacity onPress={() => setRatioOpen(false)}><Text style={modal.close}>✕</Text></TouchableOpacity></View>
        <Text style={modal.hint}>সিমেন্ট : বালু : খোয়া — নিজের প্রয়োজন অনুযায়ী অনুপাত লিখুন।</Text>
        <View style={modal.row}>{[["সিমেন্ট",cementRatio,setCementRatio],["বালু",sandRatio,setSandRatio],["খোয়া",stoneRatio,setStoneRatio]].map(([label,val,setter]: any,i)=><React.Fragment key={label}><View style={{flex:1}}><Text style={modal.label}>{label}</Text><TextInput style={modal.input} value={val} onChangeText={setter} keyboardType="decimal-pad"/></View>{i<2&&<Text style={modal.colon}>:</Text>}</React.Fragment>)}</View>
        <TouchableOpacity style={modal.save} onPress={() => setRatioOpen(false)}><Text style={modal.saveText}>রেশিও সেভ করুন</Text></TouchableOpacity>
      </View></View>
    </Modal>
  </PageShell>;
}
const modal = StyleSheet.create({backdrop:{flex:1,backgroundColor:'rgba(15,23,42,0.42)',justifyContent:'center',padding:20},sheet:{backgroundColor:C.surface,borderRadius:22,padding:20,...({shadowColor:'#9A6700',shadowOffset:{width:0,height:6},shadowOpacity:.12,shadowRadius:18,elevation:4})},heading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:14},title:{color:C.textPrimary,fontSize:18,fontWeight:'900'},close:{color:C.textSecondary,fontSize:20,padding:4},hint:{color:C.textSecondary,fontSize:12,lineHeight:18,marginBottom:18},row:{flexDirection:'row',alignItems:'flex-end',gap:7},label:{color:C.textSecondary,fontSize:11,fontWeight:'800',textAlign:'center',marginBottom:7},input:{borderWidth:1.5,borderColor:C.border,borderRadius:12,backgroundColor:C.surfaceAlt,textAlign:'center',color:C.textPrimary,fontSize:19,fontWeight:'800',paddingVertical:12},colon:{color:C.primary,fontSize:22,fontWeight:'900',paddingBottom:12},save:{backgroundColor:C.primary,borderRadius:13,alignItems:'center',paddingVertical:14,marginTop:20},saveText:{color:'#fff',fontSize:14,fontWeight:'900'}});
