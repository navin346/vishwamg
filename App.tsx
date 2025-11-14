import React from 'react';
import MainApp from './src/MainApp';

/**
 * This file was causing a build error because it was empty but likely included
 * in the compilation. It's assumed to be an alternative entry point for
 * development or testing (e.g., Storybook).
 *
 * It has been populated with a valid component that renders MainApp with the
 * required props to resolve the error.
 */
const App: React.FC = () => {
  return <MainApp onLogout={() => console.log("Logout clicked from root App.tsx")} />;
};

export default App;
