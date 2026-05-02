import { useEffect } from "react";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { useTranslation } from "react-i18next";
import "../index.css"; // Ensure your CSS is imported!

const LoginStyleWidget = () => {
  // Grab the i18n object to check the active language!
  const { i18n } = useTranslation();

  useEffect(() => {
    // 1. Add our scoping class to protect the rest of the dashboard
    document.body.classList.add("custom-login-page");

    // 2. Decide what text to show based on the language!
    // Note: The extra single quotes inside the string are REQUIRED for CSS 'content' to work!
    const welcomeText = i18n.language === "fa" 
      ? "'به برند من خوش آمدید!'" 
      : "'Welcome to My Brand!'";

    // 3. Inject this text as a CSS variable globally into the document root!
    document.documentElement.style.setProperty("--custom-login-title", welcomeText);

    // Cleanup function when the user logs in and leaves this page
    return () => {
      document.body.classList.remove("custom-login-page");
      document.documentElement.style.removeProperty("--custom-login-title");
    };
  }, [i18n.language]); // If the user switches the language dropdown, this re-runs!

  return null; // This widget is invisible, it just does background magic!
};

export const config = defineWidgetConfig({
  zone: "login.before",
});

export default LoginStyleWidget;
