import 'package:flutter/material.dart';
import '../theme.dart';
import '../services/supabase_service.dart';
import 'add_event_screen.dart';
import 'event_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _supabaseService = SupabaseService();
  late Future<List<Map<String, dynamic>>> _eventsFuture;

  @override
  void initState() {
    super.initState();
    _refreshEvents();
  }

  void _refreshEvents() {
    setState(() {
      _eventsFuture = _supabaseService.getEvents();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset(
          'assets/uventer-logo.png',
          height: 45,
          errorBuilder: (context, error, stackTrace) => const Text('UVENTER'),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {},
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async => _refreshEvents(),
        color: AppTheme.primaryTeal,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: Image.asset(
                  'assets/hero-mobile.png',
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'Find Your Next Event',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontSize: 18, // Further reduced
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Experience the best events around you',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontSize: 12, // Further reduced
                ),
              ),
              const SizedBox(height: 24),
              TextField(
                decoration: InputDecoration(
                  hintText: 'Search events...',
                  prefixIcon: const Icon(Icons.search, color: AppTheme.textGrey),
                  filled: true,
                  fillColor: AppTheme.surfaceGrey,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              _buildSectionHeader('Upcoming Events'),
              const SizedBox(height: 16),
              
              FutureBuilder<List<Map<String, dynamic>>>(
                future: _eventsFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator(color: AppTheme.primaryTeal));
                  }
                  
                  if (snapshot.hasError) {
                    return Center(child: Text('Error loading events: ${snapshot.error}'));
                  }
                  
                  final events = snapshot.data ?? [];
                  
                  if (events.isEmpty) {
                    return Center(
                      child: Column(
                        children: [
                          const SizedBox(height: 40),
                          Icon(Icons.event_available_outlined, size: 64, color: Colors.grey.shade300),
                          const SizedBox(height: 16),
                          const Text('No events available yet.', style: TextStyle(color: AppTheme.textGrey)),
                        ],
                      ),
                    );
                  }

                  return ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: events.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 16),
                    itemBuilder: (context, index) {
                      final event = events[index];
                      // Format date from ISO string
                      final date = DateTime.parse(event['event_date']);
                      final dateStr = '${date.day}/${date.month}/${date.year}';
                      
                      return _buildEventCard(
                        context,
                        event['event_name'],
                        'IDR ${event['price']}', // Using price as a subtitle highlight for now
                        dateStr,
                        event['image_url'],
                      );
                    },
                  );
                },
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddEventScreen()),
          );
          _refreshEvents(); // Refresh list after returning from submission
        },
        backgroundColor: AppTheme.primaryTeal,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Event', style: TextStyle(color: Colors.white)),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AppTheme.textDark,
          ),
        ),
        TextButton(
          onPressed: () => _refreshEvents(),
          child: const Text('Refresh', style: TextStyle(color: AppTheme.primaryTeal)),
        ),
      ],
    );
  }

  Widget _buildEventCard(BuildContext context, String title, String location, String date, String imageUrl) {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Image.network(
              imageUrl,
              height: 180,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                height: 180,
                color: AppTheme.surfaceGrey,
                child: const Icon(Icons.broken_image_outlined, color: AppTheme.textGrey),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined, size: 16, color: AppTheme.textGrey),
                    const SizedBox(width: 4),
                    Text(location, style: Theme.of(context).textTheme.bodyMedium),
                    const Spacer(),
                    const Icon(Icons.calendar_today_outlined, size: 16, color: AppTheme.textGrey),
                    const SizedBox(width: 4),
                    Text(date, style: Theme.of(context).textTheme.bodyMedium),
                  ],
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => EventDetailScreen(
                          title: title,
                          location: location,
                          date: date,
                          imageUrl: imageUrl,
                        ),
                      ),
                    );
                  },
                  child: const Text('View Details'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
