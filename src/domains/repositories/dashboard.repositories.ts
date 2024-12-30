import { PrismaClient } from "@prisma/client";
import { AppError } from "../../libraries/error-handling/AppError";

export class DashboardRepository {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async calculateTrend(current: number, previous: number): Promise<string> {
    if (previous === 0) return "+100%";
    const percentageChange = ((current - previous) / previous) * 100;
    const sign = percentageChange >= 0 ? "+" : "";
    return `${sign}${percentageChange.toFixed(1)}%`;
  }
  async GetDashboardInfo() {
    try {
      // Time periods
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Rooms trend (compare with last month)
      const currentRooms = await prisma.room.count();
      const previousRooms = await prisma.room.count({
        where: {
          createdAt: {
            lt: currentMonthStart,
          },
        },
      });
      const roomsTrend = await this.calculateTrend(currentRooms, previousRooms);

      // Active guests trend (compare current week with previous week)
      const currentActiveGuests = await this.prisma.booking.findMany({
        where: {
          status: "CONFIRMED",
          checkIn: {
            gte: weekAgo,
          },
        },

        distinct: ["guestId"],
      });

      const previousActiveGuests = await prisma.booking.findMany({
        where: {
          status: "CONFIRMED",
          checkIn: {
            gte: twoWeeksAgo,
            lt: weekAgo,
          },
        },
        distinct: ["guestId"],
      });

      const guestsTrend = await this.calculateTrend(
        currentActiveGuests.length,
        previousActiveGuests.length
      );
      // console.log(currentActiveGuests, previousActiveGuests, guestsTrend);
      // New bookings trend (current week vs previous week)
      const currentBookings = await prisma.booking.count({
        where: {
          createdAt: {
            gte: weekAgo,
          },
        },
      });

      const previousBookings = await prisma.booking.count({
        where: {
          createdAt: {
            gte: twoWeeksAgo,
            lt: weekAgo,
          },
        },
      });

      const bookingsTrend = await this.calculateTrend(
        currentBookings,
        previousBookings
      );

      // Revenue trend (current month vs previous month)
      const currentRevenue = await prisma.paymentTransaction.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: currentMonthStart,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const previousRevenue = await prisma.paymentTransaction.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const revenueTrend = await this.calculateTrend(
        currentRevenue._sum.amount || 0,
        previousRevenue._sum.amount || 0
      );

      // Recent bookings with additional details
      const recentBookings = await prisma.booking.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          guest: {
            select: {
              email: true,
            },
          },
          rooms: {
            include: {
              room: {
                select: {
                  roomNumber: true,
                },
              },
            },
          },
        },
      });

      return {
        stats: {
          totalRooms: {
            value: currentRooms,
            trend: roomsTrend,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            icon: "Hotel",
          },
          activeGuests: {
            value: currentActiveGuests.length,
            trend: guestsTrend,
            color: "text-green-600",
            bgColor: "bg-green-100",
            icon: "Users",
          },
          newBookings: {
            value: currentBookings,
            trend: bookingsTrend,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            icon: "Calendar",
          },
          revenue: {
            value: currentRevenue._sum.amount || 0,
            trend: revenueTrend,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
            icon: "CreditCard",
          },
        },
        recentBookings: recentBookings.map((booking) => ({
          id: booking.id,
          //   guestName: `${booking.guest.firstName} ${booking.guest.lastName}`,
          email: booking.guest.email,
          roomNumber: booking.rooms[0]?.room.roomNumber,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          status: booking.status,
          amount: booking.totalPrice,
          paidAmount: booking.paidAmount,
        })),
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to fetch dashboard info: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
}
