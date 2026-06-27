import { prisma } from './db';
import { mindMapsData, MindMapNode } from './mindmap';

async function searchDatabaseContext(query: string) {
  const q = query.toLowerCase();
  
  // Find matching articles
  const articles = await prisma.article.findMany({
    include: { country: true }
  });

  const matches = articles.filter(art => {
    return (
      art.articleNumber.toLowerCase().includes(q) ||
      art.title.toLowerCase().includes(q) ||
      art.originalText.toLowerCase().includes(q) ||
      art.topic.toLowerCase().includes(q) ||
      art.country.name.toLowerCase().includes(q)
    );
  });

  return matches;
}

export async function askGemini(prompt: string, temperature = 0.7): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function chatWithAI(message: string, history: { role: string; content: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Retrieve relevant articles from the DB for RAG
  const contextArticles = await searchDatabaseContext(message);
  
  let contextText = '';
  if (contextArticles.length > 0) {
    contextText = 'Use the following verified constitutional information to answer the user:\n\n' +
      contextArticles.map(art => {
        return `[Country: ${art.country.name}]\n` +
          `[Provision: ${art.articleNumber} - ${art.title}]\n` +
          `Original Text: "${art.originalText}"\n` +
          `Simplified Explanation: ${art.simplifiedExplanation}\n` +
          `Child-Friendly Explanation: ${art.childFriendlyExplanation}\n` +
          `Real-Life Example: ${art.realLifeExample}\n` +
          `Key Takeaways:\n${art.keyTakeaways}\n`;
      }).join('\n---\n');
  }

  if (apiKey) {
    const systemPrompt = `You are the Constitution Atlas AI Assistant. Your job is to explain constitutional concepts, articles, rights, and government structures in simple, plain English (accessible to a 13-year-old).
    
    CRITICAL RULE: Rely ONLY on the verified constitutional context provided below. If the context does not contain the answer, say "I could not find a verified constitutional article in our database that covers this topic. However, you can ask about rights, speech, equality, or specific articles for India, USA, UK, France, or Japan."
    Do not hallucinate or make up articles.
    Always provide original source text references where available.

    ${contextText}
    
    Conversation History:
    ${history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')}
    User: ${message}
    Assistant:`;

    try {
      const response = await askGemini(systemPrompt, 0.2);
      return {
        response,
        sources: contextArticles.map(art => ({
          country: art.country.name,
          flag: art.country.flagUrl,
          articleNumber: art.articleNumber,
          title: art.title,
          originalText: art.originalText
        }))
      };
    } catch (err) {
      console.error('Gemini API call failed, falling back to local engine', err);
    }
  }

  // Fallback Local RAG Engine
  let response = '';
  if (contextArticles.length > 0) {
    const art = contextArticles[0]; // best match
    response = `Here is information on **${art.articleNumber}** of **${art.country.name}** (${art.country.flagUrl}):\n\n` +
      `### Original Text\n> "${art.originalText}"\n\n` +
      `### Simplified Explanation\n${art.simplifiedExplanation}\n\n` +
      `### Child-Friendly Explanation\n${art.childFriendlyExplanation}\n\n` +
      `### Real-Life Example\n${art.realLifeExample}\n\n` +
      `### Key Takeaways\n${art.keyTakeaways.split('\n').map(t => `- ${t}`).join('\n')}\n\n` +
      `*(Note: Sticking strictly to verified database records. To ask questions freely, configure a GEMINI_API_KEY)*`;
  } else {
    response = `I couldn't find a direct match for "${message}" in our constitutional database. Try asking about:
- **India**: Article 14 (Equality), Article 19 (Free Speech), or Article 21 (Right to Life)
- **USA**: First Amendment, Fifth Amendment, or Article I (Congress)
- **UK**: Magna Carta or Parliamentary Speech
- **France**: Article 1 (Secular Republic) or Declaration of Rights
- **Japan**: Article 9 (Renunciation of War) or Article 14 (Equality)

*(You can also set a GEMINI_API_KEY in the environment for dynamic AI responses.)*`;
  }

  return {
    response,
    sources: contextArticles.map(art => ({
      country: art.country.name,
      flag: art.country.flagUrl,
      articleNumber: art.articleNumber,
      title: art.title,
      originalText: art.originalText
    }))
  };
}

export async function explainArticleAI(articleId: string, style: 'simplified' | 'child' | 'original' | 'example' | 'takeaways') {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { country: true }
  });

  if (!article) {
    throw new Error('Article not found');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    let prompt = '';
    if (style === 'simplified') {
      prompt = `Simplify the following constitutional article from ${article.country.name} in plain English suitable for ordinary people: "${article.originalText}"`;
    } else if (style === 'child') {
      prompt = `Explain the following constitutional article from ${article.country.name} to a 10-year-old child using a simple game analogy: "${article.originalText}"`;
    } else if (style === 'example') {
      prompt = `Provide a real-life, practical scenario demonstrating how this article works in everyday life: "${article.originalText}"`;
    } else if (style === 'takeaways') {
      prompt = `Extract 3 bullet points showing key takeaways for this constitutional article: "${article.originalText}"`;
    }

    try {
      const text = await askGemini(prompt, 0.4);
      return text;
    } catch (err) {
      console.error('Gemini explain failed, falling back to db', err);
    }
  }

  // Fallback to pre-compiled db explanations
  if (style === 'simplified') return article.simplifiedExplanation;
  if (style === 'child') return article.childFriendlyExplanation;
  if (style === 'example') return article.realLifeExample;
  if (style === 'takeaways') return article.keyTakeaways;
  return article.originalText;
}

export async function generateMindMapAI(topic: string): Promise<MindMapNode> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const prompt = `Generate a hierarchical mind map JSON object for the topic: "${topic}".
    Ensure it details this topic across major constitutions (India, USA, UK, France, Japan).
    The JSON structure must match exactly:
    {
      "name": "Topic Name",
      "children": [
        {
          "name": "Country/Sub-category",
          "children": [
            { "name": "Key Point 1" },
            { "name": "Key Point 2" }
          ]
        }
      ]
    }
    Return ONLY raw JSON. No markdown backticks, no notes.`;

    try {
      const response = await askGemini(prompt, 0.2);
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.error('Gemini mindmap generation failed, falling back to local', err);
    }
  }

  // Fallback to local mindmaps
  return mindMapsData[topic] || mindMapsData['Government Structure'];
}

export async function generateQuizAI(topic: string, difficulty: 'EASY' | 'MEDIUM' | 'HARD', type: 'MCQ' | 'TF' | 'BLANK' | 'SCENARIO') {
  // Query db questions matching criteria
  const dbQuestions = await prisma.quizQuestion.findMany({
    where: {
      topic,
      difficulty,
      type
    },
    include: { country: true }
  });

  if (dbQuestions.length > 0) {
    return dbQuestions.map(q => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.options),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      type: q.type,
      country: q.country.name
    }));
  }

  // Fallback: If no direct matches, return general seeded questions
  const anyQuestions = await prisma.quizQuestion.findMany({
    include: { country: true }
  });

  return anyQuestions.slice(0, 4).map(q => ({
    id: q.id,
    question: q.question,
    options: JSON.parse(q.options),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    type: q.type,
    country: q.country.name
  }));
}
