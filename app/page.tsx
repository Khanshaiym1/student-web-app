import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);

export default async function Home() {
  const messages = await sql`
    SELECT * FROM messages
    ORDER BY id DESC
  `;

  async function addMessage(formData: FormData) {
    'use server';
    
    const message = String(
      formData.get('message') ?? ""
    ).trim();

    if (!message) return;

    const db = neon(process.env.DATABASE_URL!);

    await db`
      INSERT INTO messages (content)
      VALUES (${message})
    `;

    revalidatePath('/');
  }

  return (
    <main style={{ maxWidth: '700px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Хабарламалар</h1>
      
      <form action={addMessage} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          name="message" 
          placeholder="Жаңа хабарлама жазыңыз..." 
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', flex: 1 }}
          required 
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Жіберу
        </button>
      </form>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {messages.map((msg: any) => (
          <li key={msg.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            {msg.content || msg.message}
          </li>
        ))}
      </ul>
    </main>
  );
}
