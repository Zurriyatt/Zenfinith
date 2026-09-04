import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://neondb_owner:npg_q3QO4gAPXFoJ@ep-bold-dawn-ay3k773m.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
});