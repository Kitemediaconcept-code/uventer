import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme.dart';
import '../services/supabase_service.dart';

class LeadCaptureDialog extends StatefulWidget {
  final String eventId;
  final String eventName;
  final int price;
  final String paymentLink;

  const LeadCaptureDialog({
    super.key,
    required this.eventId,
    required this.eventName,
    required this.price,
    required this.paymentLink,
  });

  @override
  State<LeadCaptureDialog> createState() => _LeadCaptureDialogState();
}

class _LeadCaptureDialogState extends State<LeadCaptureDialog> {
  final _formKey = GlobalKey<FormState>();
  final _supabaseService = SupabaseService();
  
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  String? _selectedOccupation;
  bool _isLoading = false;

  final List<String> _occupations = [
    'Entrepreneur',
    'Employee',
    'Student',
    'Professional',
    'Others'
  ];

  Future<void> _submitAndRedirect() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedOccupation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select your occupation')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      // Record the lead in Supabase
      await _supabaseService.recordLead(
        eventId: widget.eventId,
        name: _nameController.text,
        email: _emailController.text,
        phone: _phoneController.text,
        occupation: _selectedOccupation!,
        amount: widget.price.toDouble(),
      );

      if (mounted) {
        Navigator.pop(context); // Close dialog
        
        // Redirect to external payment link
        final uri = Uri.parse(widget.paymentLink);
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Could not launch payment link')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Book Your Ticket',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
          ),
          const SizedBox(height: 4),
          Text(
            'Enter details for ${widget.eventName}',
            style: const TextStyle(fontSize: 14, color: Colors.grey, fontWeight: FontWeight.normal),
          ),
        ],
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildField('YOUR NAME', _nameController, 'Enter full name', Icons.person_outline),
              _buildField('PHONE NUMBER', _phoneController, '+91 00000 00000', Icons.phone_outlined, keyboard: TextInputType.phone),
              _buildField('EMAIL ADDRESS', _emailController, 'name@example.com', Icons.email_outlined, keyboard: TextInputType.emailAddress),
              
              const SizedBox(height: 8),
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'WHAT DO YOU DO?',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 1.2),
                ),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedOccupation,
                    isExpanded: true,
                    hint: const Text('Select occupation'),
                    items: _occupations.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                    onChanged: (v) => setState(() => _selectedOccupation = v),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
        ),
        ElevatedButton(
          onPressed: _isLoading ? null : _submitAndRedirect,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.primaryYellow,
            foregroundColor: Colors.black,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: _isLoading 
            ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
            : Text('Pay ₹${widget.price} & Book'),
        ),
      ],
    );
  }

  Widget _buildField(String label, TextEditingController ctrl, String hint, IconData icon, {TextInputType keyboard = TextInputType.text}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 1.2),
          ),
          const SizedBox(height: 8),
          TextFormField(
            controller: ctrl,
            keyboardType: keyboard,
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            decoration: InputDecoration(
              hintText: hint,
              prefixIcon: Icon(icon, color: AppTheme.primaryYellow, size: 20),
              filled: true,
              fillColor: const Color(0xFFF3F4F6),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              contentPadding: const EdgeInsets.symmetric(vertical: 16),
            ),
          ),
        ],
      ),
    );
  }
}
