
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = createClient();

  const { data: todos } = await supabase.from('todos').select();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <ul className="list-disc list-inside bg-card p-4 rounded-lg border">
        {todos?.map((todo: any) => (
          <li key={todo.id}>{todo.title ?? "Untitled Todo"}</li>
        ))}
      </ul>
    </main>
  )
}
