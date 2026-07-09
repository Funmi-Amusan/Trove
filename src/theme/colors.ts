export const colors = {
  primary: '#059A83',
  primaryLight: '#E0F5E1',
  success: '#10AE17',
  negative: '#BF221C',
  backgroundCanvas: '#FBFBFB',
  cardSurface: '#FFFFFF',
  pageBackground: '#F5F1EE',
  backgroundDefault: '#F2F6F6',
  textDefault: '#13342F',
  textNeutral: '#687D7A',
  textDisabled: '#92A29F',
  border: '#DBDFDF',
  accentBlue: '#00B6DF',
  purple: '#7B79C9',
  cream: '#F2C891',
  darkBlue: '#00323D',
} as const;

export const sectorColors = {
  Technology: colors.primary,
  Healthcare: colors.accentBlue,
  Finance: colors.purple,
  Automotive: colors.cream,
  Entertainment: colors.darkBlue,
} as const;

export const getSectorColor = (sector: string): string => {
  return sectorColors[sector as keyof typeof sectorColors] || colors.primary;
};
