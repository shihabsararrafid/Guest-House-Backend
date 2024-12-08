import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ConfirmBookingEmailProps {
  booking: {
    id: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    rooms: Array<{
      roomNumber: string;
      type: string;
      numberOfGuests: number;
      pricePerNight: number;
    }>;
  };
  payment: {
    id: string;
    amount: number;
    status: string;
    stripeReceiptUrl: string | null;
  };
}

export const ConfirmBookingEmail = ({
  booking,
  payment,
}: ConfirmBookingEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Hotel Booking Confirmation</Preview>

    <Body style={main}>
      <Container style={container}>
        <Section>
          <Row>
            <Img
              src={`https://i.ibb.co.com/k9FbNcT/RUET-logo.png`}
              width="49"
              height="50"
              alt="RUET Guest House Logo"
            />
            <Hr />
          </Row>
        </Section>

        <Section>
          <Text style={confirmationText}>
            Thank you for choosing Ruet Guest House. Your booking has been
            confirmed!
          </Text>
        </Section>

        <Section style={informationTable}>
          <Row style={informationTableRow}>
            <Column colSpan={2}>
              <Section>
                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>BOOKING ID</Text>
                    <Text style={informationTableValue}>{booking?.id}</Text>
                  </Column>
                </Row>

                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>PAYMENT STATUS</Text>
                    <Text style={informationTableValue}>{payment?.status}</Text>
                  </Column>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>AMOUNT PAID</Text>
                    <Text style={informationTableValue}>
                      BDT {payment?.amount}
                    </Text>
                  </Column>
                </Row>

                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>CHECK-IN</Text>
                    <Text style={informationTableValue}>
                      {new Date(booking?.checkIn).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </Column>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>CHECK-OUT</Text>
                    <Text style={informationTableValue}>
                      {new Date(booking?.checkOut).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Column>
          </Row>
        </Section>

        <Section style={productTitleTable}>
          <Text style={productsTitle}>Room Details</Text>
        </Section>

        {booking?.rooms?.map((room, index) => (
          <Section key={index}>
            <Row>
              <Column style={{ paddingLeft: "22px" }}>
                <Text style={productTitle}>
                  {room?.type} Room ({room.roomNumber})
                </Text>
                <Text style={productDescription}>
                  {room?.numberOfGuests} Guests
                </Text>
                <Text style={productDescription}>
                  BDT {room?.pricePerNight} per night
                </Text>
              </Column>
            </Row>
          </Section>
        ))}

        <Hr style={productPriceLine} />
        <Section align="right">
          <Row>
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>TOTAL PAID</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>BDT {booking?.totalPrice}</Text>
            </Column>
          </Row>
        </Section>
        <Hr style={productPriceLineBottom} />

        <Section style={importantInfo}>
          <Text style={importantInfoTitle}>Important Information</Text>
          <Text style={importantInfoText}>
            • Check-in time starts at 12:00 PM
          </Text>
          <Text style={importantInfoText}>• Check-out time is 11:00 AM</Text>
          <Text style={importantInfoText}>
            • Please present your booking ID at check-in
          </Text>
          <Text style={importantInfoText}>• Photo ID required at check-in</Text>
        </Section>

        {payment?.stripeReceiptUrl && (
          <Section>
            <Text style={footerText}>
              View your payment receipt:
              <Link href={payment?.stripeReceiptUrl} style={footerLink}>
                Click here
              </Link>
            </Text>
          </Section>
        )}

        <Section>
          <Text style={footerTextCenter}>
            Need help with your booking?
            <Link href="mailto:support@luxuryhotel.com" style={footerLink}>
              {" "}
              Contact Support
            </Link>
          </Text>
        </Section>

        <Text style={footerCopyright}>
          Copyright © 2024 Luxury Hotel. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ConfirmBookingEmail;

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
  maxWidth: "100%",
};

const tableCell = { display: "table-cell" };

const heading = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#888888",
};

const cupomText = {
  textAlign: "center" as const,
  margin: "36px 0 40px 0",
  fontSize: "14px",
  fontWeight: "500",
  color: "#111111",
};

const supStyle = {
  fontWeight: "300",
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "12px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productTitleTable = {
  ...informationTable,
  margin: "30px 0 15px 0",
  height: "24px",
};

const productsTitle = {
  background: "#fafafa",
  paddingLeft: "10px",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const productIcon = {
  margin: "0 0 0 20px",
  borderRadius: "14px",
  border: "1px solid rgba(128,128,128,0.2)",
};

const productTitle = { fontSize: "12px", fontWeight: "600", ...resetText };

const productDescription = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  ...resetText,
};

const productLink = {
  fontSize: "12px",
  color: "rgb(0,112,201)",
  textDecoration: "none",
};

const divisor = {
  marginLeft: "4px",
  marginRight: "4px",
  color: "rgb(51,51,51)",
  fontWeight: 200,
};

const productPriceTotal = {
  margin: "0",
  color: "rgb(102,102,102)",
  fontSize: "10px",
  fontWeight: "600",
  padding: "0px 30px 0px 0px",
  textAlign: "right" as const,
};

const productPrice = {
  fontSize: "12px",
  fontWeight: "600",
  margin: "0",
};

const productPriceLarge = {
  margin: "0px 20px 0px 0px",
  fontSize: "16px",
  fontWeight: "600",
  whiteSpace: "nowrap" as const,
  textAlign: "right" as const,
};

const productPriceWrapper = {
  display: "table-cell",
  padding: "0px 20px 0px 0px",
  width: "100px",
  verticalAlign: "top",
};

const productPriceLine = { margin: "30px 0 0 0" };

const productPriceVerticalLine = {
  height: "48px",
  borderLeft: "1px solid",
  borderColor: "rgb(238,238,238)",
};

const productPriceLargeWrapper = { display: "table-cell", width: "90px" };

const productPriceLineBottom = { margin: "0 0 75px 0" };

const block = { display: "block" };

const ctaTitle = {
  display: "block",
  margin: "15px 0 0 0",
};

const ctaText = { fontSize: "24px", fontWeight: "500" };

const walletWrapper = { display: "table-cell", margin: "10px 0 0 0" };

const walletLink = { color: "rgb(0,126,255)", textDecoration: "none" };

const walletImage = {
  display: "inherit",
  paddingRight: "8px",
  verticalAlign: "middle",
};

const walletBottomLine = { margin: "65px 0 20px 0" };

const footerText = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  margin: "0",
  lineHeight: "auto",
  marginBottom: "16px",
};

const footerTextCenter = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  margin: "20px 0",
  lineHeight: "auto",
  textAlign: "center" as const,
};

const footerLink = { color: "rgb(0,115,255)" };

const footerIcon = { display: "block", margin: "40px 0 0 0" };

const footerLinksWrapper = {
  margin: "8px 0 0 0",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "rgb(102,102,102)",
};

const footerCopyright = {
  margin: "25px 0 0 0",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "rgb(102,102,102)",
};

const walletLinkText = {
  fontSize: "14px",
  fontWeight: "400",
  textDecoration: "none",
};

const hotelLogo = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
  padding: "20px 0",
};

const confirmationText = {
  textAlign: "center" as const,
  margin: "36px 0 40px 0",
  fontSize: "16px",
  fontWeight: "500",
  color: "#111111",
};

const importantInfo = {
  backgroundColor: "#f8f9fa",
  padding: "20px",
  borderRadius: "4px",
  margin: "30px 0",
};

const importantInfoTitle = {
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 15px 0",
  color: "#1a1a1a",
};

const importantInfoText = {
  fontSize: "14px",
  color: "#4a4a4a",
  margin: "8px 0",
  lineHeight: "1.5",
};
