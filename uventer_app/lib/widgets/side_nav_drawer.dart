import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme.dart';

class SideNavDrawer extends StatelessWidget {
  const SideNavDrawer({super.key});

  Future<void> _launchUrl(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
      child: Column(
        children: [
          // Header with Logo
          DrawerHeader(
            decoration: const BoxDecoration(
              color: Colors.white,
            ),
            child: Center(
              child: Image.asset(
                'assets/uventer-logo.png',
                height: 35,
                errorBuilder: (context, error, stackTrace) => const Text(
                  'uventer',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: AppTheme.textDark,
                    letterSpacing: -1,
                  ),
                ),
              ),
            ),
          ),

          // Scrollable List
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _buildSectionHeader('EVENTS'),
                _buildDrawerItem(
                  icon: Icons.add_circle_outline_rounded,
                  title: 'Create New Event',
                  onTap: () => Navigator.pop(context),
                ),
                _buildDrawerItem(
                  icon: Icons.explore_outlined,
                  title: 'Events Near Me',
                  onTap: () => Navigator.pop(context),
                ),
                _buildDrawerItem(
                  icon: Icons.calendar_month_outlined,
                  title: 'Calendar',
                  onTap: () => Navigator.pop(context),
                ),
                _buildDrawerItem(
                  icon: Icons.history_rounded,
                  title: 'Past Events',
                  onTap: () => Navigator.pop(context),
                ),
                
                const SizedBox(height: 24),
                _buildSectionHeader('SUPPORT'),
                _buildDrawerItem(
                  icon: Icons.info_outline_rounded,
                  title: 'About Us',
                  onTap: () => Navigator.pop(context),
                ),
                _buildDrawerItem(
                  icon: Icons.chat_bubble_outline_rounded,
                  title: 'Contact Us',
                  onTap: () => Navigator.pop(context),
                ),

                const SizedBox(height: 24),
                _buildSectionHeader('MORE'),
                _buildDrawerItem(
                  icon: Icons.description_outlined,
                  title: 'Terms & Conditions',
                  onTap: () => Navigator.pop(context),
                ),
                _buildDrawerItem(
                  icon: Icons.login_rounded,
                  title: 'Log In',
                  onTap: () => Navigator.pop(context),
                ),
              ],
            ),
          ),

          // Footer with Social Media
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _buildSocialIcon(Icons.camera_alt_outlined, 'https://instagram.com'),
                    const SizedBox(width: 20),
                    _buildSocialIcon(Icons.alternate_email_rounded, 'https://twitter.com'),
                    const SizedBox(width: 20),
                    _buildSocialIcon(Icons.facebook_outlined, 'https://facebook.com'),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'v1.1.0',
                  style: TextStyle(
                    color: AppTheme.textGrey,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 12, bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          color: AppTheme.textGrey,
          fontSize: 12,
          fontWeight: FontWeight.w800,
          letterSpacing: 1.5,
        ),
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppTheme.surfaceGrey.withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppTheme.textDark, size: 22),
        title: Text(
          title,
          style: const TextStyle(
            color: AppTheme.textDark,
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
        trailing: const Icon(Icons.chevron_right_rounded, color: AppTheme.textGrey, size: 18),
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }

  Widget _buildSocialIcon(IconData icon, String url) {
    return GestureDetector(
      onTap: () => _launchUrl(url),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: AppTheme.surfaceGrey,
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: AppTheme.textDark, size: 20),
      ),
    );
  }
}
