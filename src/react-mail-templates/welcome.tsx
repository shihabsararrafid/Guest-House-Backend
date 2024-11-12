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
// import ruetLogo from "./RUET_logo.png";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";
export const WelcomeEmail = ({
  verificationUrl = "https://example.com/verify",
}) => (
  <Html>
    <Head />
    <Preview>Welcome! Please verify your email address to get started</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`https://i.ibb.co.com/k9FbNcT/RUET-logo.png`}
            width="49"
            height="50"
            alt="Company Logo"
          />
          <Hr style={hr} />
          <Text style={paragraph}>
            Welcome to RUET GUEST HOUSE! We're excited to have you on board.
          </Text>
          <Text style={paragraph}>
            To get started, please verify your email address by clicking the
            button below:
          </Text>
          {/* @ts-ignore */}
          <Button style={button} href={verificationUrl}>
            Verify Email Address
          </Button>
          {/* @ts-ignore */}
          <Text style={smallText}>
            This link will expire in 24 hours for security reasons.
          </Text>
          <Hr style={hr} />
          <Text style={paragraph}>
            Once your email is verified, you'll have full access to your account
            and all our features. Here's what you can look forward to:
          </Text>
          <ul style={listStyle}>
            <li style={listItem}>Personalized dashboard</li>
            <li style={listItem}>Easily Book Guest House</li>
            <li style={listItem}>Regular updates and newsletters</li>
          </ul>
          <Text style={paragraph}>
            If you have any questions, our{" "}
            <Link style={anchor} href="https://support.example.com">
              support team
            </Link>{" "}
            is always here to help.
          </Text>
          <Text style={paragraph}>
            If you didn't create this account, please ignore this email or
            contact our support team.
          </Text>
          <Text style={paragraph}>— RUET GUEST HOUSE</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Rajshahi University of Engineering and Technology. Talaimari ,
            Rajshahi 6100
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  // textAlign: "left",
};

const anchor = {
  color: "#556cd6",
};

const button = {
  backgroundColor: "#4f46e5",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "24px",
  marginBottom: "24px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const smallText = {
  ...paragraph,
  fontSize: "14px",
  color: "#6b7280",
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
