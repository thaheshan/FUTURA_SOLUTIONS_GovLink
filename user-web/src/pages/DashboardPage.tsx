// // src/pages/DashboardPage.tsx
// import React from "react";
// import Layout from "../components/layout/Layout";
// import Body from "../components/Body";

// const DashboardPage: React.FC = () => {
//   return (
//     <Layout>
//       <Body />
//     </Layout>
//   );
// };

// export default DashboardPage;

// src/pages/DashboardPage.tsx
import React from "react";
import Layout from "../components/layout/Layout";
import Body from "../components/Body";

const DashboardPage: React.FC = () => {
  // Example values for required props
  const activeRoute = "dashboard";
  const onNavigate = (route: string) => {
    // Implement navigation logic here
    console.log("Navigating to:", route);
  };
  const onLogout = () => {
    // Implement logout logic here
    console.log("Logging out");
  };

  return (
    <Layout
      activeRoute={activeRoute}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <Body />
    </Layout>
  );
};

export default DashboardPage;
