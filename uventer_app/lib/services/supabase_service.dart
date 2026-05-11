import 'dart:typed_data';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';

class SupabaseService {
  final _client = Supabase.instance.client;
  final _uuid = const Uuid();

  /// Fetches all approved events from the 'events' table.
  Future<List<Map<String, dynamic>>> getEvents() async {
    final response = await _client
        .from('events')
        .select()
        .eq('status', 'approved')
        .order('event_date', ascending: true);
    return List<Map<String, dynamic>>.from(response);
  }

  /// Submits a new event for review.
  Future<void> submitEvent({
    required String name,
    required String eventName,
    required String contactDetails,
    required DateTime startDate,
    required DateTime endDate,
    required String timeSlot,
    required String location,
    required String visionRequirements,
    required double budget,
    required Uint8List imageBytes,
    required String imageExtension,
    String? paymentLink,
  }) async {
    final eventId = _uuid.v4();
    final user = _client.auth.currentUser;
    
    // 1. Upload image to Supabase Storage
    final fileName = '$eventId.$imageExtension';
    final filePath = 'event_images/$fileName';
    
    await _client.storage.from('events').uploadBinary(
          filePath,
          imageBytes,
          fileOptions: const FileOptions(upsert: true),
        );

    // 2. Get Public URL
    final String imageUrl = _client.storage.from('events').getPublicUrl(filePath);

    // 3. Insert into database (matching website fields)
    await _client.from('events').insert({
      'id': eventId,
      'user_id': user?.id,
      'name': name,
      'event_name': eventName,
      'contact_details': contactDetails,
      'event_date': startDate.toIso8601String(), // Legacy
      'start_date': startDate.toIso8601String(),
      'end_date': endDate.toIso8601String(),
      'time_slot': timeSlot,
      'location': location,
      'vision_requirements': visionRequirements,
      'budget': budget,
      'price': budget, // Legacy
      'image_url': imageUrl,
      'payment_link': paymentLink,
      'status': 'pending',
    });
  }

  /// Fetches event counts for Today, Tomorrow, and the Weekend.
  Future<Map<String, int>> getEventCounts() async {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final tomorrow = today.add(const Duration(days: 1));
    
    // Find the next weekend (Saturday and Sunday)
    final daysUntilSaturday = (6 - today.weekday + 7) % 7;
    final saturday = today.add(Duration(days: daysUntilSaturday));
    final sunday = saturday.add(const Duration(days: 1));
    
    final events = await getEvents();
    
    int todayCount = 0;
    int tomorrowCount = 0;
    int weekendCount = 0;
    
    for (var event in events) {
      final dateStr = event['start_date'] ?? event['event_date'];
      final date = DateTime.tryParse(dateStr ?? '')?.toLocal();
      if (date == null) continue;
      
      final eventDay = DateTime(date.year, date.month, date.day);
      
      if (eventDay == today) {
        todayCount++;
      } else if (eventDay == tomorrow) {
        tomorrowCount++;
      }
      
      // If the event is on this upcoming Saturday or Sunday
      if (eventDay == saturday || eventDay == sunday) {
        weekendCount++;
      }
    }
    
    return {
      'today': todayCount,
      'tomorrow': tomorrowCount,
      'weekend': weekendCount,
    };
  }

  /// Records a lead/booking attempt.
  Future<void> recordLead({
    required String eventId,
    required String name,
    required String email,
    required String phone,
    required String occupation,
    required double amount,
  }) async {
    await _client.from('bookings').insert({
      'event_id': eventId,
      'user_name': name,
      'user_email': email,
      'user_phone': phone,
      'occupation': occupation,
      'amount_paid': amount,
      'payment_status': 'lead',
    });
  }
}
