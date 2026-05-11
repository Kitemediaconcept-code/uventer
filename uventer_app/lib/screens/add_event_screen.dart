import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../theme.dart';
import '../services/supabase_service.dart';

class AddEventScreen extends StatefulWidget {
  const AddEventScreen({super.key});

  @override
  State<AddEventScreen> createState() => _AddEventScreenState();
}

class _AddEventScreenState extends State<AddEventScreen> {
  final _formKey = GlobalKey<FormState>();
  final _supabaseService = SupabaseService();
  
  final _nameController = TextEditingController();
  final _eventNameController = TextEditingController();
  final _contactController = TextEditingController();
  final _locationController = TextEditingController();
  final _budgetController = TextEditingController();
  final _visionController = TextEditingController();
  final _paymentLinkController = TextEditingController();
  
  DateTime? _startDate;
  DateTime? _endDate;
  String? _selectedSlot;
  
  File? _imageFile;
  Uint8List? _imageBytes;
  String? _imageExtension;
  bool _isLoading = false;

  final List<String> _timeSlots = [
    'Morning (9 AM – 12 PM)',
    'Afternoon (12 PM – 4 PM)',
    'Evening (4 PM – 8 PM)',
    'Full Day'
  ];

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery, imageQuality: 70);
    if (image != null) {
      final bytes = await image.readAsBytes();
      setState(() {
        _imageFile = File(image.path);
        _imageBytes = bytes;
        _imageExtension = image.path.split('.').last;
      });
    }
  }

  Future<void> _selectDate(bool isStart) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime(2030),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppTheme.primaryYellow,
              onPrimary: Colors.black,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        if (isStart) _startDate = picked; else _endDate = picked;
      });
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    if (_startDate == null || _endDate == null || _selectedSlot == null || _imageBytes == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all fields and upload an image')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      await _supabaseService.submitEvent(
        name: _nameController.text,
        eventName: _eventNameController.text,
        contactDetails: _contactController.text,
        location: _locationController.text,
        startDate: _startDate!,
        endDate: _endDate!,
        timeSlot: _selectedSlot!,
        visionRequirements: _visionController.text,
        budget: double.parse(_budgetController.text),
        imageBytes: _imageBytes!,
        imageExtension: _imageExtension!,
        paymentLink: _paymentLinkController.text,
      );

      if (mounted) {
        _showSuccessDialog();
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 20),
            Container(
              height: 80, width: 80,
              decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle),
              child: const Icon(Icons.check_circle_outline, color: Colors.white, size: 40),
            ),
            const SizedBox(height: 24),
            const Text('Event Submitted! 🎉', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            const Text('Your event has been submitted successfully for admin review.', textAlign: TextAlign.center),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(backgroundColor: Colors.black, foregroundColor: Colors.white),
              child: const Text('Back to Home →'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('Submit Your Event')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Share your experience with the community.', style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 32),
              
              // Image Picker
              _buildLabel('Thumbnail Image'),
              GestureDetector(
                onTap: _pickImage,
                child: Container(
                  height: 220, width: double.infinity,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3F4F6),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: _imageFile != null ? AppTheme.primaryYellow : const Color(0xFFE5E7EB), width: 2),
                  ),
                  child: _imageFile != null
                    ? ClipRRect(borderRadius: BorderRadius.circular(22), child: Image.file(_imageFile!, fit: BoxFit.cover))
                    : const Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                        Icon(Icons.cloud_upload_outlined, size: 40, color: AppTheme.primaryYellow),
                        SizedBox(height: 12),
                        Text('Click to upload thumbnail', style: TextStyle(fontWeight: FontWeight.bold)),
                      ]),
                ),
              ),
              const SizedBox(height: 24),

              _buildField('YOUR NAME', _nameController, 'Enter your full name', Icons.person_outline),
              _buildField('EVENT NAME', _eventNameController, 'e.g. Annual Tech Symposium', Icons.tag),
              _buildField('CONTACT DETAILS', _contactController, 'Email or Phone Number', Icons.phone_outlined),
              _buildField('CITY / LOCATION', _locationController, 'Enter city or venue', Icons.location_on_outlined),
              
              Row(children: [
                Expanded(child: _buildDatePicker('START DATE', _startDate, () => _selectDate(true))),
                const SizedBox(width: 16),
                Expanded(child: _buildDatePicker('END DATE', _endDate, () => _selectDate(false))),
              ]),

              _buildLabel('PREFERRED TIME SLOT'),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(16)),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedSlot,
                    isExpanded: true,
                    hint: const Text('Select a slot'),
                    items: _timeSlots.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                    onChanged: (v) => setState(() => _selectedSlot = v),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              _buildField('ENTRY PRICE (₹)', _budgetController, '0.00', Icons.currency_rupee, keyboard: TextInputType.number),
              
              _buildField('PAYMENT / BOOKING LINK (OPTIONAL)', _paymentLinkController, 'https://...', Icons.link),

              _buildLabel('VISION & REQUIREMENTS'),
              TextFormField(
                controller: _visionController,
                maxLines: 4,
                decoration: InputDecoration(
                  hintText: 'Describe your event goals...',
                  filled: true, fillColor: const Color(0xFFF3F4F6),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 40),
              
              SizedBox(
                width: double.infinity, height: 60,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submitForm,
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryYellow, foregroundColor: Colors.black),
                  child: _isLoading ? const CircularProgressIndicator() : const Text('Submit Event for Review'),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) => Padding(padding: const EdgeInsets.only(bottom: 8), child: Text(text, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 1.5)));

  Widget _buildField(String label, TextEditingController ctrl, String hint, IconData icon, {TextInputType keyboard = TextInputType.text}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      _buildLabel(label),
      TextFormField(
        controller: ctrl, keyboardType: keyboard,
        decoration: InputDecoration(
          hintText: hint, prefixIcon: Icon(icon, color: AppTheme.primaryYellow, size: 20),
          filled: true, fillColor: const Color(0xFFF3F4F6),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
        ),
      ),
      const SizedBox(height: 16),
    ]);
  }

  Widget _buildDatePicker(String label, DateTime? date, VoidCallback onTap) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      _buildLabel(label),
      InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(16)),
          child: Row(children: [
            const Icon(Icons.calendar_today_outlined, size: 18, color: AppTheme.primaryYellow),
            const SizedBox(width: 10),
            Text(date == null ? 'Select' : '${date.day}/${date.month}', style: const TextStyle(fontWeight: FontWeight.bold)),
          ]),
        ),
      ),
      const SizedBox(height: 16),
    ]);
  }
}
