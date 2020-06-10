export const biomarkers: string[] = [
  'MECOM(3q26.2)',
  't(6;9)(p23;q34.1)(DEK-NUP214)',
  'Monosomy 7',
  'Monosomy 5/5q-[ERG1(5q31) deleted]',
  'KMT2A(MLL)(11q23.3)',
  'NUP98(11p15.5)',
  '12p abnormalities (ETV6)',
  'ETS FUS-ERG Fusion',
  'FLT3/ITD+ with alleic ratio > 0.1%',
  'CBFA2T3-GLIS2',
  'RAM phenotype',
  'KAT6A(8p11.21) Fusion',
  'Non-KMT2A MLLT10 Fusions',
]

export const labels: { [key: string]: string } = {
  prevChemoFlag: 'previous chemotherapy',
  prevRadFlag: 'previous radiation therapy',
  prevAtra: 'all-trans retinoid acid (ATRA)',
  prevHydroxyurea: 'hydroxyurea',
  prevSteroids: 'corticosteriods',
  prevItCyt: 'IT cytarabine',
  prevOther: 'other antileukemic therapy',
  lvEf: 'Left Ventricular Ejection Fraction (%)',
  secrumCr: 'Baseline serum creatinine (mg/dL)',
  astRecent: 'Most recent AST (U/L)',
  altRecent: 'Most recent ALT (U/L)',
}

export default {
  biomarkers,
  labels,
}