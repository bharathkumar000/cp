import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import '../config/app_theme.dart';

class PrepcareScreen extends StatefulWidget {
  const PrepcareScreen({super.key});

  @override
  State<PrepcareScreen> createState() => _PrepcareScreenState();
}

class _PrepcareScreenState extends State<PrepcareScreen> {
  final _storage = const FlutterSecureStorage();
  final _textCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  final _imagePicker = ImagePicker();

  List<Map<String, dynamic>> _sessions = [];
  String? _currentSessionId;
  List<Map<String, dynamic>> _messages = [];
  
  File? _selectedImage;
  String? _selectedImageBase64;
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();
    _loadSessions();
  }

  Future<void> _loadSessions() async {
    try {
      final saved = await _storage.read(key: 'prepcare_chat_sessions');
      if (saved != null) {
        final List<dynamic> parsed = jsonDecode(saved);
        setState(() {
          _sessions = List<Map<String, dynamic>>.from(parsed);
          if (_sessions.isNotEmpty) {
            _currentSessionId = _sessions[0]['id'];
            _messages = List<Map<String, dynamic>>.from(_sessions[0]['messages']);
          } else {
            _initializeDefaultSession();
          }
        });
      } else {
        _initializeDefaultSession();
      }
    } catch (e) {
      debugPrint('Error loading sessions: $e');
      _initializeDefaultSession();
    }
  }

  void _initializeDefaultSession() {
    final newId = 'session-${DateTime.now().millisecondsSinceEpoch}';
    final List<Map<String, dynamic>> initialWelcome = [
      {
        'id': 'welcome',
        'sender': 'ai',
        'text': 'Hello! I am Prepcare, your AI Study Assistant. Ask me any academic questions, or scan a problem image to solve!',
        'timestamp': _formatTimeNow(),
      }
    ];
    final defaultSession = {
      'id': newId,
      'title': 'New Study Session',
      'messages': initialWelcome,
      'timestamp': _formatDateNow(),
    };
    setState(() {
      _sessions = [defaultSession];
      _currentSessionId = newId;
      _messages = List<Map<String, dynamic>>.from(initialWelcome);
    });
    _saveSessionsToStorage();
  }

  Future<void> _saveSessionsToStorage() async {
    try {
      await _storage.write(
        key: 'prepcare_chat_sessions',
        value: jsonEncode(_sessions),
      );
    } catch (e) {
      debugPrint('Error saving sessions: $e');
    }
  }

  void _startNewChat() {
    final newId = 'session-${DateTime.now().millisecondsSinceEpoch}';
    final List<Map<String, dynamic>> initialWelcome = [
      {
        'id': 'welcome',
        'sender': 'ai',
        'text': 'Hello! I am Prepcare, your AI Study Assistant. Ask me any academic questions, or scan a problem image to solve!',
        'timestamp': _formatTimeNow(),
      }
    ];
    final newSession = {
      'id': newId,
      'title': 'New Study Session',
      'messages': initialWelcome,
      'timestamp': _formatDateNow(),
    };
    setState(() {
      _sessions.insert(0, newSession);
      _currentSessionId = newId;
      _messages = List<Map<String, dynamic>>.from(initialWelcome);
    });
    _saveSessionsToStorage();
    Navigator.of(context).pop(); // Close drawer
  }

  void _selectSession(String sessionId) {
    final idx = _sessions.indexWhere((s) => s['id'] == sessionId);
    if (idx != -1) {
      setState(() {
        _currentSessionId = sessionId;
        _messages = List<Map<String, dynamic>>.from(_sessions[idx]['messages']);
      });
    }
    Navigator.of(context).pop(); // Close drawer
  }

  void _deleteSession(String sessionId) {
    setState(() {
      _sessions.removeWhere((s) => s['id'] == sessionId);
      if (_sessions.isEmpty) {
        _initializeDefaultSession();
      } else {
        if (_currentSessionId == sessionId) {
          _currentSessionId = _sessions[0]['id'];
          _messages = List<Map<String, dynamic>>.from(_sessions[0]['messages']);
        }
      }
    });
    _saveSessionsToStorage();
  }

  void _updateActiveSessionInList() {
    if (_currentSessionId == null) return;
    final idx = _sessions.indexWhere((s) => s['id'] == _currentSessionId);
    if (idx != -1) {
      setState(() {
        String title = _sessions[idx]['title'];
        if (title == 'New Study Session') {
          final firstUser = _messages.firstWhere(
            (m) => m['sender'] == 'user',
            orElse: () => {'text': ''},
          );
          final String userText = firstUser['text'] ?? '';
          if (userText.isNotEmpty) {
            title = userText.length > 25
                ? '${userText.substring(0, 22)}...'
                : userText;
          }
        }
        _sessions[idx]['title'] = title;
        _sessions[idx]['messages'] = _messages;
      });
      _saveSessionsToStorage();
    }
  }

  Future<void> _pickImage() async {
    try {
      final XFile? file = await _imagePicker.pickImage(source: ImageSource.gallery);
      if (file != null) {
        final bytes = await file.readAsBytes();
        setState(() {
          _selectedImage = File(file.path);
          _selectedImageBase64 = 'data:image/png;base64,${base64Encode(bytes)}';
        });
      }
    } catch (e) {
      debugPrint('Error picking image: $e');
    }
  }

  Future<void> _sendMessage() async {
    final text = _textCtrl.text.trim();
    if (text.isEmpty && _selectedImage == null) return;

    _textCtrl.clear();
    final imgBase64 = _selectedImageBase64;
    final imgPath = _selectedImage?.path;

    setState(() {
      _messages.add({
        'id': 'msg-${DateTime.now().millisecondsSinceEpoch}',
        'sender': 'user',
        'text': text,
        'image': imgPath, // local file path for UI rendering
        'timestamp': _formatTimeNow(),
      });
      _selectedImage = null;
      _selectedImageBase64 = null;
      _isTyping = true;
    });
    _scrollToBottom();
    _updateActiveSessionInList();

    try {
      final String host = defaultTargetPlatform == TargetPlatform.android ? '10.0.2.2' : 'localhost';
      final response = await http.post(
        Uri.parse('http://$host:3000/api/ai-chat'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'message': text,
          if (imgBase64 != null) 'image': imgBase64,
          'history': _messages.map((m) => {
            'sender': m['sender'],
            'text': m['text'],
          }).toList(),
        }),
      ).timeout(const Duration(seconds: 2)); // Fail fast to activate standalone Groq fallback

      if (response.statusCode == 200) {
        final resData = jsonDecode(response.body);
        final replyText = resData['text'] ?? 'No reply from Prepcare.';
        setState(() {
          _messages.add({
            'id': 'msg-${DateTime.now().millisecondsSinceEpoch}',
            'sender': 'ai',
            'text': replyText,
            'timestamp': _formatTimeNow(),
          });
          _isTyping = false;
        });
      } else {
        throw Exception('Status code: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Local backend connection bypassed/failed. Executing direct Groq standalone fallback...');
      await _callDirectGroq(text, imgBase64);
    }

    _scrollToBottom();
    _updateActiveSessionInList();
  }

  Future<void> _callDirectGroq(String text, String? imgBase64) async {
    try {
      const systemPrompt = "You are an expert AI academic tutor and career counselor for the Connect & Prep college platform.\n"
          "Strict Policy:\n"
          "- You must ONLY answer questions related to academics, studies, exams, educational course concepts, theorems, laws, engineering, physics, chemistry, mathematics, doubt solving, careers, placements, jobs, internships, interview preparation, resume building, and placement preparation.\n"
          "- Under NO circumstances are you allowed to answer off-topic, casual, personal, social, or general questions (e.g. movies, entertainment, sports, jokes, creative writing, chat-bot identities, personal details, or general chit-chat).\n"
          "- If a query is not strictly academic, career-related, study-related, doubt-solving, or educational, you MUST decline to answer. You must reply exactly: 'I can only help with academic, study, and career-related topics.' and nothing else.\n"
          "- IMPORTANT: Format mathematical equations cleanly using LaTeX style (e.g., \$E = mc^2\$ or \$\$\$V = I \\times R\$\$\$) so they are rendered beautifully.";

      final academicKeywords = [
        'voltage', 'diode', 'circuit', 'pcb', 'transistor', 'capacitor', 'resistor', 'network',
        'osi model', 'tcp', 'ip', 'ethernet', 'communication', 'optical', 'frequency', 'signal',
        'fourier', 'laplace', 'differential', 'integral', 'math', 'physics', 'chemistry', 'electronics',
        'electrical', 'microcontroller', 'embedded', 'sensor', 'programming', 'code', 'algorithm',
        'op-amp', 'amplifier', 'altium', 'kicad', 'schematic', 'soldering', 'induction', 'transformer',
        'motor', 'maxwell', 'electromagnetic', 'wave', 'antenna', 'laser', 'fiber', '5g', 'lte', 'study',
        'exam', 'explain', 'how to', 'what is', 'solve', 'derive', 'definition', 'homework', 'assignment',
        'motion', 'force', 'newton', 'gravity', 'velocity', 'acceleration', 'laws', 'theorem', 'scientist',
        'einstein', 'tesla', 'galileo', 'curie', 'darwin', 'copernicus', 'faraday', 'bohr', 'schrodinger',
        'heisenberg', 'planck', 'kepler', 'hawking', 'pasteur', 'mendel', 'maxwell', 'ampere', 'coulomb',
        'ohm', 'joule', 'watt', 'pascal', 'bernoulli', 'euler', 'pythagoras', 'gauss', 'newtonian', 'relativity',
        'quantum', 'thermodynamics', 'optics', 'mechanics', 'calculus', 'algebra', 'geometry', 'statistics',
        'career', 'placement', 'job', 'internship', 'interview', 'resume', 'cv', 'hiring', 'recruitment',
        'recruit', 'aptitude', 'software engineer', 'developer', 'hired', 'company', 'microsoft', 'google',
        'placement prep', 'interview prep', 'doubt', 'solving', 'question', 'answer'
      ];

      final cleanText = text.toLowerCase();
      final isAcademic = academicKeywords.any((k) => cleanText.contains(k)) || text.length > 50;

      if (!isAcademic) {
        setState(() {
          _messages.add({
            'id': 'msg-${DateTime.now().millisecondsSinceEpoch}',
            'sender': 'ai',
            'text': 'I can only help with academic, study, and career-related topics.',
            'timestamp': _formatTimeNow(),
          });
          _isTyping = false;
        });
        _scrollToBottom();
        return;
      }

      final List<Map<String, String>> groqMessages = [
        {'role': 'system', 'content': systemPrompt}
      ];

      for (final m in _messages) {
        final sender = m['sender'];
        final mText = m['text'] ?? '';
        if (sender == 'user') {
          groqMessages.add({'role': 'user', 'content': mText});
        } else if (sender == 'ai') {
          groqMessages.add({'role': 'assistant', 'content': mText});
        }
      }

      final groqResponse = await http.post(
        Uri.parse('https://api.groq.com/openai/v1/chat/completions'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        body: jsonEncode({
          'model': 'llama-3.1-8b-instant',
          'messages': groqMessages,
          'temperature': 0.15,
        }),
      ).timeout(const Duration(seconds: 25));

      if (groqResponse.statusCode == 200) {
        final resData = jsonDecode(groqResponse.body);
        final replyText = resData['choices']?[0]?['message']?['content'] ?? 'No response from Groq.';
        setState(() {
          _messages.add({
            'id': 'msg-${DateTime.now().millisecondsSinceEpoch}',
            'sender': 'ai',
            'text': replyText,
            'timestamp': _formatTimeNow(),
          });
          _isTyping = false;
        });
      } else {
        throw Exception('Groq API Error: status code ${groqResponse.statusCode}');
      }
    } catch (e) {
      debugPrint('Groq fallback failed: $e');
      setState(() {
        _messages.add({
          'id': 'msg-${DateTime.now().millisecondsSinceEpoch}',
          'sender': 'ai',
          'text': '⚠️ Failed to connect to Prepcare API and Groq fallback. Please check your internet connection.',
          'timestamp': _formatTimeNow(),
        });
        _isTyping = false;
      });
    }
  }

  void _clearCurrentChat() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Clear Chat?'),
        content: const Text('Do you want to reset current conversation?'),
        actions: [
          TextButton(
            child: const Text('Cancel'),
            onPressed: () => Navigator.of(ctx).pop(),
          ),
          TextButton(
            child: const Text('Clear', style: TextStyle(color: AppTheme.accentRed)),
            onPressed: () {
              Navigator.of(ctx).pop();
              setState(() {
                _messages = <Map<String, dynamic>>[
                  {
                    'id': 'welcome',
                    'sender': 'ai',
                    'text': 'Hello! I am Prepcare, your AI Study Assistant. Ask me any academic questions, or upload an image of a problem to scan and solve!',
                    'timestamp': _formatTimeNow(),
                  }
                ];
              });
              _updateActiveSessionInList();
            },
          )
        ],
      ),
    );
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  String _formatTimeNow() {
    final now = DateTime.now();
    return '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
  }

  String _formatDateNow() {
    final now = DateTime.now();
    return '${now.day}/${now.month}/${now.year}';
  }

  String _cleanUpMath(String latex) {
    String clean = latex;
    // Remove wrapping $ or $$
    if (clean.startsWith(r'$$') && clean.endsWith(r'$$')) {
      clean = clean.substring(2, clean.length - 2).trim();
    } else if (clean.startsWith(r'$') && clean.endsWith(r'$')) {
      clean = clean.substring(1, clean.length - 1).trim();
    }
    
    // Replace LaTeX fraction \frac{num}{den} -> (num)/(den)
    RegExp fracRegex = RegExp(r'\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}');
    while (fracRegex.hasMatch(clean)) {
      clean = clean.replaceAllMapped(fracRegex, (match) {
        return '(${match.group(1)})/(${match.group(2)})';
      });
    }

    // Replace basic superscripts and subscripts
    final Map<String, String> superscripts = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '+': '⁺', '-': '⁻', '=': '⁼', 'n': 'ⁿ', 'i': 'ⁱ',
    };
    final Map<String, String> subscripts = {
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
      '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
      '+': '₊', '-': '₋', '=': '₌', 'a': 'ₐ', 'e': 'ₑ',
      'o': 'ₒ', 'x': 'ₓ',
    };

    clean = clean.replaceAllMapped(RegExp(r'\^\{?([0-9+-=ni])\}?'), (match) {
      return superscripts[match.group(1)] ?? '^${match.group(1)}';
    });
    clean = clean.replaceAllMapped(RegExp(r'_\{?([0-9+-=aebox])\}?'), (match) {
      return subscripts[match.group(1)] ?? '_${match.group(1)}';
    });

    // Replace common LaTeX symbols
    final Map<String, String> symbols = {
      r'\mathcal{E}': 'ℰ',
      r'\Phi': 'Φ',
      r'\phi': 'φ',
      r'\pi': 'π',
      r'\theta': 'θ',
      r'\Delta': 'Δ',
      r'\times': '×',
      r'\cdot': '·',
      r'\pm': '±',
      r'\infty': '∞',
      r'\partial': '∂',
      r'\int': '∫',
      r'\sum': '∑',
      r'\alpha': 'α',
      r'\beta': 'β',
      r'\gamma': 'γ',
      r'\omega': 'ω',
      r'\lambda': 'λ',
      r'\mu': 'μ',
      r'\sigma': 'σ',
      r'\tau': 'τ',
      r'\epsilon': 'ε',
      r'\eta': 'η',
      r'\rho': 'ρ',
      r'\chi': 'χ',
      r'\psi': 'ψ',
      r'\nabla': '∇',
      r'\approx': '≈',
      r'\ne': '≠',
      r'\le': '≤',
      r'\ge': '≥',
      r'\to': '→',
      r'\rightarrow': '→',
      r'\leftarrow': '←',
      r'\gets': '←',
      r'\forall': '∀',
      r'\exists': '∃',
      r'\in': '∈',
      r'\notin': '∉',
      r'\subset': '⊂',
      r'\supset': '⊃',
      r'\cap': '∩',
      r'\cup': '∪',
    };

    symbols.forEach((pattern, replacement) {
      clean = clean.replaceAll(pattern, replacement);
    });

    clean = clean.replaceAll(RegExp(r'\\sqrt\s*\{([^}]+)\}'), r'√$1');
    clean = clean.replaceAll(r'\\', r'\');
    
    return clean;
  }

  List<TextSpan> _parseMarkdown(String rawText) {
    // Normalize triple dollar signs to double dollar signs
    final text = rawText.replaceAll('\$\$\$', '\$\$');
    final List<TextSpan> spans = [];
    final RegExp regex = RegExp(r'(\$\$.*?\$\$|\$.*?\$|\*\*.*?\*\*|`.*?`|\n)', dotAll: true);
    
    int lastIndex = 0;
    for (final match in regex.allMatches(text)) {
      if (match.start > lastIndex) {
        spans.add(TextSpan(
          text: text.substring(lastIndex, match.start),
          style: const TextStyle(color: AppTheme.textPrimary, height: 1.4),
        ));
      }
      
      final matchedText = match.group(0)!;
      if (matchedText == '\n') {
        spans.add(const TextSpan(text: '\n'));
      } else if (matchedText.startsWith('\$\$') && matchedText.endsWith('\$\$')) {
        spans.add(TextSpan(
          text: '\n${_cleanUpMath(matchedText)}\n',
          style: GoogleFonts.spaceGrotesk(
            color: AppTheme.accentBlue,
            fontWeight: FontWeight.bold,
            fontSize: 15,
            height: 1.6,
          ),
        ));
      } else if (matchedText.startsWith('\$') && matchedText.endsWith('\$')) {
        spans.add(TextSpan(
          text: _cleanUpMath(matchedText),
          style: GoogleFonts.spaceGrotesk(
            color: AppTheme.accentBlue,
            fontStyle: FontStyle.italic,
            fontWeight: FontWeight.w600,
          ),
        ));
      } else if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        spans.add(TextSpan(
          text: matchedText.substring(2, matchedText.length - 2),
          style: const TextStyle(
            color: AppTheme.textPrimary,
            fontWeight: FontWeight.bold,
            height: 1.4,
          ),
        ));
      } else if (matchedText.startsWith('`') && matchedText.endsWith('`')) {
        spans.add(TextSpan(
          text: matchedText.substring(1, matchedText.length - 1),
          style: GoogleFonts.firaCode(
            color: AppTheme.accentBlue,
            fontSize: 13,
            backgroundColor: Colors.black38,
          ),
        ));
      }
      lastIndex = match.end;
    }
    
    if (lastIndex < text.length) {
      spans.add(TextSpan(
        text: text.substring(lastIndex),
        style: const TextStyle(color: AppTheme.textPrimary, height: 1.4),
      ));
    }
    
    return spans;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Prepcare', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
            Text('Academic & Study Assistant', style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted)),
          ],
        ),
        backgroundColor: AppTheme.bgCard,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.textMuted),
            onPressed: _clearCurrentChat,
            tooltip: 'Clear Chat',
          ),
          Builder(
            builder: (ctx) => IconButton(
              icon: const Icon(Icons.history_rounded, color: AppTheme.textMuted),
              onPressed: () => Scaffold.of(ctx).openEndDrawer(),
              tooltip: 'History',
            ),
          ),
        ],
      ),
      endDrawer: _buildHistoryDrawer(),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                controller: _scrollCtrl,
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length + (_isTyping ? 1 : 0),
                itemBuilder: (ctx, i) {
                  if (i == _messages.length) {
                    return _buildTypingIndicator();
                  }
                  final msg = _messages[i];
                  final isMe = msg['sender'] == 'user';
                  return _buildMessageBubble(msg, isMe);
                },
              ),
            ),
            if (_selectedImage != null) _buildImagePreview(),
            _buildInputComposer(),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryDrawer() {
    return Drawer(
      backgroundColor: AppTheme.bgCard,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: AppTheme.divider, width: 0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Study History',
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textPrimary,
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: _startNewChat,
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('New Chat'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.accentIndigo,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(40),
                  ),
                )
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: _sessions.length,
              itemBuilder: (ctx, i) {
                final session = _sessions[i];
                final isCurrent = session['id'] == _currentSessionId;
                return Container(
                  margin: const EdgeInsets.only(bottom: 6),
                  decoration: BoxDecoration(
                    color: isCurrent ? AppTheme.accentIndigo.withValues(alpha: 0.15) : Colors.transparent,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: isCurrent ? AppTheme.accentIndigo.withValues(alpha: 0.3) : Colors.transparent,
                    ),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    title: Text(
                      session['title'] ?? 'Study Session',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: isCurrent ? FontWeight.w600 : FontWeight.normal,
                        color: AppTheme.textPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    subtitle: Text(
                      session['timestamp'] ?? '',
                      style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textMuted),
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline, size: 18, color: AppTheme.textMuted),
                      onPressed: () => _deleteSession(session['id']),
                    ),
                    onTap: () => _selectSession(session['id']),
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> msg, bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
        margin: const EdgeInsets.only(bottom: 12),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isMe) ...[
              Container(
                margin: const EdgeInsets.only(right: 8, top: 4),
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [AppTheme.accentIndigo, AppTheme.accentBlue]),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.auto_awesome_rounded, size: 15, color: Colors.white),
              )
            ],
            Flexible(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isMe ? AppTheme.accentIndigo.withValues(alpha: 0.2) : AppTheme.bgCard,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(12),
                    topRight: const Radius.circular(12),
                    bottomLeft: Radius.circular(isMe ? 12 : 4),
                    bottomRight: Radius.circular(isMe ? 4 : 12),
                  ),
                  border: Border.all(
                    color: isMe ? AppTheme.accentIndigo.withValues(alpha: 0.4) : AppTheme.divider,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (msg['image'] != null) ...[
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          constraints: const BoxConstraints(maxHeight: 180),
                          child: Image.file(
                            File(msg['image']),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                    ],
                    RichText(
                      text: TextSpan(
                        children: _parseMarkdown(msg['text'] ?? ''),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Align(
                      alignment: Alignment.bottomRight,
                      child: Text(
                        msg['timestamp'] ?? '',
                        style: GoogleFonts.inter(fontSize: 9, color: AppTheme.textMuted),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.only(right: 8),
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [AppTheme.accentIndigo, AppTheme.accentBlue]),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.auto_awesome_rounded, size: 15, color: Colors.white),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: AppTheme.bgCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.divider),
              ),
              child: Text(
                'Prepcare is typing...',
                style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImagePreview() {
    return Container(
      padding: const EdgeInsets.all(8),
      color: Colors.black26,
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.file(_selectedImage!, height: 60, width: 60, fit: BoxFit.cover),
          ),
          const SizedBox(width: 8),
          const Expanded(
            child: Text('Image attached. It will be scanned on send.', style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
          ),
          IconButton(
            icon: const Icon(Icons.cancel_rounded, color: AppTheme.accentRed),
            onPressed: () => setState(() {
              _selectedImage = null;
              _selectedImageBase64 = null;
            }),
          )
        ],
      ),
    );
  }

  Widget _buildInputComposer() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: const BoxDecoration(
        color: AppTheme.bgCard,
        border: Border(top: BorderSide(color: AppTheme.divider, width: 0.5)),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.image_outlined, color: AppTheme.accentBlue),
            onPressed: _pickImage,
            tooltip: 'Add Image',
          ),
          Expanded(
            child: TextField(
              controller: _textCtrl,
              style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
              maxLines: 4,
              minLines: 1,
              textInputAction: TextInputAction.send,
              onSubmitted: (_) => _sendMessage(),
              decoration: InputDecoration(
                hintText: 'Ask Prepcare a study question...',
                hintStyle: GoogleFonts.inter(color: AppTheme.textMuted, fontSize: 13),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                filled: true,
                fillColor: AppTheme.bgPrimary,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: _sendMessage,
            child: Container(
              width: 40,
              height: 40,
              decoration: const BoxDecoration(
                gradient: LinearGradient(colors: [AppTheme.accentIndigo, AppTheme.accentBlue]),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.send_rounded, size: 18, color: Colors.white),
            ),
          )
        ],
      ),
    );
  }
}
