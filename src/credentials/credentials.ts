require("dotenv").config();

export const googleCreds = {
  email: `${process.env.GOOGLE_EMAIL}`,
  password: `${process.env.GOOGLE_PASSWORD}`,
};

export const microsoftCreds = {
  email: `${process.env.MICROSOFT_EMAIL}`,
  password: `${process.env.MICROSOFT_PASSWORD}`,
};

export const kitconnectCreds = {
  email: `${process.env.KITCONNECT_EMAIL}`,
  password: `${process.env.KITCONNECT_PASSWORD}`,
};
