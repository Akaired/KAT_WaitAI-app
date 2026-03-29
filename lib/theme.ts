export const Colors = {
  magenta:    '#E31C79',
  lime:       '#C5E063',
  black:      '#0A0A0A',
  white:      '#FFFFFF',
  gray:       '#666666',
  grayLight:  '#A0A0A0',
  border:     '#F0F0F0',
  bg:         '#FAFAFA',
  green:      '#2ECC71',
  yellow:     '#F1C40F',
  orange:     '#E67E22',
  red:        '#E74C3C',
};

export const FLAG_COLORS: Record<string, string> = {
  green:  Colors.green,
  yellow: Colors.yellow,
  orange: Colors.orange,
  red:    Colors.red,
};

export const FLAG_LABELS: Record<string, string> = {
  green:  'Situazione sicura',
  yellow: 'Attenzione',
  orange: 'Rischio moderato',
  red:    'Pericolo immediato',
};
