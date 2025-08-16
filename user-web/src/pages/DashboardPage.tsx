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
  return (
    <Layout
      activeRoute="/"
      onNavigate={(route: string) => {
        // implement navigation handling if needed, e.g. history.push(route)
      }}
      onLogout={() => {
        // implement logout handling if needed
      }}
    >
      <Body />
    </Layout>
  );
};

export default DashboardPage;
