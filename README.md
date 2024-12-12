<div align="center">
  <img src="./public/logo.svg" alt="OglioStack Logo" />
</div>

## OglioStack v0.1.0

OglioStack is an open source full stack web development boilerplate developed by [nicode.solutions](https://nicode.solutions).

### Stack
- [Supabase](https://supabase.io)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)

### Useful commands
#### Generate Supabase Types
```bash
export PROJECT_REF="pdqnmyvrdycjiycjzacl"
pnpx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/types/supabase.ts
```

### Notes

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
ssh -R 80:localhost:3000 nokey@localhost.run

check the revalidatePath('/') thing

#### Error handling

#### TanStack Query