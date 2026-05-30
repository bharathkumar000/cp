import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/app_theme.dart';

class TeacherLocatorScreen extends StatefulWidget {
  const TeacherLocatorScreen({super.key});

  @override
  State<TeacherLocatorScreen> createState() => _TeacherLocatorScreenState();
}

class _TeacherLocatorScreenState extends State<TeacherLocatorScreen> {
  // Mock Teacher Positions & Telemetry Data
  final List<Map<String, dynamic>> _teachers = [
    {
      'id': 1,
      'name': 'Dr. Bhavana',
      'subject': 'Applied Mathematics II',
      'dept': 'Mathematics',
      'room': 'M Block 402',
      'lastSpotted': '30 mins ago',
      'status': 'On Track',
      'coords': const Point(130.0, 95.0),
    },
    {
      'id': 2,
      'name': 'Dr. White',
      'subject': 'Applied Physics',
      'dept': 'Physics',
      'room': 'Physics Lab A',
      'lastSpotted': '15 mins ago',
      'status': 'On Track',
      'coords': const Point(230.0, 50.0),
    },
    {
      'id': 3,
      'name': 'Prof. Alan',
      'subject': 'C Programming Lab',
      'dept': 'Computer Science',
      'room': 'CS Lab 1',
      'lastSpotted': '5 mins ago',
      'status': 'On Track',
      'coords': const Point(180.0, 160.0),
    },
    {
      'id': 4,
      'name': 'Prof. Jones',
      'subject': 'Communication Skills - 2',
      'dept': 'Humanities',
      'room': 'Seminar Hall 1',
      'lastSpotted': '2 hours ago',
      'status': 'Unscheduled Spot',
      'coords': const Point(60.0, 180.0),
    }
  ];

  int _selectedTeacherId = 1;
  String _searchQuery = '';

  // Console Logs Telemetry stream
  final List<Map<String, String>> _consoleLogs = [
    {'time': '09:15:02', 'camera': 'CAM_M_402', 'text': 'Face recognition node initialized successfully.'},
    {'time': '09:15:10', 'camera': 'CAM_PHYS_A', 'text': 'ESP32 Cam Node 4 connected to local mesh.'},
    {'time': '09:17:40', 'camera': 'CAM_SEM_1', 'text': 'Detection stream open for Prof. Jones.'},
    {'time': '09:20:15', 'camera': 'CAM_CS_LAB1', 'text': 'Prof. Alan face detected. Confidence score: 98.4%'},
    {'time': '09:32:44', 'camera': 'CAM_PHYS_A', 'text': 'Dr. White face detected. Confidence score: 99.1%'},
    {'time': '09:47:16', 'camera': 'CAM_M_402', 'text': 'Dr. Bhavana face detected. Confidence score: 99.7%'}
  ];

  // Room coordinates percentages (matching block absolute pixels layout)
  final Map<String, Point<double>> _roomCoordinates = {
    'M Block 402': const Point(130.0, 95.0),
    'L-301 Classroom': const Point(140.0, 75.0),
    'CS Lab 1': const Point(180.0, 160.0),
    'CS Lab 2': const Point(190.0, 180.0),
    'Physics Lab A': const Point(230.0, 50.0),
    'Seminar Hall 1': const Point(60.0, 180.0),
    'Seminar Hall 2': const Point(70.0, 200.0),
    'Library Room 2': const Point(240.0, 170.0),
    'Admin Block A': const Point(150.0, 30.0),
  };

  // Scheduled rooms matching
  final Map<String, String> _scheduledRooms = {
    'Dr. Bhavana': 'M Block 402',
    'Dr. White': 'Physics Lab A',
    'Prof. Alan': 'CS Lab 1',
    'Prof. Jones': 'L-301 Classroom'
  };

  // State variables for Simulator dropdowns
  late int _simTeacherId;
  late String _simRoom;

  @override
  void initState() {
    super.initState();
    _simTeacherId = _teachers[0]['id'];
    _simRoom = _roomCoordinates.keys.first;
  }

  // Trigger Simulation update
  void _triggerSimulation() {
    final teacherIndex = _teachers.indexWhere((t) => t['id'] == _simTeacherId);
    if (teacherIndex == -1) return;

    final teacher = _teachers[teacherIndex];
    final coords = _roomCoordinates[_simRoom] ?? const Point(150.0, 100.0);
    
    final now = DateTime.now();
    final timeStr = "${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}";

    // Check if scheduled room matches spotted room
    final expectedRoom = _scheduledRooms[teacher['name']] ?? '';
    final isScheduled = expectedRoom == _simRoom;
    final statusStr = isScheduled ? 'On Track' : 'Unscheduled Spot';

    setState(() {
      _teachers[teacherIndex] = {
        ...teacher,
        'room': _simRoom,
        'lastSpotted': 'Just now',
        'status': statusStr,
        'coords': coords
      };

      // Append log entry
      final camLabel = _simRoom.toUpperCase().replaceAll(' ', '_');
      final matchConfidence = (95.0 + Random().nextDouble() * 4.9).toStringAsFixed(1);
      
      _consoleLogs.add({
        'time': timeStr,
        'camera': 'CAM_$camLabel',
        'text': 'Face recognition match: ${teacher['name']} identified. Confidence: $matchConfidence%'
      });
      _consoleLogs.add({
        'time': timeStr,
        'camera': 'MESH_NODE_OK',
        'text': 'Location coordinates synchronized. Node map updated: Room $_simRoom'
      });

      _selectedTeacherId = _simTeacherId;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Simulated live face detection scan for ${teacher['name']}!'),
        backgroundColor: AppTheme.accentGreen,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Filter list
    final filteredTeachers = _teachers.where((t) =>
        t['name'].toLowerCase().contains(_searchQuery.toLowerCase()) ||
        t['subject'].toLowerCase().contains(_searchQuery.toLowerCase()) ||
        t['dept'].toLowerCase().contains(_searchQuery.toLowerCase())
    ).toList();

    final selectedTeacherObj = _teachers.firstWhere((t) => t['id'] == _selectedTeacherId);

    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      appBar: AppBar(
        title: Text('Teacher Radar', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.bgPrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.sync_rounded, color: AppTheme.accentGreen),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Radar telemetry link synchronized OK.')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stats Grid row
            _buildStatsRow(),
            const SizedBox(height: 20),

            // Search Bar
            TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Search by name, department, subject...',
                prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.textMuted),
                fillColor: AppTheme.bgCard,
                filled: true,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Main section title
            Text(
              'Live Faculty Radar Map',
              style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            ),
            const SizedBox(height: 10),

            // Styled Visual Map
            _buildVisualMap(),
            const SizedBox(height: 10),

            // Selected Detail card
            _buildSelectedDetailCard(selectedTeacherObj),
            const SizedBox(height: 24),

            // Faculty list log card
            Text(
              'Spotted Registry Logs',
              style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            ),
            const SizedBox(height: 10),
            _buildFacultyListLogs(filteredTeachers),
            const SizedBox(height: 24),

            // Telemetry Terminal Log
            Text(
              'Live Telemetry Stream',
              style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            ),
            const SizedBox(height: 10),
            _buildTelemetryTerminal(),
            const SizedBox(height: 24),

            // Simulator Control Sandbox Panel
            _buildSimulationPanel(),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsRow() {
    return Row(
      children: [
        Expanded(
          child: _statCard(
            title: 'Tracked Faculty',
            value: '${_teachers.length} Active',
            color: AppTheme.accentBlue,
            icon: Icons.people_rounded,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _statCard(
            title: 'Mesh Gateways',
            value: '9 Nodes',
            color: AppTheme.accentOrange,
            icon: Icons.compass_calibration_rounded,
          ),
        ),
      ],
    );
  }

  Widget _statCard({required String title, required String value, required Color color, required IconData icon}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: color),
              const SizedBox(width: 6),
              Text(title, style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted, fontWeight: FontWeight.w600)),
            ],
          ),
          const SizedBox(height: 6),
          Text(value, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary)),
        ],
      ),
    );
  }

  Widget _buildVisualMap() {
    return Container(
      width: double.infinity,
      height: 260,
      decoration: BoxDecoration(
        color: const Color(0xFF040612),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.divider),
      ),
      child: Stack(
        children: [
          // Grid Map details
          ..._buildMapBackgroundGrid(),

          // Campus Blocks
          _mapBlock(title: 'Admin', left: 140, top: 20, width: 70, height: 35),
          _mapBlock(title: 'Science', left: 20, top: 60, width: 65, height: 60),
          _mapBlock(title: 'M Block', left: 110, top: 80, width: 75, height: 60),
          _mapBlock(title: 'Physics', left: 220, top: 35, width: 65, height: 45),
          _mapBlock(title: 'CSE Block', left: 155, top: 150, width: 85, height: 50),
          _mapBlock(title: 'Library', left: 235, top: 155, width: 55, height: 75),
          _mapBlock(title: 'Seminar', left: 30, top: 170, width: 75, height: 50),

          // Render Pins
          ..._teachers.map((t) {
            final isSelected = t['id'] == _selectedTeacherId;
            final Point<double> pos = t['coords'];
            return Positioned(
              left: pos.x,
              top: pos.y,
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedTeacherId = t['id'];
                  });
                },
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Outer pulse circle
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: (isSelected ? AppTheme.accentOrange : AppTheme.accentIndigo).withValues(alpha: 0.3),
                        shape: BoxShape.circle,
                      ),
                    ),
                    // Inner marker
                    Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        color: isSelected ? AppTheme.accentOrange : AppTheme.accentIndigo,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 1.5),
                        boxShadow: const [BoxShadow(color: Colors.black54, blurRadius: 4, offset: Offset(0, 2))],
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        t['name'].toString().split(' ').last.substring(0, 1),
                        style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w900, color: isSelected ? Colors.black : Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  List<Widget> _buildMapBackgroundGrid() {
    return [
      Positioned.fill(
        child: Opacity(
          opacity: 0.05,
          child: Column(
            children: List.generate(
              13,
              (_) => Expanded(
                child: Container(
                  decoration: const BoxDecoration(
                    border: Border(bottom: BorderSide(color: Colors.white, width: 0.5)),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      Positioned.fill(
        child: Opacity(
          opacity: 0.05,
          child: Row(
            children: List.generate(
              15,
              (_) => Expanded(
                child: Container(
                  decoration: const BoxDecoration(
                    border: Border(right: BorderSide(color: Colors.white, width: 0.5)),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ];
  }

  Widget _mapBlock({required String title, required double left, required double top, required double width, required double height}) {
    return Positioned(
      left: left,
      top: top,
      width: width,
      height: height,
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B).withValues(alpha: 0.6),
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: const Color(0xFF334155), width: 1),
        ),
        alignment: Alignment.center,
        child: Text(
          title,
          style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white38),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  Widget _buildSelectedDetailCard(Map<String, dynamic> teacher) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.location_searching_rounded, color: AppTheme.accentOrange, size: 16),
              const SizedBox(width: 8),
              Text(
                'Selected: ${teacher['name']}',
                style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Spotted: ${teacher['room']}', style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textSecondary)),
              Text('Expected: ${_scheduledRooms[teacher['name']] ?? 'None'}', style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textSecondary)),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Last Spotted: ${teacher['lastSpotted']}', style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textSecondary)),
              Text('Dept: ${teacher['dept']}', style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textSecondary)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFacultyListLogs(List<Map<String, dynamic>> filteredList) {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: filteredList.length,
      itemBuilder: (ctx, i) {
        final t = filteredList[i];
        final isSelected = t['id'] == _selectedTeacherId;
        final isOnTrack = t['status'] == 'On Track';
        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.accentIndigo.withValues(alpha: 0.05) : AppTheme.bgCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSelected ? AppTheme.accentIndigo : AppTheme.divider),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            onTap: () {
              setState(() {
                _selectedTeacherId = t['id'];
              });
            },
            leading: CircleAvatar(
              backgroundColor: isSelected ? AppTheme.accentOrange : AppTheme.divider,
              child: Text(
                t['name'].toString().split(' ').last.substring(0, 1),
                style: TextStyle(color: isSelected ? Colors.black : Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
            title: Text(t['name'], style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary)),
            subtitle: Text('${t['subject']} • ${t['dept']}', style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted)),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.divider,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    t['room'],
                    style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.accentBlue),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  t['status'],
                  style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: isOnTrack ? AppTheme.accentGreen : AppTheme.accentRed),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTelemetryTerminal() {
    return Container(
      width: double.infinity,
      height: 140,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF040612),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'CAMERA Telemetry Stream',
                style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted),
              ),
              Row(
                children: [
                  Container(width: 6, height: 6, decoration: const BoxDecoration(color: AppTheme.accentGreen, shape: BoxShape.circle)),
                  const SizedBox(width: 4),
                  Text('MESH LIVE', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.bold, color: AppTheme.accentGreen)),
                ],
              )
            ],
          ),
          const Divider(color: Colors.white12, height: 10),
          Expanded(
            child: ListView.builder(
              itemCount: _consoleLogs.length,
              itemBuilder: (ctx, i) {
                final log = _consoleLogs[_consoleLogs.length - 1 - i];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Text(
                    '[${log['time']}] [${log['camera']}] ${log['text']}',
                    style: const TextStyle(fontFamily: 'Courier', fontSize: 11, color: AppTheme.accentGreen),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSimulationPanel() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.accentOrange.withValues(alpha: 0.3), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.settings_input_composite_rounded, color: AppTheme.accentOrange, size: 18),
              const SizedBox(width: 8),
              Text(
                'Simulation Sandbox Console',
                style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.accentOrange),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Simulate facial recognition model triggers to update the tracking records and reposition pins live.',
            style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
          ),
          const SizedBox(height: 16),
          
          // Form fields
          Text('Select Faculty Member', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textSecondary)),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: AppTheme.bgPrimary,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.divider),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<int>(
                value: _simTeacherId,
                isExpanded: true,
                dropdownColor: AppTheme.bgCard,
                items: _teachers.map((t) {
                  return DropdownMenuItem<int>(
                    value: t['id'] as int,
                    child: Text(t['name'] as String, style: const TextStyle(fontSize: 13, color: AppTheme.textPrimary)),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) {
                    setState(() => _simTeacherId = val);
                  }
                },
              ),
            ),
          ),
          const SizedBox(height: 12),

          Text('Select Telemetry Target Node', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textSecondary)),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: AppTheme.bgPrimary,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.divider),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _simRoom,
                isExpanded: true,
                dropdownColor: AppTheme.bgCard,
                items: _roomCoordinates.keys.map((roomName) {
                  return DropdownMenuItem<String>(
                    value: roomName,
                    child: Text(roomName, style: const TextStyle(fontSize: 13, color: AppTheme.textPrimary)),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) {
                    setState(() => _simRoom = val);
                  }
                },
              ),
            ),
          ),
          const SizedBox(height: 16),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.accentOrange, foregroundColor: Colors.black),
              onPressed: _triggerSimulation,
              icon: const Icon(Icons.play_arrow_rounded, size: 18),
              label: const Text('Simulate Camera Spot'),
            ),
          )
        ],
      ),
    );
  }
}
