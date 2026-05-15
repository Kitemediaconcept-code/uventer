import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../theme.dart';
import '../services/supabase_service.dart';
import 'add_event_screen.dart';
import 'event_detail_screen.dart';
import 'login_screen.dart';
import '../widgets/lead_capture_dialog.dart';
import '../widgets/side_nav_drawer.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _supabaseService = SupabaseService();
  late Future<List<Map<String, dynamic>>> _eventsFuture;
  User? _currentUser;
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _servicesKey = GlobalKey();
  final GlobalKey _processKey = GlobalKey();
  final GlobalKey _upcomingEventsKey = GlobalKey();
  Map<String, int> _eventCounts = {'today': 0, 'tomorrow': 0, 'weekend': 0};

  @override
  void initState() {
    super.initState();
    _currentUser = Supabase.instance.client.auth.currentUser;
    _refreshEvents();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _refreshEvents() {
    setState(() {
      _currentUser = Supabase.instance.client.auth.currentUser;
      _eventsFuture = _supabaseService.getEvents();
      _supabaseService.getEventCounts().then((counts) {
        if (mounted) setState(() => _eventCounts = counts);
      });
    });
  }

  String _getFormattedDate(DateTime date) {
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return '${weekdays[date.weekday - 1]}, ${date.day} ${months[date.month - 1]}';
  }

  String _getWeekendRange() {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final daysUntilSaturday = (6 - today.weekday + 7) % 7;
    final saturday = today.add(Duration(days: daysUntilSaturday));
    final sunday = saturday.add(const Duration(days: 1));
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (saturday.month == sunday.month) {
      return '${saturday.day} - ${sunday.day} ${months[saturday.month - 1]}';
    } else {
      return '${saturday.day} ${months[saturday.month - 1]} - ${sunday.day} ${months[sunday.month - 1]}';
    }
  }

  // Services data — exact match to website with descriptions and colors
  final List<Map<String, dynamic>> _services = [
    {
      'icon': Icons.business_center_outlined,
      'title': 'Corporate Events',
      'desc': 'Professional events that inspire teams and drive business success.',
      'color': const Color(0xFF6366F1),
    },
    {
      'icon': Icons.mic_external_on_outlined,
      'title': 'Business Conferences',
      'desc': 'High-impact conferences that bring ideas, leaders and industries together.',
      'color': const Color(0xFFF59E0B),
    },
    {
      'icon': Icons.rocket_launch_outlined,
      'title': 'Product Launches',
      'desc': 'Launch experiences designed for maximum brand impact.',
      'color': const Color(0xFF10B981),
    },
    {
      'icon': Icons.people_outline,
      'title': 'Networking Events',
      'desc': 'Meaningful connections through curated networking experiences.',
      'color': const Color(0xFF2DD4BF),
    },
    {
      'icon': Icons.bolt_outlined,
      'title': 'Brand Activations',
      'desc': 'Creative activations that engage audiences and amplify brands.',
      'color': const Color(0xFF8B5CF6),
    },
    {
      'icon': Icons.school_outlined,
      'title': 'Seminars & Workshops',
      'desc': 'Knowledge-driven sessions that educate, engage and empower.',
      'color': const Color(0xFFF97316),
    },
    {
      'icon': Icons.grid_view_outlined,
      'title': 'Exhibitions',
      'desc': 'Showcase your brand and products to the right audience.',
      'color': const Color(0xFFEC4899),
    },
    {
      'icon': Icons.settings_outlined,
      'title': 'Event Execution',
      'desc': 'End-to-end execution with precision, creativity and flawless delivery.',
      'color': const Color(0xFF3B82F6),
    },
    {
      'icon': Icons.location_on_outlined,
      'title': 'Venue & Vendor Mgmt',
      'desc': 'Find the perfect venues and manage vendors seamlessly.',
      'color': const Color(0xFF06B6D4),
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        titleSpacing: 20,
        title: Image.asset(
          'assets/uventer-logo.png',
          height: 28,
          errorBuilder: (ctx, e, st) => const Text(
            'uventer',
            style: TextStyle(
              color: AppTheme.textDark,
              fontWeight: FontWeight.w800,
              fontSize: 20,
            ),
          ),
        ),
        leading: Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppTheme.textDark),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
        actions: [
          if (_currentUser == null)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const LoginScreen()),
                  ).then((_) => _refreshEvents());
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryYellow,
                  foregroundColor: Colors.black,
                  minimumSize: Size.zero,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Login',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ),
            )
          else
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: IconButton(
                onPressed: () async {
                  await Supabase.instance.client.auth.signOut();
                  _refreshEvents();
                },
                icon: const Icon(Icons.logout_rounded, color: AppTheme.textDark),
              ),
            ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async => _refreshEvents(),
        color: AppTheme.primaryYellow,
        child: SingleChildScrollView(
          controller: _scrollController,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ─── HERO SECTION ───────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: Column(
                  children: [
                    const SizedBox(height: 10),
                    // Blue Hero Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.fromLTRB(28, 40, 28, 40),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryBlue,
                        borderRadius: BorderRadius.circular(35),
                      ),
                      child: Stack(
                        children: [
                          Positioned.fill(
                            child: Opacity(
                              opacity: 0.1,
                              child: Image.asset(
                                'assets/uventerelements.png',
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'We execute events\nthat matter.',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 34,
                                  fontWeight: FontWeight.w800,
                                  height: 1.1,
                                  letterSpacing: -0.5,
                                ),
                              ),
                              const SizedBox(height: 16),
                              const Text(
                                'Corporate events, business experiences, and professional execution—delivered with precision.',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  height: 1.5,
                                ),
                              ),
                              const SizedBox(height: 28),
                              ElevatedButton(
                                onPressed: () async {
                                  await Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => const AddEventScreen(),
                                    ),
                                  );
                                  _refreshEvents();
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.primaryYellow,
                                  foregroundColor: Colors.black,
                                  minimumSize: Size.zero,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 28, vertical: 16,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(30),
                                  ),
                                  elevation: 0,
                                ),
                                child: const Text(
                                  'Plan Your Event',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // ─── FEATURED EVENTS CARD ────────────────────────────────────
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: GestureDetector(
                  onTap: () => _scrollToKey(_upcomingEventsKey),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(28),
                    child: SizedBox(
                      height: 360,
                      width: double.infinity,
                      child: Stack(
                        children: [
                          // ── TOP: Yellow background ───────────────────────
                          Positioned(
                            top: 0, left: 0, right: 0,
                            height: 155,
                            child: Container(color: AppTheme.primaryYellow),
                          ),

                          // ── BOTTOM: featuredeventcard.jpeg ───────────────
                          Positioned(
                            bottom: 0, left: 0, right: 0,
                            height: 225,
                            child: Image.asset(
                              'assets/featuredeventcard.jpeg',
                              fit: BoxFit.cover,
                              colorBlendMode: BlendMode.saturation,
                              color: Colors.grey,
                              errorBuilder: (ctx, e, st) => Image.asset(
                                'assets/featured-card.png',
                                fit: BoxFit.cover,
                                color: Colors.grey,
                                colorBlendMode: BlendMode.saturation,
                              ),
                            ),
                          ),

                          // ── YELLOW CHEVRON PATTERN over photo bottom ─────
                          Positioned(
                            bottom: 0, left: 0, right: 0,
                            height: 100,
                            child: Image.asset(
                              'assets/uventerelements.png',
                              fit: BoxFit.cover,
                              color: AppTheme.primaryYellow.withValues(alpha: 0.9),
                              colorBlendMode: BlendMode.srcIn,
                              errorBuilder: (ctx, e, st) => const SizedBox.shrink(),
                            ),
                          ),

                          // ── CONTENT: Title + arrow ───────────────────────
                          Positioned(
                            top: 0, left: 0, right: 0,
                            height: 155,
                            child: Padding(
                              padding: const EdgeInsets.fromLTRB(24, 22, 24, 0),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Expanded(
                                    child: Text(
                                      'Featured\nEvents',
                                      style: TextStyle(
                                        fontFamily: 'SF Pro Display',
                                        color: AppTheme.primaryBlue,
                                        fontSize: 44,
                                        fontWeight: FontWeight.w900,
                                        height: 1.05,
                                        letterSpacing: -1,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    width: 44,
                                    height: 44,
                                    margin: const EdgeInsets.only(top: 4),
                                    decoration: const BoxDecoration(
                                      color: AppTheme.primaryBlue,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(
                                      Icons.arrow_downward_rounded,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // ─── EVENTS THIS WEEK SECTION ────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 0, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'EVENTS THIS WEEK',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.textDark,
                        letterSpacing: -0.2,
                      ),
                    ),
                    const SizedBox(height: 16),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      child: Row(
                        children: [
                          _buildDayCard('Today', _getFormattedDate(DateTime.now()), _eventCounts['today'] ?? 0),
                          const SizedBox(width: 12),
                          _buildDayCard('Tomorrow', _getFormattedDate(DateTime.now().add(const Duration(days: 1))), _eventCounts['tomorrow'] ?? 0),
                          const SizedBox(width: 12),
                          _buildDayCard('Weekend', _getWeekendRange(), _eventCounts['weekend'] ?? 0),
                          const SizedBox(width: 20),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // ─── SERVICES SECTION ────────────────────────────────────────
              Padding(
                key: _servicesKey,
                padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(width: 20, height: 1, color: AppTheme.primaryYellow),
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            'WHAT WE DO',
                            style: TextStyle(
                              fontSize: 12,
                              letterSpacing: 4,
                              color: AppTheme.textGrey,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        Container(width: 20, height: 1, color: AppTheme.primaryYellow),
                      ],
                    ),
                    const SizedBox(height: 16),
                    RichText(
                      textAlign: TextAlign.center,
                      text: const TextSpan(
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.textDark,
                          letterSpacing: -0.5,
                          height: 1.1,
                          fontFamily: 'SF Pro Display',
                        ),
                        children: [
                          TextSpan(text: 'A complete suite of\npremium '),
                          TextSpan(
                            text: 'event services.',
                            style: TextStyle(color: AppTheme.primaryYellow),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'From planning to execution, we deliver experiences that connect people and elevate brands.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.textGrey,
                        height: 1.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 32),
                    
                    // Services Grid - 2 columns for better readability on mobile
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _services.length,
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.75,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      itemBuilder: (context, index) {
                        return _buildServiceCard(_services[index]);
                      },
                    ),
                    
                    const SizedBox(height: 40),
                    
                    // CTA Section
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: AppTheme.borderGrey),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.03),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 50, height: 50,
                                decoration: const BoxDecoration(
                                  color: AppTheme.primaryYellow,
                                  shape: BoxShape.circle,
                                ),
                                child: const Center(
                                  child: Text('u', style: TextStyle(
                                    fontSize: 28, fontWeight: FontWeight.w900, color: AppTheme.primaryBlue
                                  )),
                                ),
                              ),
                              const SizedBox(width: 16),
                              const Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Ready to host your next event?',
                                      style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                                    ),
                                    Text(
                                      "Let's create something extraordinary together.",
                                      style: TextStyle(color: AppTheme.textGrey, fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: () => _scrollToKey(_upcomingEventsKey),
                                  style: OutlinedButton.styleFrom(
                                    side: const BorderSide(color: AppTheme.primaryBlue),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                  ),
                                  child: const Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text('Explore Events', style: TextStyle(color: AppTheme.primaryBlue, fontWeight: FontWeight.bold, fontSize: 13)),
                                      SizedBox(width: 4),
                                      Icon(Icons.arrow_forward, size: 14, color: AppTheme.primaryBlue),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () async {
                                    await Navigator.push(
                                      context,
                                      MaterialPageRoute(builder: (context) => const AddEventScreen()),
                                    );
                                    _refreshEvents();
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.primaryYellow,
                                    foregroundColor: Colors.black,
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                  ),
                                  child: const Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text('Book Now', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                      SizedBox(width: 4),
                                      Icon(Icons.arrow_forward, size: 14),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),


              // ─── UPCOMING EVENTS SECTION ─────────────────────────────────
              Padding(
                key: _upcomingEventsKey,
                padding: const EdgeInsets.fromLTRB(16, 48, 16, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Upcoming Events',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textDark,
                        letterSpacing: -0.5,
                      ),
                    ),
                    TextButton(
                      onPressed: _refreshEvents,
                      child: const Text(
                        'Refresh',
                        style: TextStyle(
                          color: AppTheme.primaryYellow,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Search bar
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Search events...',
                    hintStyle: const TextStyle(color: AppTheme.textGrey),
                    prefixIcon: const Icon(Icons.search, color: AppTheme.textGrey),
                    filled: true,
                    fillColor: AppTheme.surfaceGrey,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),

              // Events list
              FutureBuilder<List<Map<String, dynamic>>>(
                future: _eventsFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(
                      child: Padding(
                        padding: EdgeInsets.all(40),
                        child: CircularProgressIndicator(color: AppTheme.primaryYellow),
                      ),
                    );
                  }
                  if (snapshot.hasError) {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.all(40),
                        child: Text(
                          'Error: ${snapshot.error}',
                          style: const TextStyle(color: AppTheme.textGrey),
                        ),
                      ),
                    );
                  }
                  final events = snapshot.data ?? [];
                  if (events.isEmpty) {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.all(40),
                        child: Column(
                          children: [
                            Icon(Icons.event_available_outlined,
                                size: 64, color: Colors.grey.shade300),
                            const SizedBox(height: 16),
                            const Text(
                              'No events available yet.',
                              style: TextStyle(color: AppTheme.textGrey),
                            ),
                          ],
                        ),
                      ),
                    );
                  }
                  return ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
                    itemCount: events.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 16),
                    itemBuilder: (context, index) {
                      final event = events[index];
                      final date = DateTime.tryParse(event['event_date'] ?? '') ?? DateTime.now();
                      final dateStr = '${date.day}/${date.month}/${date.year}';
                      final price = event['price'] ?? 0;
                      final category = event['category'] ?? 'EVENT';
                      return _buildEventCard(
                        context,
                        id: event['id']?.toString() ?? '',
                        title: event['event_name'] ?? 'Untitled',
                        category: category.toString().toUpperCase(),
                        date: dateStr,
                        location: event['location'] ?? 'See event details',
                        imageUrl: event['image_url'] ?? '',
                        price: price is int ? price : (price as num).toInt(),
                        paymentLink: event['payment_link']?.toString(),
                      );
                    },
                  );
                },
              ),

              // ─── NEWSLETTER SECTION ──────────────────────────────────────
              Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 24),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceGrey,
                  borderRadius: BorderRadius.circular(35),
                ),
                child: Column(
                  children: [
                    const Text(
                      'Stay in the Loop',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textDark,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Subscribe to our newsletter to get the latest event updates delivered to your inbox.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: AppTheme.textGrey, fontSize: 14, height: 1.5),
                    ),
                    const SizedBox(height: 32),
                    TextField(
                      decoration: InputDecoration(
                        hintText: 'Enter your email',
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(30),
                          borderSide: const BorderSide(color: AppTheme.borderGrey),
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryYellow,
                        foregroundColor: Colors.black,
                        minimumSize: const Size(double.infinity, 56),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                      ),
                      child: const Text('Subscribe Now', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
      extendBody: true,
      bottomNavigationBar: _buildCustomBottomNav(),
      drawer: const SideNavDrawer(),
    );
  }

  Widget _buildCustomBottomNav() {
    return SafeArea(
      child: Container(
        height: 80,
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 20),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo Segment
            GestureDetector(
              onTap: () {
                _scrollController.animateTo(0, duration: const Duration(milliseconds: 500), curve: Curves.easeInOut);
              },
              child: Container(
                height: 56, width: 56,
                decoration: const BoxDecoration(
                  color: AppTheme.primaryYellow,
                  shape: BoxShape.circle,
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(28),
                  child: Image.asset(
                    'assets/uapplogoicon.png',
                    fit: BoxFit.cover,
                    errorBuilder: (ctx, e, st) => const Center(
                      child: Text(
                        'u',
                        style: TextStyle(
                          color: AppTheme.primaryBlue,
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Middle Navigation Segment (Glassmorphism)
            Expanded(
              flex: 3,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(30),
                child: BackdropFilter(
                  filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    height: 56,
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.8),
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildNavText('Event', false, () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const AddEventScreen()),
                          ).then((_) => _refreshEvents());
                        }),
                        _buildNavDivider(),
                        _buildNavText('Support', false, () {
                          _scrollToKey(_servicesKey);
                        }),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Events Segment
            Expanded(
              flex: 2,
              child: GestureDetector(
                onTap: () => _scrollToKey(_upcomingEventsKey),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(30),
                  child: BackdropFilter(
                    filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      height: 56,
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.8),
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                      ),
                      child: const Center(
                        child: Text(
                          'Events',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            fontFamily: 'SF Pro Display',
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavText(String label, bool isActive, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 13,
          fontWeight: FontWeight.w700,
          fontFamily: 'SF Pro Display',
        ),
      ),
    );
  }

  Widget _buildNavDivider() {
    return Container(
      height: 12,
      width: 1,
      color: Colors.white.withValues(alpha: 0.2),
    );
  }

  Widget _buildFeaturedCard(String title, String category, String imageUrl) {
    return Container(
      width: 280,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        image: DecorationImage(
          image: NetworkImage(imageUrl),
          fit: BoxFit.cover,
        ),
      ),
      child: Stack(
        children: [
          // Gradient Overlay
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(28),
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.8),
                  ],
                  stops: const [0.6, 1.0],
                ),
              ),
            ),
          ),
          // Category Badge
          Positioned(
            top: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.6),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                category,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
            ),
          ),
          // Title
          Positioned(
            bottom: 24,
            left: 20,
            right: 20,
            child: Text(
              title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.w800,
                height: 1.2,
                letterSpacing: -0.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDayCard(String day, String date, int count) {
    return Container(
      width: 140,
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderGrey.withValues(alpha: 0.5)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            day,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
              color: AppTheme.textDark,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            date,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppTheme.textGrey,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.surfaceGrey,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              '$count events',
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: AppTheme.textDark,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard(Map<String, dynamic> service) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderGrey),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: (service['color'] as Color).withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  service['icon'] as IconData,
                  color: service['color'] as Color,
                  size: 22,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                service['title'] as String,
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 14,
                  color: AppTheme.textDark,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 8),
              Expanded(
                child: Text(
                  service['desc'] as String,
                  style: const TextStyle(
                    fontSize: 10,
                    color: AppTheme.textGrey,
                    height: 1.4,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 4,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          Positioned(
            bottom: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: (service['color'] as Color).withValues(alpha: 0.3)),
              ),
              child: Icon(
                Icons.arrow_forward,
                size: 10,
                color: service['color'] as Color,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProcessStep(String num, String title, String desc, bool hasBorder) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        border: hasBorder ? const Border(bottom: BorderSide(color: AppTheme.textDark, width: 1)) : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(num, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textGrey, fontSize: 12, letterSpacing: 2)),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 24, color: AppTheme.textDark)),
          const SizedBox(height: 8),
          Text(desc, style: const TextStyle(color: AppTheme.textGrey, fontSize: 14, height: 1.5, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildEventCard(
    BuildContext context, {
    required String id,
    required String title,
    required String category,
    required String date,
    required String location,
    required String imageUrl,
    required int price,
    String? paymentLink,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => EventDetailScreen(
              id: id,
              title: title,
              location: location,
              date: date,
              imageUrl: imageUrl,
              price: price,
              paymentLink: paymentLink,
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(40),
          border: Border.all(color: AppTheme.borderGrey),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Event image with category badge
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
                  child: imageUrl.isNotEmpty
                      ? Image.network(
                          imageUrl,
                          height: 220,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (ctx, e, st) => Container(
                            height: 220,
                            color: AppTheme.surfaceGrey,
                            child: const Icon(
                              Icons.broken_image_outlined,
                              color: AppTheme.textGrey,
                              size: 48,
                            ),
                          ),
                        )
                      : Container(
                          height: 220,
                          color: AppTheme.surfaceGrey,
                          child: const Icon(
                            Icons.image_outlined,
                            color: AppTheme.textGrey,
                            size: 48,
                          ),
                        ),
                ),
                Positioned(
                  top: 16,
                  left: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      category,
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.primaryBlue,
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            // Event details
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textDark,
                            letterSpacing: -0.3,
                            height: 1.2,
                          ),
                        ),
                      ),
                      Container(
                        height: 40,
                        width: 40,
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceGrey,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.arrow_outward, size: 18, color: AppTheme.textDark),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Date and Location
                  Row(
                    children: [
                      const Icon(Icons.calendar_today_outlined,
                          size: 14, color: AppTheme.primaryYellow),
                      const SizedBox(width: 6),
                      Text(
                        date,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textDark,
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Icon(Icons.location_on_outlined,
                          size: 14, color: AppTheme.primaryYellow),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          location,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textGrey,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Divider(color: AppTheme.borderGrey),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => EventDetailScreen(
                                  id: id,
                                  title: title,
                                  location: location,
                                  date: date,
                                  imageUrl: imageUrl,
                                  price: price,
                                  paymentLink: paymentLink,
                                ),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.surfaceGrey,
                            foregroundColor: AppTheme.textDark,
                            elevation: 0,
                            minimumSize: const Size(double.infinity, 52),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                          child: const Text('Explore', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                        ),
                      ),
                      if (paymentLink != null && paymentLink.isNotEmpty) ...[
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              showDialog(
                                context: context,
                                builder: (context) => LeadCaptureDialog(
                                  eventId: id,
                                  eventName: title,
                                  price: price,
                                  paymentLink: paymentLink,
                                ),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primaryYellow,
                              foregroundColor: Colors.black,
                              elevation: 0,
                              minimumSize: const Size(double.infinity, 52),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                              ),
                            ),
                            child: const Text('Book Now', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturedHeaderCard() {
    return Container(
      width: 300,
      decoration: BoxDecoration(
        color: AppTheme.primaryYellow,
        borderRadius: BorderRadius.circular(32),
      ),
      clipBehavior: Clip.hardEdge,
      child: Stack(
        children: [
          // Background image (B&W crowd photo)
          Positioned.fill(
            left: 100,
            child: Image.asset(
              'assets/featured-card.png',
              fit: BoxFit.cover,
              color: Colors.black.withValues(alpha: 0.15),
              colorBlendMode: BlendMode.darken,
              errorBuilder: (ctx, e, st) => Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppTheme.primaryYellow,
                      Colors.black.withValues(alpha: 0.5),
                    ],
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                ),
              ),
            ),
          ),

          // Yellow diagonal stripes overlay (bottom right)
          Positioned(
            bottom: 80,
            right: -10,
            child: Opacity(
              opacity: 0.25,
              child: Image.asset(
                'assets/uventerelements.png',
                width: 120,
                height: 120,
                fit: BoxFit.cover,
                errorBuilder: (ctx, e, st) => const SizedBox.shrink(),
              ),
            ),
          ),

          // Content
          Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // FEATURED badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryBlue,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.star_rounded, color: AppTheme.primaryYellow, size: 14),
                      SizedBox(width: 6),
                      Text(
                        'FEATURED',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Big heading
                const Text(
                  'Explore Top\nEvents',
                  style: TextStyle(
                    color: AppTheme.primaryBlue,
                    fontSize: 36,
                    fontWeight: FontWeight.w900,
                    height: 1.1,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 10),

                // Subtitle
                const Text(
                  'Discover handpicked\nevents just for you.',
                  style: TextStyle(
                    color: AppTheme.primaryBlue,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 20),

                // Down arrow circle
                Container(
                  width: 44,
                  height: 44,
                  decoration: const BoxDecoration(
                    color: AppTheme.primaryBlue,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.arrow_downward_rounded,
                    color: AppTheme.primaryYellow,
                    size: 22,
                  ),
                ),

                const Spacer(),

                // Bottom bar — Explore Events button only
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryBlue,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Explore Events',
                        style: TextStyle(
                          color: AppTheme.primaryYellow,
                          fontWeight: FontWeight.w900,
                          fontSize: 14,
                        ),
                      ),
                      SizedBox(width: 6),
                      Icon(Icons.arrow_forward_rounded, color: AppTheme.primaryYellow, size: 16),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _scrollToKey(GlobalKey key) {
    if (key.currentContext != null) {
      Scrollable.ensureVisible(
        key.currentContext!,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    }
  }
}
