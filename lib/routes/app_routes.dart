import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../Screens/home_screen.dart';
import '../Screens/feedback_screen.dart';
import '../Screens/profile_screen.dart';
import '../Screens/settings_screen.dart';
import '../Screens/splash_screen.dart';

class AppRoutes {
  static const String splash = '/splash';
  static const String home = '/home';
  static const String feedback = '/feedback';
  static const String profile = '/profile';
  static const String settings = '/settings';

  static final routes = [
    GetPage(
      name: splash,
      page: () => const SplashScreen(),
      transition: Transition.fade,
    ),
    GetPage(
      name: home,
      page: () => const HomeScreen(),
      transition: Transition.rightToLeft,
    ),
    GetPage(
      name: feedback,
      page: () => const FeedbackScreen(),
      transition: Transition.bottomUp,
    ),
    GetPage(
      name: profile,
      page: () => const ProfileScreen(),
      transition: Transition.rightToLeft,
    ),
    GetPage(
      name: settings,
      page: () => const SettingsScreen(),
      transition: Transition.rightToLeft,
    ),
  ];
}