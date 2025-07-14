
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const supabase = createClient();

  const { data: todos } = await supabase.from('todos').select();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Todos List</h1>
      {todos && todos.length > 0 ? (
        <ul className="list-disc list-inside bg-card p-4 rounded-lg border">
          {todos?.map((todo: any) => (
            <li key={todo.id} className="p-2 border-b">
              {todo.task}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No todos found. Make sure you have created the 'todos' table and added some data in your Supabase project.</p>
      )}
    </main>
  );
}
