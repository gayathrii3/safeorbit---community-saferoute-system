import 'package:flutter/material.dart';
import 'Screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SafeOrbitApp());
}

class SafeOrbitApp extends StatelessWidget {
  const SafeOrbitApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,

      title: 'SafeOrbit',

      /// Theme
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Colors.black,
        fontFamily: 'Inter',
      ),

      /// Splash Screen First
      home: const SplashScreen(),
    );
  }
}