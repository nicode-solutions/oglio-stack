# OglioStack - v0.1.0
![OglioStack Logo](./public/logo.svg)


## OglioStack - A Full Stack Web Development Boilerplate 

OglioStack is a full stack web development boilerplate developed by [nicode.solutions](https://nicode.solutions).

### Stack
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.io)
- [Tailwind CSS](https://tailwindcss.com)

### Usefull commands
#### Generate Supabase Types
```bash
export PROJECT_REF="pdqnmyvrdycjiycjzacl"
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/types/supabase.ts
```