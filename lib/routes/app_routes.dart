import 'package:get/get.dart';
import '../Screens/splash_screen.dart';
import '../Screens/auth_screen.dart';
import '../Screens/home_screen.dart';
import '../Screens/feedback_screen.dart';
import '../Screens/profile_screen.dart';
import '../Screens/settings_screen.dart';

class AppRoutes {
  static const splash = '/splash';
  static const auth = '/auth';
  static const home = '/home';
  static const feedback = '/feedback';
  static const profile = '/profile';
  static const settings = '/settings';

  static final routes = [
    GetPage(name: splash, page: () => SplashScreen()),
    GetPage(name: auth, page: () => AuthScreen()),
    GetPage(name: home, page: () => HomeScreen()),
    GetPage(name: feedback, page: () => FeedbackScreen()),
    GetPage(name: profile, page: () => ProfileScreen()),
    GetPage(name: settings, page: () => SettingsScreen()),
  ];
}