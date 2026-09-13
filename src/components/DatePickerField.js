import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, spacing, radius, typography } from '../theme/colors';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function DatePickerField({ value, onChange }) {
  const [visible, setVisible] = useState(false);
  const [day, setDay] = useState(value?.day || null);
  const [month, setMonth] = useState(value?.month || null);
  const [year, setYear] = useState(value?.year || null);

  const displayText = value?.day && value?.month && value?.year
    ? `${String(value.day).padStart(2, '0')} ${MONTHS[value.month - 1]} ${value.year}`
    : 'Select your date of birth';

  const handleDone = () => {
    if (day && month && year) { onChange({ day, month, year }); setVisible(false); }
  };

  return (
    <>
      <TouchableOpacity style={styles.field} onPress={() => setVisible(true)}>
        <Text style={[styles.fieldText, !value && styles.placeholder]}>{displayText}</Text>
        <Ionicons name="calendar-outline" size={20} color={darkColors.textMuted} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Date of birth</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={22} color={darkColors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.columns}>
              <Column label="Day" items={DAYS} selected={day} onSelect={setDay} />
              <Column label="Month" items={MONTHS} selected={month} onSelect={setMonth} isMonth />
              <Column label="Year" items={YEARS} selected={year} onSelect={setYear} />
            </View>
            <TouchableOpacity
              style={[styles.doneBtn, (!day || !month || !year) && styles.doneBtnDisabled]}
              onPress={handleDone}
              disabled={!day || !month || !year}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

function Column({ label, items, selected, onSelect, isMonth }) {
  return (
    <View style={styles.column}>
      <Text style={styles.columnLabel}>{label}</Text>
      <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
        {items.map((item, i) => {
          const itemValue = isMonth ? i + 1 : item;
          const isSelected = selected === itemValue;
          return (
            <TouchableOpacity key={item} style={[styles.item, isSelected && styles.itemSelected]} onPress={() => onSelect(itemValue)}>
              <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { backgroundColor: darkColors.surface, borderWidth: 1, borderColor: darkColors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fieldText: { ...typography.body, color: darkColors.textPrimary },
  placeholder: { color: darkColors.textMuted },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: darkColors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sheetTitle: { ...typography.h2, color: darkColors.textPrimary },
  columns: { flexDirection: 'row', height: 220 },
  column: { flex: 1, marginHorizontal: 4 },
  columnLabel: { ...typography.small, color: darkColors.textMuted, textAlign: 'center', marginBottom: spacing.xs },
  columnScroll: { backgroundColor: darkColors.background, borderRadius: radius.sm },
  item: { paddingVertical: 10, alignItems: 'center' },
  itemSelected: { backgroundColor: darkColors.primary, borderRadius: radius.sm },
  itemText: { ...typography.body, color: darkColors.textSecondary },
  itemTextSelected: { color: darkColors.white, fontWeight: '700' },
  doneBtn: { backgroundColor: darkColors.primary, borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', marginTop: spacing.lg },
  doneBtnDisabled: { opacity: 0.4 },
  doneText: { color: darkColors.white, ...typography.h2, fontSize: 16 },
});
