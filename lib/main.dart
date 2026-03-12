import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'Screens/splash_screen.dart';
import 'routes/app_routes.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SafeOrbitApp());
}

class SafeOrbitApp extends StatelessWidget {
  const SafeOrbitApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SafeOrbit',

      /// Theme
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Colors.black,
        fontFamily: 'Inter',
      ),

      /// Navigation Setup with GetX
      initialRoute: AppRoutes.splash,
      getPages: AppRoutes.routes,
    );
  }
}