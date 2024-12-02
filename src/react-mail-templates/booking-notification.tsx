import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface RoomDetails {
  roomNumber: string;
  type: string;
  pricePerNight: number;
  numberOfGuests: number;
  specialRequests: string | null;
  viewType: string;
  hasWifi: boolean;
  hasAC: boolean;
  hasTv: boolean;
  hasRefrigerator: boolean;
}

interface BookingEmailProps {
  bookingId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  totalPriceWithDiscount: number;
  discount: number;
  discountType: string;
  bookedMoney: number;
  paidAmount: number;
  status: string;
  rooms: RoomDetails[];
  guestName: string;
}

export const BookingConfirmationEmail = ({
  bookingId,
  checkIn,
  checkOut,
  totalPrice,
  totalPriceWithDiscount,
  discount,
  discountType,
  bookedMoney,
  paidAmount,
  status,
  rooms,
  guestName,
}: BookingEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Your Booking Confirmation at RUET Guest House - Booking #{bookingId}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`https://i.ibb.co.com/k9FbNcT/RUET-logo.png`}
            width="49"
            height="50"
            alt="RUET Guest House Logo"
          />
          <Hr style={hr} />
          <Text style={paragraph}>Dear {guestName},</Text>
          <Text style={paragraph}>
            Thank you for choosing RUET Guest House. Your booking details are as
            follows:
          </Text>

          <Section style={bookingBox}>
            <Text style={bookingHeader}>Booking Information</Text>
            <Text>Booking ID: {bookingId}</Text>
            <Text style={statusBadge(status)}>{status}</Text>

            <Section style={detailsGrid}>
              <Text style={detailLabel}>Check-in:</Text>
              <Text style={detailValue}>
                {new Date(checkIn).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>

              <Text style={detailLabel}>Check-out:</Text>
              <Text style={detailValue}>
                {new Date(checkOut).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Section>

            <Hr style={hr} />

            {rooms?.map((room, index) => (
              <Section key={index} style={roomSection}>
                <Text style={roomHeader}>Room {index + 1} Details</Text>
                <Section style={detailsGrid}>
                  <Text style={detailLabel}>Room Number:</Text>
                  <Text style={detailValue}>{room.roomNumber}</Text>

                  <Text style={detailLabel}>Room Type:</Text>
                  <Text style={detailValue}>{room.type}</Text>

                  <Text style={detailLabel}>Price Per Night:</Text>
                  <Text style={detailValue}>৳{room.pricePerNight}</Text>

                  <Text style={detailLabel}>Number of Guests:</Text>
                  <Text style={detailValue}>{room.numberOfGuests}</Text>

                  <Text style={detailLabel}>View:</Text>
                  <Text style={detailValue}>{room.viewType}</Text>
                </Section>

                <Text style={amenitiesHeader}>Room Amenities:</Text>
                <Section style={amenitiesGrid}>
                  {room.hasWifi && <Text style={amenity}>✓ WiFi</Text>}
                  {room.hasAC && <Text style={amenity}>✓ AC</Text>}
                  {room.hasTv && <Text style={amenity}>✓ TV</Text>}
                  {room.hasRefrigerator && (
                    <Text style={amenity}>✓ Refrigerator</Text>
                  )}
                </Section>

                {room.specialRequests && (
                  <>
                    <Text style={detailLabel}>Special Requests:</Text>
                    <Text style={detailValue}>{room.specialRequests}</Text>
                  </>
                )}
              </Section>
            ))}

            <Hr style={hr} />

            <Section style={priceBox}>
              <Text style={priceHeader}>Price Summary</Text>
              <Section style={detailsGrid}>
                <Text style={detailLabel}>Total Price:</Text>
                <Text style={detailValue}>৳{totalPrice}</Text>

                {discount > 0 && (
                  <>
                    <Text style={detailLabel}>Discount ({discountType}):</Text>
                    <Text style={detailValue}>৳{discount}</Text>

                    <Text style={detailLabel}>Price After Discount:</Text>
                    <Text style={detailValue}>৳{totalPriceWithDiscount}</Text>
                  </>
                )}

                <Text style={detailLabel}>Booked Money:</Text>
                <Text style={detailValue}>৳{bookedMoney}</Text>

                <Text style={detailLabel}>Paid Amount:</Text>
                <Text style={detailValue}>৳{paidAmount}</Text>

                <Text style={detailLabel}>Remaining Amount:</Text>
                <Text style={detailValue}>
                  ৳{totalPriceWithDiscount - paidAmount}
                </Text>
              </Section>
            </Section>
          </Section>

          <Text style={paragraph}>Important Information:</Text>
          <ul style={listStyle}>
            <li style={listItem}>Check-in time starts from 2:00 PM</li>
            <li style={listItem}>Check-out time is until 12:00 PM</li>
            <li style={listItem}>Please present your ID at check-in</li>
            <li style={listItem}>
              Remaining payment should be made at check-in
            </li>
          </ul>

          <Text style={paragraph}>
            Need assistance? Contact us at{" "}
            <Link style={anchor} href="mailto:support@ruetguesthouse.com">
              support@ruetguesthouse.com
            </Link>
          </Text>

          <Hr style={hr} />
          {/* @ts-ignore */}
          <Text style={footer}>
            Rajshahi University of Engineering and Technology
            <br />
            Talaimari, Rajshahi 6100
            <br />
            Bangladesh
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Existing styles remain the same...

const statusBadge = (status: string) => ({
  backgroundColor: status === "PENDING" ? "#FEF3C7" : "#D1FAE5",
  color: status === "PENDING" ? "#92400E" : "#065F46",
  padding: "4px 12px",
  borderRadius: "9999px",
  fontSize: "14px",
  fontWeight: "medium",
  display: "inline-block",
  marginBottom: "16px",
});

const bookingId = {
  fontSize: "14px",
  color: "#6B7280",
  marginBottom: "8px",
};

const roomSection = {
  backgroundColor: "#FFFFFF",
  padding: "16px",
  borderRadius: "6px",
  marginBottom: "16px",
  border: "1px solid #E5E7EB",
};

const roomHeader = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1F2937",
  marginBottom: "12px",
};

const amenitiesHeader = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#4B5563",
  marginTop: "12px",
  marginBottom: "8px",
};

const amenitiesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "8px",
  marginBottom: "16px",
};

const amenity = {
  fontSize: "14px",
  color: "#059669",
};

const priceBox = {
  backgroundColor: "#F9FAFB",
  padding: "16px",
  borderRadius: "6px",
  marginTop: "16px",
};

const priceHeader = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1F2937",
  marginBottom: "12px",
};
const main = {
  backgroundColor: "#f6f9fc",
  width: "100%",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  // margin: "0 auto",
  width: "100%",
  padding: "20px 0px 0px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const bookingBox = {
  backgroundColor: "#f8fafc",
  padding: "24px",
  borderRadius: "8px",
  margin: "24px 0",
};

const bookingHeader = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1e293b",
  marginBottom: "16px",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  gap: "8px",
  marginBottom: "16px",
};

const detailLabel = {
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "500",
};

const detailValue = {
  color: "#1e293b",
  fontSize: "14px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
};

const anchor = {
  color: "#556cd6",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center",
};

const listStyle = {
  marginTop: "8px",
  marginBottom: "24px",
  paddingLeft: "24px",
};

const listItem = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "8px",
};

// ... rest of the existing styles remain the same

export default BookingConfirmationEmail;
