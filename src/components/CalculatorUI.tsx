import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  forwardRef,
  memo,
  type ComponentType,
  type ElementRef,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Easing,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

/* ═══════════════════════ TYPES ═══════════════════════ */

type TabType = 'concrete' | 'brick' | 'steel';
type BrickThickness = '5' | '10';
export type MeasureUnit = 'ft' | 'in' | 'm' | 'mm';

const UNIT_OPTIONS: MeasureUnit[] = ['ft', 'in', 'm', 'mm'];
export const toFeet = (value: string, unit: MeasureUnit): number => {
  const n = Number.parseFloat(value) || 0;
  if (unit === 'ft') return n;
  if (unit === 'in') return n / 12;
  if (unit === 'm') return n * 3.280839895;
  return n / 304.8;
};

/** TextInput instance handle — has .focus(), .blur(), .clear() */
type TextInputHandle = ElementRef<typeof TextInput>;

interface IconProps {
  size?: number;
  color?: string;
}

interface FieldProps {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  IconComponent: ComponentType<IconProps>;
  onSubmitEditing?: () => void;
}

interface ResultTileProps {
  title: string;
  value: string;
  unit: string;
  IconComponent: ComponentType<IconProps>;
  tint: string;
  wide?: boolean;
  index: number;
}

/* ═══════════════════════ DESIGN TOKENS ═══════════════════════ */

export const C = {
  bg: '#FFF9F0',
  surface: '#FFFFFF',
  surfaceAlt: '#FFF7ED',
  primary: '#FF9900',
  primaryDark: '#E68A00',
  primarySoft: '#FFF0D6',
  accent: '#F59E0B',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#EF4444',
  textPrimary: '#172033',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#F1E4D2',
  borderFocus: '#FF9900',
} as const;

const SHADOW = {
  card: {
    shadowColor: '#9A6700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3,
  },
  soft: {
    shadowColor: '#9A6700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
} as const;

/* ═══════════════════════ VECTOR ICONS ═══════════════════════ */

export const IconLength = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'center' }}>
    <View style={{ height: 3, backgroundColor: color, borderRadius: 2 }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            width: 1.5,
            height: i % 2 === 0 ? 6 : 4,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      ))}
    </View>
  </View>
);

export const IconWidth = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size, height: 2, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', left: 0, top: size / 2 - 4, width: 2, height: 8, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', right: 0, top: size / 2 - 4, width: 2, height: 8, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const IconHeight = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 2, height: size, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', top: 0, width: 8, height: 2, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', bottom: 0, width: 8, height: 2, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const IconCount = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'space-between' }}>
    {[0, 1].map((col) => (
      <View key={col} style={{ flexDirection: 'row', gap: 2 }}>
        {[0, 1].map((dot) => (
          <View
            key={dot}
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: color,
              marginTop: dot * 8,
            }}
          />
        ))}
      </View>
    ))}
  </View>
);

export const IconCircle = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: color }} />
);

export const IconBlock = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'center', gap: 2 }}>
    <View style={{ height: (size - 4) / 2, backgroundColor: color, borderRadius: 2 }} />
    <View style={{ height: (size - 4) / 2, backgroundColor: color, borderRadius: 2, opacity: 0.6 }} />
  </View>
);

export const IconWall = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, gap: 1.5 }}>
    {[0, 1, 2].map((row) => (
      <View key={row} style={{ flex: 1, flexDirection: 'row', gap: 1.5 }}>
        {[0, 1, 2].map((col) => (
          <View
            key={col}
            style={{
              flex: 1,
              backgroundColor: color,
              borderRadius: 1,
              opacity: row === 1 && col === 1 ? 0.5 : 1,
            }}
          />
        ))}
      </View>
    ))}
  </View>
);

export const IconBar = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size, height: 3, backgroundColor: color, borderRadius: 2 }} />
    <View style={{ position: 'absolute', left: 2, width: 2, height: size, backgroundColor: color, borderRadius: 1, opacity: 0.5 }} />
    <View style={{ position: 'absolute', right: 2, width: 2, height: size, backgroundColor: color, borderRadius: 1, opacity: 0.5 }} />
  </View>
);

export const IconBag = ({ size = 18, color = C.primary }: IconProps) => (
  <View
    style={{
      width: size * 0.75,
      height: size,
      backgroundColor: color,
      borderRadius: 3,
      borderTopLeftRadius: size * 0.35,
      borderTopRightRadius: size * 0.35,
    }}
  />
);

export const IconSand = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'flex-end', alignItems: 'center' }}>
    <View
      style={{
        width: size,
        height: size * 0.55,
        backgroundColor: color,
        borderTopLeftRadius: size,
        borderTopRightRadius: size,
        opacity: 0.85,
      }}
    />
  </View>
);

export const IconStone = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.8,
        height: size * 0.7,
        backgroundColor: color,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 3,
      }}
    />
  </View>
);

export const IconScale = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
    <View style={{ width: 2, height: size * 0.7, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: size, height: 2, backgroundColor: color, borderRadius: 1, marginTop: 1 }} />
  </View>
);

export const IconCrane = ({ size = 18, color = C.primary }: IconProps) => (
  <View style={{ width: size, height: size }}>
    <View style={{ position: 'absolute', left: 0, bottom: 0, width: 2, height: size, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', left: 0, top: 0, width: size, height: 2, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', right: 0, top: 2, width: 1.5, height: size * 0.5, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

/* ═══════════════════════ FIELD ═══════════════════════ */

export const Field = memo(
  forwardRef<TextInputHandle, FieldProps>(
    ({ label, unit, value, onChange, IconComponent, onSubmitEditing }, ref) => {
      const [focused, setFocused] = useState<boolean>(false);
      const focusAnim = useRef(new Animated.Value(0)).current;

      useEffect(() => {
        Animated.spring(focusAnim, {
          toValue: focused ? 1 : 0,
          useNativeDriver: false,
          friction: 8,
          tension: 100,
        }).start();
      }, [focused, focusAnim]);

      const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [C.border, C.borderFocus],
      });

      return (
        <View style={styles.fieldWrap}>
          <View style={styles.fieldLabelRow}>
            <IconComponent size={14} color={focused ? C.primary : C.textMuted} />
            <Text style={[styles.fieldLabel, focused && styles.fieldLabelActive]}>
              {label}
            </Text>
          </View>
          <Animated.View style={[styles.inputShell, { borderColor }]}>
            <TextInput
              ref={ref}
              style={styles.input}
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              placeholder="0"
              placeholderTextColor={C.textMuted}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              selectionColor={C.primary}
              returnKeyType="done"
              onSubmitEditing={onSubmitEditing}
              submitBehavior="submit"
            />
            <View style={styles.inputUnitChip}>
              <Text style={styles.inputUnitText}>{unit}</Text>
            </View>
          </Animated.View>
        </View>
      );
    }
  )
);
Field.displayName = 'Field';

interface UnitPickerProps {
  value: MeasureUnit;
  onChange: (unit: MeasureUnit) => void;
}

export const UnitPicker = ({ value, onChange }: UnitPickerProps) => (
  <View style={styles.unitPicker}>
    {UNIT_OPTIONS.map((unit) => (
      <TouchableOpacity
        key={unit}
        onPress={() => onChange(unit)}
        activeOpacity={0.8}
        style={[styles.unitOption, value === unit && styles.unitOptionActive]}
      >
        <Text style={[styles.unitOptionText, value === unit && styles.unitOptionTextActive]}>
          {unit}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

/* ═══════════════════════ RESULT TILE ═══════════════════════ */

export const ResultTile = memo(
  ({ title, value, unit, IconComponent, tint, wide, index }: ResultTileProps) => {
    const enter = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(enter, {
        toValue: 1,
        duration: 360,
        delay: index * 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, [enter, index]);

    return (
      <Animated.View
        style={[
          styles.resultTile,
          wide && styles.resultTileWide,
          {
            backgroundColor: tint + '10',
            borderColor: tint + '22',
            opacity: enter,
            transform: [
              {
                translateY: enter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.resultIconBubble, { backgroundColor: tint + '18' }]}>
          <IconComponent size={16} color={tint} />
        </View>
        <Text style={styles.resultTileTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.resultValueRow}>
          <Text style={[styles.resultTileValue, { color: tint }]} numberOfLines={1}>
            {value}
          </Text>
          <Text style={[styles.resultTileUnit, { color: tint }]}>{unit}</Text>
        </View>
      </Animated.View>
    );
  }
);
ResultTile.displayName = 'ResultTile';

/* ═══════════════════════ TABS ═══════════════════════ */

export const styles = StyleSheet.create({

  /* Brand and home navigation */
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  brandLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandLogo: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.primarySoft },
  brandName: { fontSize: 18, fontWeight: '900', color: C.textPrimary, letterSpacing: -0.4 },
  brandTagline: { fontSize: 11, color: C.textSecondary, marginTop: 2 },
  menuButton: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: C.surface,
    alignItems: 'center', justifyContent: 'center', ...SHADOW.soft,
  },
  menuGlyph: { fontSize: 23, color: C.textPrimary, fontWeight: '700' },
  homeContent: { paddingHorizontal: 20, paddingBottom: 36 },
  homeIntro: { paddingTop: 20, paddingBottom: 22 },
  homeEyebrow: { color: C.primaryDark, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
  homeTitle: { color: C.textPrimary, fontSize: 27, fontWeight: '900', letterSpacing: -0.7 },
  homeSubtitle: { color: C.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 8 },
  toolGrid: { gap: 12 },
  toolCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface,
    borderRadius: 19, padding: 16, borderWidth: 1, borderColor: C.border, ...SHADOW.soft,
  },
  toolIconWrap: {
    width: 48, height: 48, borderRadius: 15, backgroundColor: C.primarySoft,
    alignItems: 'center', justifyContent: 'center', marginRight: 13,
  },
  toolCardText: { flex: 1 },
  toolCardTitle: { color: C.textPrimary, fontSize: 14, fontWeight: '800' },
  toolCardSubtitle: { color: C.textMuted, fontSize: 11, marginTop: 4, lineHeight: 16 },
  toolArrow: { color: C.primary, fontSize: 29, fontWeight: '400', marginLeft: 8 },
  comingSoonCard: { borderStyle: 'dashed', backgroundColor: C.surfaceAlt, elevation: 0, shadowOpacity: 0 },
  comingSoonIcon: { backgroundColor: '#F1F5F9' },
  plusGlyph: { color: C.textMuted, fontSize: 25, fontWeight: '400' },
  toolTopBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, gap: 14 },
  backButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primarySoft, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 11 },
  backGlyph: { color: C.primaryDark, fontSize: 22, lineHeight: 22, marginRight: 3 },
  backText: { color: C.primaryDark, fontSize: 12, fontWeight: '800' },
  currentToolTitle: { color: C.textPrimary, fontSize: 16, fontWeight: '900', flex: 1 },
  unitPicker: { flexDirection: 'row', alignSelf: 'flex-end', gap: 6, marginTop: -7, marginBottom: 12 },
  unitOption: { minWidth: 38, alignItems: 'center', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface },
  unitOptionActive: { borderColor: C.primary, backgroundColor: C.primarySoft },
  unitOptionText: { fontSize: 10, fontWeight: '700', color: C.textMuted },
  unitOptionTextActive: { color: C.primaryDark },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.42)', justifyContent: 'center', padding: 20 },
  modalDismiss: { ...StyleSheet.absoluteFillObject },
  menuPanel: { backgroundColor: C.surface, borderRadius: 22, padding: 18, ...SHADOW.card },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { color: C.textPrimary, fontSize: 18, fontWeight: '900' },
  modalClose: { color: C.textSecondary, fontSize: 20, paddingHorizontal: 5, paddingVertical: 2 },
  menuHomeRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderTopColor: C.border, paddingVertical: 12 },
  menuRowText: { color: C.textPrimary, fontSize: 14, fontWeight: '700', flex: 1 },
  menuRowArrow: { color: C.primary, fontSize: 25 },
  ratioModal: { backgroundColor: C.surface, borderRadius: 22, padding: 20, ...SHADOW.card },
  modalHint: { color: C.textSecondary, fontSize: 12, lineHeight: 18, marginBottom: 18 },
  ratioInputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 7 },
  ratioInputGroup: { flex: 1 },
  ratioInputLabel: { color: C.textSecondary, fontSize: 11, fontWeight: '800', textAlign: 'center', marginBottom: 7 },
  ratioInput: { borderWidth: 1.5, borderColor: C.border, borderRadius: 12, backgroundColor: C.surfaceAlt, textAlign: 'center', color: C.textPrimary, fontSize: 19, fontWeight: '800', paddingVertical: 12 },
  ratioColon: { color: C.primary, fontSize: 22, fontWeight: '900', paddingBottom: 12 },
  ratioPreview: { color: C.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 16, marginBottom: 18, fontWeight: '700' },
  saveRatioButton: { backgroundColor: C.primary, borderRadius: 13, alignItems: 'center', paddingVertical: 14 },
  saveRatioText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },

  container: { flex: 1, backgroundColor: C.bg },

  /* Header */
  header: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 18 },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: C.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.success },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: C.textPrimary,
    lineHeight: 36,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },

  /* Tabs */
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF0D6',
    borderRadius: 18,
    marginHorizontal: 20,
    padding: 4,
    marginBottom: 16,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: C.surface,
    borderRadius: 14,
    ...SHADOW.soft,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    gap: 6,
    borderRadius: 14,
    zIndex: 1,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
  activeTabText: { color: C.primary, fontWeight: '800' },

  /* Scroll */
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  /* Card */
  card: {
    backgroundColor: C.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    ...SHADOW.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.2,
  },
  ratioChip: {
    backgroundColor: C.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  ratioChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textSecondary,
    letterSpacing: 0.5,
  },

  /* Field */
  fieldWrap: { marginBottom: 14 },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    gap: 6,
  },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: C.textSecondary },
  fieldLabelActive: { color: C.primary },

  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: C.surfaceAlt,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 17,
    fontWeight: '700',
    color: C.textPrimary,
  },
  inputUnitChip: {
    backgroundColor: C.surfaceAlt,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: C.border,
  },
  inputUnitText: { fontSize: 11, fontWeight: '700', color: C.textMuted },

  /* Segment */
  segmentRow: { flexDirection: 'row', gap: 10 },
  segmentBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surfaceAlt,
    alignItems: 'center',
  },
  segmentBtnActive: { backgroundColor: C.primarySoft, borderColor: C.primary },
  segmentText: { fontSize: 13, fontWeight: '700', color: C.textSecondary },
  segmentTextActive: { color: C.primary },

  /* Result */
  resultCard: {
    backgroundColor: C.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    ...SHADOW.card,
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  resultCardAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: C.primary,
  },
  resultHeaderText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: C.textPrimary,
  },
  volumeChip: {
    backgroundColor: C.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  volumeChipText: { fontSize: 11, fontWeight: '800', color: C.primary },

  resultGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  resultTile: {
    width: (width - 40 - 36 - 10) / 2,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  resultTileWide: { width: width - 40 - 36 },
  resultIconBubble: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  resultTileTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textSecondary,
    marginBottom: 4,
  },
  resultValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  resultTileValue: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  resultTileUnit: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.75,
  },

  footerNote: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});