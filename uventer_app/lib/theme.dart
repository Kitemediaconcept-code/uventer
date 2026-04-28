import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryYellow = Color(0xFFFFDE59);
  static const Color backgroundWhite = Color(0xFFFFFFFF);
  static const Color surfaceGrey = Color(0xFFF3F4F6);
  static const Color borderGrey = Color(0xFFE5E7EB);
  static const Color textDark = Color(0xFF111827);
  static const Color textGrey = Color(0xFF6B7280);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      fontFamily: 'SF Pro',
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryYellow,
        primary: primaryYellow,
        onPrimary: textDark,
        background: backgroundWhite,
        onBackground: textDark,
        surface: Colors.white,
        onSurface: textDark,
      ),
      scaffoldBackgroundColor: backgroundWhite,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false, // More modern left-aligned
        iconTheme: IconThemeData(color: textDark),
        titleTextStyle: TextStyle(
          color: textDark,
          fontSize: 20,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.5,
        ),
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: borderGrey, width: 1),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryYellow, 
          foregroundColor: textDark,
          minimumSize: const Size(double.infinity, 60),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
          ),
        ),
      ),
      textTheme: const TextTheme(
        headlineMedium: TextStyle(
          color: textDark,
          fontSize: 28,
          fontWeight: FontWeight.w800,
          letterSpacing: -1,
        ),
        titleLarge: TextStyle(
          color: textDark,
          fontSize: 20,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.5,
        ),
        bodyLarge: TextStyle(
          color: textDark,
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        bodyMedium: TextStyle(
          color: textGrey,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
