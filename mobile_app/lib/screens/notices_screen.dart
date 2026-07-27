import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/app_theme.dart';

class NoticesScreen extends StatefulWidget {
  const NoticesScreen({super.key});

  @override
  State<NoticesScreen> createState() => _NoticesScreenState();
}

class _NoticesScreenState extends State<NoticesScreen> {
  final List<Map<String, dynamic>> _notices = [
    {
      'id': '1',
      'type': 'ANNOUNCEMENT',
      'date': 'May 15, 2026',
      'title': 'Annual Day Celebration',
      'content': 'The Annual Day celebration will be held on May 28th, 2026 at the School Auditorium. All parents are cordially invited. Students participating in cultural programs must attend rehearsals from May 20th onwards.',
      'parentSignatureRequired': true,
      'signed': false,
      'color': AppTheme.accentOrange,
    },
    {
      'id': '2',
      'type': 'HOLIDAY',
      'date': 'May 12, 2026',
      'title': 'Summer Vacation Notice',
      'content': 'School will remain closed for summer vacation from June 1st to June 30th, 2026. School reopens on July 1st. Summer homework packets will be distributed on May 25th.',
      'parentSignatureRequired': false,
      'color': AppTheme.accentGreen,
      'highlight': true,
    },
    {
      'id': '3',
      'type': 'EVENT',
      'date': 'May 10, 2026',
      'title': 'Field Trip to Science Museum',
      'content': 'A field trip to the Regional Science Museum is planned for May 22nd for Classes 7-9. Permission slips must be signed and returned by May 18th. Bus fee: ₹200. Lunch will be provided.',
      'parentSignatureRequired': true,
      'urgent': true,
      'signed': false,
      'color': AppTheme.accentRed,
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      appBar: AppBar(
        title: Text('Notice Board', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.bgPrimary,
        elevation: 0,
      ),
      body: Stack(
        children: [
          // Timeline Line
          Positioned(
            left: 29,
            top: 20,
            bottom: 20,
            width: 2,
            child: Container(
              color: AppTheme.divider,
            ),
          ),
          ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            itemCount: _notices.length,
            itemBuilder: (ctx, i) {
              final notice = _notices[i];
              final color = notice['color'] as Color;
              final isUrgent = notice['urgent'] == true;
              final isHighlight = notice['highlight'] == true;

              return Padding(
                padding: const EdgeInsets.only(bottom: 24),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Timeline Dot
                    Container(
                      margin: const EdgeInsets.only(left: 6, right: 16, top: 12),
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: color.withValues(alpha: 0.5),
                            blurRadius: 8,
                            spreadRadius: 1,
                          )
                        ],
                        border: Border.all(color: AppTheme.bgPrimary, width: 2),
                      ),
                    ),
                    // Notice Card
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.bgCard,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isUrgent
                                ? AppTheme.accentRed
                                : isHighlight
                                    ? AppTheme.accentOrange
                                    : AppTheme.divider,
                            width: (isUrgent || isHighlight) ? 1.5 : 0.5,
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: color.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(4),
                                        border: Border.all(color: color.withValues(alpha: 0.3)),
                                      ),
                                      child: Text(
                                        notice['type'],
                                        style: GoogleFonts.inter(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: color,
                                        ),
                                      ),
                                    ),
                                    if (isUrgent) ...[
                                      const SizedBox(width: 8),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: AppTheme.accentRed.withValues(alpha: 0.2),
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Row(
                                          children: [
                                            const Icon(Icons.warning_amber_rounded, size: 10, color: Colors.white),
                                            const SizedBox(width: 4),
                                            Text(
                                              'URGENT',
                                              style: GoogleFonts.inter(
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                                Text(
                                  notice['date'],
                                  style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              notice['title'],
                              style: GoogleFonts.outfit(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              notice['content'],
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                color: AppTheme.textSecondary,
                                height: 1.5,
                              ),
                            ),
                            if (notice['parentSignatureRequired'] == true) ...[
                              const SizedBox(height: 12),
                              const Divider(color: AppTheme.divider, height: 1),
                              const SizedBox(height: 10),
                              InkWell(
                                onTap: () {
                                  setState(() {
                                    notice['signed'] = !notice['signed'];
                                  });
                                },
                                borderRadius: BorderRadius.circular(8),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 4),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      SizedBox(
                                        width: 20,
                                        height: 20,
                                        child: Checkbox(
                                          value: notice['signed'],
                                          onChanged: (val) {
                                            setState(() {
                                              notice['signed'] = val;
                                            });
                                          },
                                          activeColor: AppTheme.accentIndigo,
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                      Text(
                                        notice['signed']
                                            ? 'Parent Signed ✓'
                                            : 'Parent Signature Required',
                                        style: GoogleFonts.inter(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: notice['signed'] ? AppTheme.accentGreen : AppTheme.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
