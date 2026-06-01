import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";

/**
 * ============================================================================
 * VALIDATION SCHEMAS
 * ============================================================================
 */

const createProfileSchema = z.object({
  nickname: z.string().min(1).max(50),
  interests: z.array(z.string()).min(1).max(5),
  location: z.string().min(1).max(50),
  bio: z.string().max(500).optional(),
});

const sendMessageSchema = z.object({
  chatRoomId: z.number(),
  content: z.string().min(1).max(1000),
});

const checkInSchema = z.object({
  place: z.string().min(1).max(255),
  interest: z.string().min(1).max(50),
});

const reportSchema = z.object({
  reportedUserId: z.number(),
  reason: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

/**
 * ============================================================================
 * MAIN ROUTER
 * ============================================================================
 */

export const appRouter = router({
  /**
   * ============================================================================
   * HEALTH CHECK
   * ============================================================================
   */
  health: publicProcedure.query(() => ({ status: "ok" })),

  /**
   * ============================================================================
   * AUTH PROCEDURES
   * ============================================================================
   */
  auth: router({
    /**
     * Logout - clears session
     */
    logout: protectedProcedure.mutation(({ ctx }) => {
      // Session is cleared by middleware
      return { success: true };
    }),
  }),

  /**
   * ============================================================================
   * USER PROFILE PROCEDURES
   * ============================================================================
   */
  profile: router({
    /**
     * Get current user's profile
     */
    me: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getUserProfile(ctx.user.id);
      return profile;
    }),

    /**
     * Create user profile (called after signup)
     */
    create: protectedProcedure
      .input(createProfileSchema)
      .mutation(async ({ ctx, input }) => {
        const existingProfile = await db.getUserProfile(ctx.user.id);
        if (existingProfile) {
          throw new Error("Profile already exists");
        }

        const profileId = await db.createUserProfile({
          userId: ctx.user.id,
          nickname: input.nickname,
          interests: input.interests,
          location: input.location,
          bio: input.bio,
        });

        return { id: profileId };
      }),

    /**
     * Update user profile
     */
    update: protectedProcedure
      .input(createProfileSchema.partial())
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),

    /**
     * Get user profile by ID (for viewing other users)
     */
    getById: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const profile = await db.getUserProfile(input.userId);
        return profile;
      }),
  }),

  /**
   * ============================================================================
   * MATCHING & CHAT ROOM PROCEDURES
   * ============================================================================
   */
  matching: router({
    /**
     * Start matching process - creates a new chat room
     */
    start: protectedProcedure.mutation(async ({ ctx }) => {
      const userProfile = await db.getUserProfile(ctx.user.id);
      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Find matching users
      const interests = Array.isArray(userProfile.interests) ? userProfile.interests : [];
      const matchedUserIds = await db.findMatchingUsers(
        ctx.user.id,
        interests as string[],
        userProfile.location,
        4 // Group size
      );

      if (matchedUserIds.length === 0) {
        throw new Error("No matching users found");
      }

      // Create chat room
      const firstInterest = interests.length > 0 ? interests[0] : "관심사";
      const roomName = `${firstInterest} 모임 - ${userProfile.location}`;
      const roomId = await db.createChatRoom({
        name: roomName,
        interests: interests as string[],
        location: userProfile.location,
      });

      // Add current user to room
      await db.addChatRoomMember({
        chatRoomId: roomId,
        userId: ctx.user.id,
      });

      // Add matched users to room
      for (const userId of matchedUserIds) {
        await db.addChatRoomMember({
          chatRoomId: roomId,
          userId,
        });
      }

      return { roomId };
    }),

    /**
     * Get user's active chat rooms
     */
    listRooms: protectedProcedure.query(async ({ ctx }) => {
      const rooms = await db.getUserChatRooms(ctx.user.id);
      return rooms;
    }),

    /**
     * Get chat room details with members
     */
    getRoom: protectedProcedure
      .input(z.object({ roomId: z.number() }))
      .query(async ({ input }) => {
        const room = await db.getChatRoom(input.roomId);
        if (!room) throw new Error("Chat room not found");

        const members = await db.getChatRoomMembers(input.roomId);
        const memberProfiles = await Promise.all(
          members.map((m: any) => db.getUserProfile(m.userId))
        );

        return {
          room,
          members: memberProfiles.filter((p: any) => p !== null),
        };
      }),

    /**
     * Leave chat room
     */
    leave: protectedProcedure
      .input(z.object({ roomId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.leaveChatRoom(input.roomId, ctx.user.id);
        return { success: true };
      }),
  }),

  /**
   * ============================================================================
   * MESSAGE PROCEDURES
   * ============================================================================
   */
  messages: router({
    /**
     * Send message to chat room
     */
    send: protectedProcedure
      .input(sendMessageSchema)
      .mutation(async ({ ctx, input }) => {
        const messageId = await db.sendMessage({
          chatRoomId: input.chatRoomId,
          userId: ctx.user.id,
          content: input.content,
        });

        return { id: messageId };
      }),

    /**
     * Get chat room messages
     */
    list: protectedProcedure
      .input(
        z.object({
          roomId: z.number(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        const messages = await db.getChatRoomMessages(
          input.roomId,
          input.limit,
          input.offset
        );

        // Enrich messages with user profile info
        const enrichedMessages = await Promise.all(
          messages.map(async (msg: any) => {
            const profile = await db.getUserProfile(msg.userId);
            return {
              ...msg,
              userNickname: profile?.nickname || "Unknown",
              userImage: profile?.profileImage,
            };
          })
        );

        return enrichedMessages;
      }),
  }),

  /**
   * ============================================================================
   * AI SUGGESTION PROCEDURES
   * ============================================================================
   */
  ai: router({
    /**
     * Get AI conversation suggestion for a chat room
     */
    getSuggestion: protectedProcedure
      .input(z.object({ roomId: z.number() }))
      .mutation(async ({ input }) => {
        const room = await db.getChatRoom(input.roomId);
        if (!room) throw new Error("Chat room not found");

        const interests = Array.isArray(room.interests) ? room.interests : [];
        const interestStr = interests.join(", ");

        // Call LLM to generate suggestion
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that suggests interesting conversation topics for group chats. Respond with a single, natural conversation starter question in Korean.",
            },
            {
              role: "user",
              content: `Generate a conversation starter for a group chat about: ${interestStr}. The group is meeting in ${room.location}. Keep it friendly and engaging.`,
            },
          ],
        });

        const content = response.choices[0]?.message?.content;
        const suggestion = typeof content === "string" ? content : "대화를 시작해보세요!";

        // Store suggestion
        const suggestionInterests = Array.isArray(interests) ? interests : [];
        await db.createAISuggestion({
          chatRoomId: input.roomId,
          suggestion,
          interests: suggestionInterests as string[],
        });

        return { suggestion };
      }),
  }),

  /**
   * ============================================================================
   * CHECK-IN PROCEDURES
   * ============================================================================
   */
  checkin: router({
    /**
     * Create check-in
     */
    create: protectedProcedure
      .input(checkInSchema)
      .mutation(async ({ ctx, input }) => {
        const checkInId = await db.createCheckIn({
          userId: ctx.user.id,
          place: input.place,
          interest: input.interest,
        });

        return { checkInId };
      }),

    /**
     * Get user's check-ins
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      const checkIns = await db.getUserCheckIns(ctx.user.id);
      return checkIns || [];
    }),

    /**
     * Get popular places for an interest
     */
    getPopularPlaces: protectedProcedure
      .input(z.object({ interest: z.string() }))
      .query(async ({ input }) => {
        const places = await db.getPopularPlacesByInterest(input.interest);
        return places || [];
      }),
  }),

  /**
   * ============================================================================
   * BLOCKING & REPORTING PROCEDURES
   * ============================================================================
   */
  safety: router({
    /**
     * Block a user
     */
    blockUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.blockUser(ctx.user.id, input.userId);
        return { success: true };
      }),

    /**
     * Unblock a user
     */
    unblockUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.unblockUser(ctx.user.id, input.userId);
        return { success: true };
      }),

    /**
     * Get blocked users list
     */
    getBlockedList: protectedProcedure.query(async ({ ctx }) => {
      const blocked = await db.getUserBlockedList(ctx.user.id);
      return blocked || [];
    }),

    /**
     * Report a user
     */
    reportUser: protectedProcedure
      .input(reportSchema)
      .mutation(async ({ ctx, input }) => {
        const reportId = await db.createReport({
          reporterId: ctx.user.id,
          reportedUserId: input.reportedUserId,
          reason: input.reason,
          description: input.description || undefined,
        });

        return { reportId };
      }),
  }),
});

export type AppRouter = typeof appRouter;
export type AppRouterCaller = ReturnType<typeof appRouter.createCaller>;
