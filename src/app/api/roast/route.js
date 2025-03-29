import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a roast using OpenAI
async function generateRoast(stack) {
  try {
    const prompt = `You are a brutally honest but hilarious senior developer who roasts tech stacks for fun. Your tone is sarcastic, clever, and confidently opinionated — think stand-up comic meets tech Twitter.

    Here's the stack to roast:
    - Frontend: ${stack.frontend || 'Not specified'}
    - Backend: ${stack.backend || 'Not specified'}
    ${stack.database ? `- Database: ${stack.database}` : ''}
    ${stack.auth ? `- Auth: ${stack.auth}` : ''}
    ${stack.hosting ? `- Hosting: ${stack.hosting}` : ''}
    ${stack.styling ? `- Styling: ${stack.styling}` : ''}
    ${stack.misc ? `- Additional tools: ${stack.misc}` : ''}
    
    Format your response EXACTLY like this:
    
    "TITLE IN QUOTES" 
    
    Your actual roast text goes here. Make it witty, original, and less than 150 words total.
    
    Important formatting instructions:
    1. First line: Put your bold, catchy title in double quotes
    2. Second line: Leave completely blank
    3. Third line: A one-liner comment about the overall stack — witty, sarcastic, and opinionated
    4. Fourth line and beyond: Your actual roast content
    5. Keep your roast to 1-2 paragraphs max
    6. Be spicy and sarcastic, but don't be mean-spirited
    
    Do not include any explanations, disclaimers or additional text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a witty, sarcastic, and opinionated developer who roasts tech stacks in a fun and clever way. Keep it brief and memeable. Always follow the exact formatting instructions provided." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating roast with OpenAI:', error);
    throw new Error('Failed to generate roast. Please try again.');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { stack } = body;

    if (!stack) {
      return NextResponse.json(
        { error: 'Stack data is required' },
        { status: 400 }
      );
    }

    // Define stackData outside the try block so it's in scope for later use
    let stackData;

    // 1. Insert the stack into the database
    try {
      const { data, error: stackError } = await supabase
        .from('stacks')
        .insert([
          {
            frontend: stack.frontend || null,
            backend: stack.backend || null,
            database: stack.database || null,
            auth: stack.auth || null,
            hosting: stack.hosting || null,
            styling: stack.styling || null,
            misc: stack.misc || null,
          }
        ])
        .select()
        .single();

      if (stackError) {
        console.error('Error inserting stack:', stackError);
        return NextResponse.json(
          { error: `Failed to save stack: ${JSON.stringify(stackError)}` },
          { status: 500 }
        );
      }
      
      // Assign to the outer variable
      stackData = data;
      
    } catch (innerError) {
      console.error('Inner error during stack insert:', innerError);
      return NextResponse.json(
        { error: `Inner error: ${innerError.message}` },
        { status: 500 }
      );
    }

    // Check if we have valid stack data before continuing
    if (!stackData || !stackData.id) {
      return NextResponse.json(
        { error: 'Failed to generate stack ID' },
        { status: 500 }
      );
    }

    // 2. Generate the roast content using OpenAI
    const roastContent = await generateRoast(stack);

    // 3. Insert the roast into the database
    const { data: roastData, error: roastError } = await supabase
      .from('roasts')
      .insert([
        {
          stack_id: stackData.id,
          content: roastContent,
          is_public: true,
        }
      ])
      .select()
      .single();

    if (roastError) {
      console.error('Error inserting roast:', roastError);
      return NextResponse.json(
        { error: 'Failed to save roast' },
        { status: 500 }
      );
    }

    // Return the roast ID for redirection
    return NextResponse.json({ 
      id: roastData.id,
      message: 'Roast created successfully' 
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 