import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'dart:math';
import '../routes/app_routes.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _dropController;
  late AnimationController _swayController;
  late AnimationController _textFadeController;
  late AnimationController _dotsController;

  late Animation<double> _dropAnimation;
  late Animation<double> _swayAnimation;
  late Animation<double> _textFadeAnimation;

  @override
  void initState() {
    super.initState();

    /// LOGO FALL FROM SKY (stop in middle)
    _dropController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 5),
    );

    _dropAnimation = Tween<double>(
      begin: -1.0,
      end: 0.0, // center
    ).animate(
      CurvedAnimation(
        parent: _dropController,
        curve: Curves.easeOut,
      ),
    );

    /// HORIZONTAL SWAY
    _swayController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );

    _swayAnimation = Tween<double>(begin: -25, end: 25).animate(
      CurvedAnimation(
        parent: _swayController,
        curve: Curves.easeInOut,
      ),
    );

    /// TEXT FADE-IN after logo reaches middle
    _textFadeController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    );
    _textFadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _textFadeController, curve: Curves.easeIn),
    );

    /// THREE DOTS LOADING ANIMATION
    _dotsController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _dotsController.repeat();

    /// Start animations
    _dropController.forward().whenComplete(() {
      _swayController.repeat(reverse: true);
      _textFadeController.forward(); // show text after drop
    });

    /// Navigate to auth after 3 seconds
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        Get.offNamed(AppRoutes.auth);
      }
    });
  }

  @override
  void dispose() {
    _dropController.dispose();
    _swayController.dispose();
    _textFadeController.dispose();
    _dotsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: Colors.black,
      body: AnimatedBuilder(
        animation: Listenable.merge([
          _dropController,
          _swayController,
          _textFadeController,
          _dotsController
        ]),
        builder: (context, child) {
          final dropY = _dropAnimation.value * screenHeight;
          final diagonalX = _swayAnimation.value;
          final diagonalY = dropY + 5 * sin(_swayAnimation.value * pi / 90);

          // Three dots animation (0,1,2 fade in/out in sequence)
          int dotIndex = ((_dotsController.value * 3).floor()) % 3;

          return Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo floating
              Transform.translate(
                offset: Offset(diagonalX, diagonalY),
                child: Transform.rotate(
                  angle: 0.05 * sin(_swayAnimation.value * pi / 45),
                  child: child,
                ),
              ),

              const SizedBox(height: 50),

              // App name and tagline fade-in
              Opacity(
                opacity: _textFadeAnimation.value,
                child: Column(
                  children: const [
                    Text(
                      "SafeOrbit",
                      style: TextStyle(
                        color: Color(0xFFA855F7),
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      "MAPPING A SAFER ROUTE",
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 14,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 80),

              // Animated dots
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(3, (index) {
                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 5),
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: index == dotIndex ? Colors.white : Colors.grey[700],
                      shape: BoxShape.circle,
                    ),
                  );
                }),
              ),
            ],
          );
        },
        child: Container(
          width: 230,
          height: 230,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: const Color(0xFFA855F7).withOpacity(0.1),
          ),
          child: Icon(
            Icons.shield,
            size: 120,
            color: const Color(0xFFA855F7),
          ),
        ),
      ),
    );
  }
}