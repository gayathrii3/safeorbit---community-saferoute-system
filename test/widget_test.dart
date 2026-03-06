import 'package:flutter_test/flutter_test.dart';
import 'package:safeorbit/main.dart';

void main() {
  testWidgets('Splash screen loads correctly', (WidgetTester tester) async {

    // Build the SafeOrbit app
    await tester.pumpWidget(const SafeOrbitApp());

    // Verify SafeOrbit text appears
    expect(find.textContaining('Safe'), findsOneWidget);
    expect(find.textContaining('Orbit'), findsOneWidget);

    // Verify tagline appears
    expect(find.text('Secure. Modern. Professional.'), findsOneWidget);

  });
}