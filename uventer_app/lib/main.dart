import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'theme.dart';
import 'screens/home_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Supabase
  await Supabase.initialize(
    url: 'https://kgwehgvokxhlgvkhygsx.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2VoZ3Zva3hobGd2a2h5Z3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODk3NTgsImV4cCI6MjA5MjQ2NTc1OH0.NwzDaUbzk_u720R7ZcxorLHd2Sz17lQef7iUpZAfwZ0',
  );

  runApp(const UventerApp());
}

class UventerApp extends StatelessWidget {
  const UventerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Uventer',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const HomeScreen(),
    );
  }
}
