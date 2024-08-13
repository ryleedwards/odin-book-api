# Odinbook

This app is the capstone project of [The Odin Project](https://www.theodinproject.com/), an open-source and community-driven curriculum for full stack development.

## Navigation

- Repos:
  - [Front-end](https://github.com/ryleedwards/odin-book-frontend)
  - [Back-end](https://github.com/ryleedwards/odin-book-api)
- [Demo Deployment](https://odin-book-frontend-pearl.vercel.app/)
  - Guest account creds:
    - Username: guest1@odinbook.com
    - Pw: password

## Technology Stack

I deviated from the recommended MERN stack taught in TOP to take the opportunity to learn other technologies I saw utilized in other applications and communities. I did this in part out of preference, as well as an opportunity to break out of _tutorial hell_ and self-learn through practical use and documentation.

- Opted for use of TypeScript for strong typing
- Replaced MongoDB with PostgreSQL for more exposure to relational databases

- Stack:
  - Front-end:
    - Vite + React + TypeScript
    - [shadcn](https://ui.shadcn.com/) for pre-built components
    - [tailwindcss](https://tailwindcss.com/) for CSS Utility Classes
  - Back-end:
    - Node.js + TypeScript
    - [Express](https://expressjs.com/)
    - [PostgreSQL](https://www.postgresql.org/)
    - [Prisma ORM](https://www.prisma.io/)
    - [Passport](https://www.passportjs.org/) for authentication middleware
    - [Cloudinary](https://cloudinary.com/) for image hosting and a convenient Node.js SDK
  - Deployment Infrastructure
    - I opted for Vercel for my front-end and Railway for the back-end + db due to their ease-of-deployment and generous free-tier.

## Conclusion

I still have a fair amount of polish and new features I would like to implement in this project, but it has served me well as a foundation for understanding full-stack concepts.
