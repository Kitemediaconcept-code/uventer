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
    required DateTime eventDate,
    required double price,
    required Uint8List imageBytes,
    required String imageExtension,
  }) async {
    final eventId = _uuid.v4();
    
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

    // 3. Insert into database
    await _client.from('events').insert({
      'id': eventId,
      'name': name,
      'event_name': eventName,
      'contact_details': contactDetails,
      'event_date': eventDate.toIso8601String(),
      'price': price,
      'image_url': imageUrl,
      'status': 'pending',
    });
  }
}
