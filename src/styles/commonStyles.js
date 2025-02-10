import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#fea347',
  primaryDark: '#e5831f',
  background: '#fff',
  backgroundLight: '#f5f5f5',
  white: '#fff',
  text: '#333',
  textSecondary: '#666',
  border: '#eee',
  heroOverlay: 'rgba(0,0,0,0.3)',
  shadow: '#000',
};

export const spacing = {
  xs: 5,
  s: 10,
  m: 15,
  l: 20,
  xl: 25,
  xxl: 30,
};

export const borderRadius = {
  s: 5,
  m: 10,
  l: 15,
  xl: 20,
  xxl: 25,
  round: 30,
};

export const commonStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  // Hero Section Styles
  heroSection: {
    height: 300,
    marginBottom: spacing.l,
  },
  heroImage: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 60,
    backgroundColor: colors.heroOverlay,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.s,
  },
  heroSubtitle: {
    color: colors.white,
    fontSize: 16,
    marginBottom: spacing.m,
  },
  // Input Styles
  input: {
    backgroundColor: colors.white,
    padding: spacing.m,
    borderRadius: borderRadius.round,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    color: colors.text,
    marginBottom: spacing.m,
  },
  // Button Styles
  primaryButton: {
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    marginBottom: spacing.l,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.white,
    padding: spacing.m,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Section Styles
  section: {
    padding: spacing.l,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.s,
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.m,
  },
  // Card Styles
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.l,
    padding: spacing.m,
    marginBottom: spacing.m,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  // Link Styles
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  linkText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  // Navigation Styles
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: spacing.s,
    paddingTop: spacing.s,
  },
  header: {
    backgroundColor: colors.white,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  // Search Styles
  searchContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.round,
    padding: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.s,
    fontSize: 16,
    color: colors.text,
  },
});

export default commonStyles;
