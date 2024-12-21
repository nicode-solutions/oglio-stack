<div align="center">
  <img src="./public/logo.svg" alt="OglioStack Logo" />
</div>

## OglioStack v0.1.0

OglioStack is an open source full stack web development boilerplate developed by [nicode.solutions](https://nicode.solutions).

### Stack
- [Supabase](https://supabase.io)
- [Next.js](https://nextjs.org)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)

### Useful commands
#### Generate Supabase Types
```bash
export PROJECT_REF="pdqnmyvrdycjiycjzacl"
pnpx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/types/supabase.ts
```

### Tunneling
```bash
ssh -R 80:localhost:3000 nokey@localhost.run
```

Add supabase_url secret to ./supabase/seed.sql. We will use this to query our Edge Functions within our local environment. In production, set this to your Supabase project's API URL.

### Notes for v0.1.0

#### Supabase Auth: 
after signup user gets the following email text:
```
Confirm your signup
Follow this link to confirm your user:
https://pdqnmyvrdycjiycjzacl.supabase.co/auth/v1/verify?token=pkce_ac785949af31fddfa3b7b3983c5680a7e18d429a9aeb519725612503&type=signup&redirect_to=http://localhost:3000
```
somehow this token should be used to authenticate the user when the user is redirected to the app:
- https://supabase.com/docs/guides/auth/server-side/nextjs

#### Lemonsqueezy integration
- Change plan

#### TanStack Query
- https://tanstack.com/query/latest/docs/framework/react/guides/ssr

#### Error handling