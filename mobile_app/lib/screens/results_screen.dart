import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/app_theme.dart';

class ResultsScreen extends StatefulWidget {
  const ResultsScreen({super.key});

  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> {
  int _selectedSem = 4;

  final Map<String, dynamic> studentInfo = const {
    'name': 'BHARATH KUMAR A',
    'usn': '4VV25EC032',
    'program': 'Bachelor of Engineering in Electronics & Communication Engineering',
    'year': '2nd Year',
    'currentSem': 4,
  };

  final Map<int, Map<String, dynamic>> semestersData = const {
    1: {
      'sem': 1,
      'sgpa': 9.05,
      'cgpa': 9.05,
      'totalCredits': 20,
      'status': 'PASSED',
      'courses': [
        { 'name': 'Applied Mathematics - I for EEE Stream', 'code': '1BMATE101', 'credits': 4, 'cie': 44, 'see': 33, 'total': 77, 'grade': 'A', 'earned': 4, 'gradePoints': 8, 'creditPoints': 32 },
        { 'name': 'Applied Chemistry for EEE Stream', 'code': '1BCHEE102', 'credits': 3, 'cie': 43, 'see': 44, 'total': 87, 'grade': 'A+', 'earned': 3, 'gradePoints': 9, 'creditPoints': 27 },
        { 'name': 'Elements of Electronics Engineering', 'code': '1BEECT103', 'credits': 3, 'cie': 47, 'see': 36, 'total': 83, 'grade': 'A+', 'earned': 3, 'gradePoints': 9, 'creditPoints': 27 },
        { 'name': 'Introduction to AI & its Applications', 'code': '1BAIAK104', 'credits': 2, 'cie': 48, 'see': 43, 'total': 91, 'grade': 'O', 'earned': 2, 'gradePoints': 10, 'creditPoints': 20 },
        { 'name': 'Introduction to Mechanical Engineering', 'code': '1BIMEK105', 'credits': 3, 'cie': 46, 'see': 36, 'total': 82, 'grade': 'A+', 'earned': 3, 'gradePoints': 9, 'creditPoints': 27 },
        { 'name': 'Applied Chemistry Lab for EEE Stream', 'code': '1BCHEEL106', 'credits': 1, 'cie': 50, 'see': 49, 'total': 99, 'grade': 'O', 'earned': 1, 'gradePoints': 10, 'creditPoints': 10 },
        { 'name': 'Elements of Electronics Engineering Lab', 'code': '1BEECTL107', 'credits': 1, 'cie': 45, 'see': 44, 'total': 89, 'grade': 'A+', 'earned': 1, 'gradePoints': 9, 'creditPoints': 9 },
        { 'name': 'Communication Skills - I', 'code': '1BENGK108', 'credits': 1, 'cie': 44, 'see': 46, 'total': 90, 'grade': 'O', 'earned': 1, 'gradePoints': 10, 'creditPoints': 10 },
        { 'name': 'Design Thinking and Tinkering Lab', 'code': '1BDTTK109', 'credits': 1, 'cie': 45, 'see': 48, 'total': 93, 'grade': 'O', 'earned': 1, 'gradePoints': 10, 'creditPoints': 10 },
        { 'name': 'Samskruthika Kannada', 'code': '1BKSKK110', 'credits': 1, 'cie': 50, 'see': 38, 'total': 88, 'grade': 'A+', 'earned': 1, 'gradePoints': 9, 'creditPoints': 9 }
      ]
    },
    2: {
      'sem': 2,
      'sgpa': 9.20,
      'cgpa': 9.13,
      'totalCredits': 20,
      'status': 'PASSED',
      'courses': [
        { 'name': 'Applied Mathematics - II', 'code': '1BMATE201', 'credits': 4, 'cie': 45, 'see': 42, 'total': 87, 'grade': 'A+', 'earned': 4, 'gradePoints': 9, 'creditPoints': 36 },
        { 'name': 'Applied Physics for ECE', 'code': '1BPHY202', 'credits': 3, 'cie': 48, 'see': 45, 'total': 93, 'grade': 'O', 'earned': 3, 'gradePoints': 10, 'creditPoints': 30 },
        { 'name': 'Basic Electrical Engineering', 'code': '1BEE203', 'credits': 3, 'cie': 42, 'see': 38, 'total': 80, 'grade': 'A', 'earned': 3, 'gradePoints': 8, 'creditPoints': 24 },
        { 'name': 'Introduction to Python Programming', 'code': '1BPY204', 'credits': 2, 'cie': 49, 'see': 46, 'total': 95, 'grade': 'O', 'earned': 2, 'gradePoints': 10, 'creditPoints': 20 },
        { 'name': 'Digital Electronics', 'code': '1BDE205', 'credits': 3, 'cie': 48, 'see': 44, 'total': 92, 'grade': 'O', 'earned': 3, 'gradePoints': 10, 'creditPoints': 30 },
        { 'name': 'Applied Physics Lab', 'code': '1BPHYL206', 'credits': 1, 'cie': 50, 'see': 48, 'total': 98, 'grade': 'O', 'earned': 1, 'gradePoints': 10, 'creditPoints': 10 },
        { 'name': 'Basic Electrical Lab', 'code': '1BEEL207', 'credits': 1, 'cie': 44, 'see': 38, 'total': 82, 'grade': 'A', 'earned': 1, 'gradePoints': 8, 'creditPoints': 8 },
        { 'name': 'Constitution of India', 'code': '1BCOI208', 'credits': 1, 'cie': 45, 'see': 36, 'total': 81, 'grade': 'A', 'earned': 1, 'gradePoints': 8, 'creditPoints': 8 },
        { 'name': 'English for Engineers', 'code': '1BENG209', 'credits': 1, 'cie': 48, 'see': 46, 'total': 94, 'grade': 'O', 'earned': 1, 'gradePoints': 10, 'creditPoints': 10 },
        { 'name': 'Innovation & Design Thinking Lab', 'code': '1BIDT210', 'credits': 1, 'cie': 43, 'see': 39, 'total': 82, 'grade': 'A', 'earned': 1, 'gradePoints': 8, 'creditPoints': 8 }
      ]
    },
    3: {
      'sem': 3,
      'sgpa': 9.50,
      'cgpa': 9.25,
      'totalCredits': 20,
      'status': 'PASSED',
      'courses': [
        { 'name': 'Network Analysis', 'code': '1BECT301', 'credits': 4, 'cie': 46, 'see': 42, 'total': 88, 'grade': 'A+', 'earned': 4, 'gradePoints': 9, 'creditPoints': 36 },
        { 'name': 'Analog Electronics', 'code': '1BECT302', 'credits': 4, 'cie': 49, 'see': 48, 'total': 97, 'grade': 'O', 'earned': 4, 'gradePoints': 10, 'creditPoints': 40 },
        { 'name': 'Signals and Systems', 'code': '1BECT303', 'credits': 3, 'cie': 48, 'see': 46, 'total': 94, 'grade': 'O', 'earned': 3, 'gradePoints': 10, 'creditPoints': 30 },
        { 'name': 'Microcontroller & Applications', 'code': '1BECT304', 'credits': 3, 'cie': 46, 'see': 41, 'total': 87, 'grade': 'A+', 'earned': 3, 'gradePoints': 9, 'creditPoints': 27 },
        { 'name': 'Electronic Devices & Circuits', 'code': '1BECT305', 'credits': 3, 'cie': 45, 'see': 42, 'total': 87, 'grade': 'A+', 'earned': 3, 'gradePoints': 9, 'creditPoints': 27 },
        { 'name': 'Analog Electronics Lab', 'code': '1BECTL306', 'credits': 1, 'cie': 50, 'see': 47, 'total': 97, 'grade': 'O', 'earned': 1, 'gradePoints': 10, 'creditPoints': 10 },
        { 'name': 'Microcontroller Lab', 'code': '1BECTL307', 'credits': 1, 'cie': 48, 'see': 48, 'total': 96, 'grade': 'O', 'earned': 1, 'gradePoints': 10, 'creditPoints': 10 },
        { 'name': 'Social Connect & Ethics', 'code': '1BSCE308', 'credits': 1, 'cie': 50, 'see': 49, 'total': 99, 'grade': 'O', 'earned': 1, 'gradePoints': 10, 'creditPoints': 10 }
      ]
    },
    4: {
      'sem': 4,
      'sgpa': null,
      'cgpa': 9.25,
      'totalCredits': 18,
      'status': 'CURRENT SEMESTER (AWAITING SEE)',
      'courses': [
        { 'name': 'Electromagnetic Field Theory', 'code': '1BECT401', 'credits': 4, 'cie': 46, 'see': 'Awaiting', 'total': 'Awaiting', 'grade': '-', 'earned': 0, 'gradePoints': 0, 'creditPoints': 0 },
        { 'name': 'Linear Integrated Circuits', 'code': '1BECT402', 'credits': 4, 'cie': 48, 'see': 'Awaiting', 'total': 'Awaiting', 'grade': '-', 'earned': 0, 'gradePoints': 0, 'creditPoints': 0 },
        { 'name': 'Communication Theory', 'code': '1BECT403', 'credits': 3, 'cie': 45, 'see': 'Awaiting', 'total': 'Awaiting', 'grade': '-', 'earned': 0, 'gradePoints': 0, 'creditPoints': 0 },
        { 'name': 'Control Systems', 'code': '1BECT404', 'credits': 3, 'cie': 42, 'see': 'Awaiting', 'total': 'Awaiting', 'grade': '-', 'earned': 0, 'gradePoints': 0, 'creditPoints': 0 },
        { 'name': 'LIC & Communication Lab', 'code': '1BECTL405', 'credits': 2, 'cie': 49, 'see': 'Awaiting', 'total': 'Awaiting', 'grade': '-', 'earned': 0, 'gradePoints': 0, 'creditPoints': 0 },
        { 'name': 'Constitution of India', 'code': '1BCOI406', 'credits': 1, 'cie': 47, 'see': 'Awaiting', 'total': 'Awaiting', 'grade': '-', 'earned': 0, 'gradePoints': 0, 'creditPoints': 0 },
        { 'name': 'Biology for Engineers', 'code': '1BBIO407', 'credits': 1, 'cie': 45, 'see': 'Awaiting', 'total': 'Awaiting', 'grade': '-', 'earned': 0, 'gradePoints': 0, 'creditPoints': 0 }
      ]
    }
  };

  Color _getGradeColor(String grade) {
    if (grade == 'O') return AppTheme.accentGreen;
    if (grade == 'A+') return AppTheme.accentIndigo;
    if (grade == 'A') return AppTheme.accentBlue;
    return AppTheme.textMuted;
  }

  @override
  Widget build(BuildContext context) {
    final currentData = semestersData[_selectedSem] ?? {
      'sem': _selectedSem,
      'sgpa': null,
      'cgpa': 9.25,
      'totalCredits': 0,
      'status': 'AWAITING REGISTRATION',
      'courses': []
    };

    final List coursesList = currentData['courses'] as List? ?? [];
    final sgpaVal = currentData['sgpa'] as double?;
    final cgpaVal = currentData['cgpa'] as double;
    final registeredCredits = currentData['totalCredits'] as int;

    // Calculate credits earned
    int creditsEarned = 0;
    for (var c in coursesList) {
      if (c['grade'] != '-') {
        creditsEarned += c['credits'] as int;
      }
    }

    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      appBar: AppBar(
        title: Text('Report Cards', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.bgPrimary,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Student Profile Container
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppTheme.bgCard,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.divider, width: 0.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'PROVISIONAL RESULTS OF SEE',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.accentOrange,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildProfileRow('Student Name', studentInfo['name']),
                  _buildProfileRow('USN', studentInfo['usn'], isHighlighted: true),
                  _buildProfileRow('Program', studentInfo['program']),
                  const SizedBox(height: 10),
                  
                  // Interactive Dropdown
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'SELECT SEMESTER',
                              style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted, letterSpacing: 0.5),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12),
                              decoration: BoxDecoration(
                                color: Colors.black26,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppTheme.divider, width: 0.5),
                              ),
                              child: DropdownButtonHideUnderline(
                                child: DropdownButton<int>(
                                  value: _selectedSem,
                                  dropdownColor: AppTheme.bgCard,
                                  icon: const Icon(Icons.arrow_drop_down, color: AppTheme.accentIndigo),
                                  style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppTheme.textPrimary, fontSize: 14),
                                  isExpanded: true,
                                  onChanged: (val) {
                                    if (val != null) {
                                      setState(() {
                                        _selectedSem = val;
                                      });
                                    }
                                  },
                                  items: [1, 2, 3, 4, 5, 6, 7, 8].map((s) {
                                    return DropdownMenuItem<int>(
                                      value: s,
                                      child: Text(
                                        'Semester $s${s == studentInfo['currentSem'] ? ' (Current)' : ''}',
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: _buildProfileRow('Credits Registered', '$registeredCredits'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Text(
                        'STATUS: ',
                        style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted),
                      ),
                      Text(
                        currentData['status'] as String,
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: sgpaVal != null ? AppTheme.accentGreen : AppTheme.accentOrange),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            
            // Results Table Container
            Container(
              decoration: BoxDecoration(
                color: AppTheme.bgCard,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.divider, width: 0.5),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: coursesList.isNotEmpty
                    ? SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: DataTable(
                          columnSpacing: 20,
                          headingRowColor: WidgetStateProperty.all(Colors.white.withValues(alpha: 0.02)),
                          columns: [
                            DataColumn(label: Text('Course Name', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.textMuted))),
                            DataColumn(label: Text('Code', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.textMuted))),
                            DataColumn(numeric: true, label: Text('Credits', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.textMuted))),
                            DataColumn(numeric: true, label: Text('CIE', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.textMuted))),
                            DataColumn(numeric: true, label: Text('SEE', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.textMuted))),
                            DataColumn(numeric: true, label: Text('Total', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.textMuted))),
                            DataColumn(label: Text('Grade', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.textMuted))),
                            DataColumn(numeric: true, label: Text('GP', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.textMuted))),
                            DataColumn(numeric: true, label: Text('CP', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.textMuted))),
                          ],
                          rows: coursesList.map((course) {
                            final gradeColor = _getGradeColor(course['grade'] as String);
                            return DataRow(cells: [
                              DataCell(
                                SizedBox(
                                  width: 200,
                                  child: Text(
                                    course['name'] as String,
                                    style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
                                    overflow: TextOverflow.ellipsis,
                                    maxLines: 2,
                                  ),
                                ),
                              ),
                              DataCell(Text(course['code'] as String, style: GoogleFonts.spaceGrotesk(color: AppTheme.accentIndigo, fontWeight: FontWeight.w600))),
                              DataCell(Text('${course['credits']}', style: const TextStyle(color: AppTheme.textPrimary))),
                              DataCell(Text('${course['cie']}', style: const TextStyle(color: AppTheme.textSecondary))),
                              DataCell(Text('${course['see']}', style: const TextStyle(color: AppTheme.textSecondary))),
                              DataCell(Text('${course['total']}', style: const TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.bold))),
                              DataCell(
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: gradeColor.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(4),
                                    border: Border.all(color: gradeColor.withValues(alpha: 0.3)),
                                  ),
                                  child: Text(
                                    course['grade'] as String,
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: gradeColor,
                                    ),
                                  ),
                                ),
                              ),
                              DataCell(Text('${course['gradePoints']}', style: const TextStyle(color: AppTheme.textPrimary))),
                              DataCell(Text('${course['creditPoints']}', style: GoogleFonts.spaceGrotesk(color: AppTheme.accentBlue, fontWeight: FontWeight.bold))),
                            ]);
                          }).toList(),
                        ),
                      )
                    : Container(
                        padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 16),
                        alignment: Alignment.center,
                        child: Column(
                          children: [
                            Icon(Icons.school_outlined, size: 44, color: AppTheme.textMuted.withValues(alpha: 0.4)),
                            const SizedBox(height: 12),
                            Text(
                              'Academic registrations and results are currently\nunavailable for Semester $_selectedSem.',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.inter(color: AppTheme.textMuted, fontSize: 13, height: 1.5),
                            ),
                          ],
                        ),
                      ),
              ),
            ),
            const SizedBox(height: 24),
            
            // GPA tallies
            Row(
              children: [
                Expanded(
                  child: _buildGpaCard('SGPA', sgpaVal, AppTheme.accentGreen),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildGpaCard('CGPA', cgpaVal, AppTheme.accentIndigo),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildGpaCard('TOTAL CREDITS EARNED', creditsEarned.toDouble(), AppTheme.accentBlue, isFullWidth: true),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileRow(String label, dynamic value, {bool isHighlighted = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label.toUpperCase(),
            style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted, letterSpacing: 0.5),
          ),
          const SizedBox(height: 4),
          Text(
            value.toString(),
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: isHighlighted ? AppTheme.accentIndigo : AppTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGpaCard(String label, double? value, Color color, {bool isFullWidth = false}) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.15)),
      ),
      child: Column(
        crossAxisAlignment: isFullWidth ? CrossAxisAlignment.center : CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted),
          ),
          const SizedBox(height: 6),
          Text(
            value != null 
                ? value.toStringAsFixed(value == value.toInt().toDouble() ? 0 : 2)
                : 'N/A',
            style: GoogleFonts.spaceGrotesk(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: color,
              shadows: [
                Shadow(
                  color: color.withValues(alpha: 0.25),
                  blurRadius: 10,
                )
              ]
            ),
          ),
        ],
      ),
    );
  }
}
