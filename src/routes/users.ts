import express from 'express';
import {and, desc, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import {user} from "../db/schema";
import {db} from "../db";
import {DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT} from "../constants";
import {UserRoles} from "../type";

const router = express.Router();

// Get all users with optional search, filtering and pagination
router.get('/', async (req, res) => {
  try {
      const {search, role, page: rawPage, limit: rawLimit} = req.query;

      const parseQueryParam = (param: any, defaultValue: number): number => {
          if (param === undefined) return defaultValue;
          const value = Array.isArray(param) ? param[0] : param;
          const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
          return Number.isFinite(parsed) ? parsed : defaultValue;
      };

      const currentPage = Math.max(1, parseQueryParam(rawPage, DEFAULT_PAGE));
      const limitPerPage = Math.max(1, Math.min(MAX_LIMIT, parseQueryParam(rawLimit, DEFAULT_LIMIT)));
      const offset = (currentPage - 1) * limitPerPage;

      const filterConditions = [];

      // If search query exists, filter by user name OR email
      if (search) {
          filterConditions.push(
              or(
                  ilike(user.name, `%${search}%`),
                  ilike(user.email, `%${search}%`)
              )
          );
      }

      // If role filter exists, exact match
      const validRoles: UserRoles[] = ["admin", "teacher", "student"];

      if (role) {
          if (!validRoles.includes(role as UserRoles)) {
              return res.status(400).json({error: "Invalid role filter"});
          }
          filterConditions.push(
              eq(user.role, role as UserRoles)
          );
      }

      // Combine all filters using AND if any exist
      const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

      const countResult = await db
          .select({count: sql<number>`count(*)`})
          .from(user)
          .where(whereClause);

      const totalCount = Number(countResult[0]?.count ?? 0);

      const usersList = await db
          .select({
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role,
              createdAt: user.createdAt
          })
          .from(user)
          .where(whereClause)
          .orderBy(desc(user.createdAt))
          .limit(limitPerPage)
          .offset(offset);

      res.status(200).json({
          data: usersList,
          pagination: {
              page: currentPage,
              limit: limitPerPage,
              total: totalCount,
              totalPages: Math.ceil(totalCount / limitPerPage)
          }
      });
  } catch (error) {
      console.error(`GET /users failed: ${error}`);
      res.status(500).json({error:"Failed to get users"});
  }
})

export default router;
