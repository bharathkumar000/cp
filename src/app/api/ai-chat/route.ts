import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, image, history = [] } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
        }

        // System prompt to enforce academic study-only focus
        const systemPrompt = `You are an expert AI academic tutor for the Connect & Prep college platform.
Strict Policy:
- You must ONLY answer questions related to academics, studies, exams, course concepts, engineering, mathematics, computer science, and study-related topics.
- Under NO circumstances are you allowed to answer off-topic, casual, personal, social, or general questions (e.g. movies, entertainment, sports, jokes, creative writing, general programming questions unrelated to study, chat-bot identities, personal details, or general chit-chat).
- If a query is not strictly academic, study-related, or educational, you MUST decline to answer. You must reply exactly: "I can only help with academic and study-related topics." and nothing else. Do not explain your policy or add conversational fluff; keep the rejection short, professional, and direct.`;

        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            try {
                console.log('[AI Chat] Utilizing Gemini API for request...');
                
                // Format history for Gemini chat API
                const formattedContents = [
                    ...history.map((m: any) => ({
                        role: m.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: m.text }]
                    })),
                    {
                        role: 'user',
                        parts: [{ text: message }]
                    }
                ];

                // Append base64 image if present
                if (image) {
                    const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';
                    const base64Data = image.split(',')[1] || image;
                    
                    const lastUserContent = formattedContents[formattedContents.length - 1];
                    lastUserContent.parts.push({
                        inlineData: {
                            mimeType,
                            data: base64Data
                        }
                    } as any);
                }

                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: formattedContents,
                        systemInstruction: {
                            parts: [
                                { text: systemPrompt }
                            ]
                        },
                        generationConfig: {
                            temperature: 0.15, // Low temperature for high instruction compliance
                            maxOutputTokens: 2048
                        }
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Gemini API responded with status ${response.status}: ${errText}`);
                }

                const data = await response.json();
                const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
                
                return NextResponse.json({ text: reply }, { status: 200 });

            } catch (geminiErr: any) {
                console.error('[AI Chat] Gemini API failed, falling back to local fallback rules...', geminiErr);
            }
        }

        // Fallback: local Ollama Server or simulated demo engine
        // Format history for Ollama chat API
        const ollamaMessages = [
            { role: 'system', content: systemPrompt },
            ...history.map((m: any) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text,
                ...(m.image ? { images: [m.image.split(',')[1] || m.image] } : {})
            })),
            { 
                role: 'user', 
                content: message,
                ...(image ? { images: [image.split(',')[1] || image] } : {})
            }
        ];

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout for local Ollama

            const response = await fetch('http://127.0.0.1:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemma4:latest',
                    messages: ollamaMessages,
                    stream: false,
                    options: {
                        temperature: 0.2
                    }
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Ollama responded with status ${response.status}: ${errText}`);
            }

            const data = await response.json();
            const reply = data.message?.content || 'No response from local model.';
            
            return NextResponse.json({ text: reply }, { status: 200 });

        } catch (ollamaErr: any) {
            console.log('[AI Chat] Ollama offline, utilizing static academic verification rules...', ollamaErr.message);
            
            const academicKeywords = [
                'voltage', 'diode', 'circuit', 'pcb', 'transistor', 'capacitor', 'resistor', 'network',
                'osi model', 'tcp', 'ip', 'ethernet', 'communication', 'optical', 'frequency', 'signal',
                'fourier', 'laplace', 'differential', 'integral', 'math', 'physics', 'chemistry', 'electronics',
                'electrical', 'microcontroller', 'embedded', 'sensor', 'programming', 'code', 'algorithm',
                'op-amp', 'amplifier', 'altium', 'kicad', 'schematic', 'soldering', 'induction', 'transformer',
                'motor', 'maxwell', 'electromagnetic', 'wave', 'antenna', 'laser', 'fiber', '5g', 'lte', 'study',
                'exam', 'explain', 'how to', 'what is', 'solve', 'derive', 'definition', 'homework', 'assignment',
                'motion', 'force', 'newton', 'gravity', 'velocity', 'acceleration', 'laws'
            ];
            
            const cleanText = message.toLowerCase();
            const isAcademic = academicKeywords.some(keyword => cleanText.includes(keyword)) || message.length > 35;

            let fallbackMessage = '';
            
            if (isAcademic) {
                fallbackMessage = `⚠️ **[Prepcare Tutor - Offline Study Mode]**
                
Your query relates to core engineering studies. To enable dynamic responses, please configure your \`GEMINI_API_KEY\` in your \`.env\` file.

Here is a study outline:
- **Concept**: Ohm's Law ($V = I \\times R$) and circuit layout guidelines.
- **Formulas**: $f_c = \\frac{1}{2\\pi RC}$ for lowpass cutoff frequencies.

*Provide a valid Gemini API key in your configuration for complete answers.*`;
            } else {
                fallbackMessage = `I can only help with academic and study-related topics.`;
            }
            
            return NextResponse.json({ text: fallbackMessage, offline: true }, { status: 200 });
        }

    } catch (err: any) {
        console.error('API Error in ai-chat:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
