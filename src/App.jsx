import { Navbar, Welcome, Footer, Services, Transactions, Modals } from "./components";

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <div id="exchange">
        <Welcome />
      </div>
    </div>
    <div id="services">
      <Services />
    </div>
    <div id="transactions">
      <Transactions />
    </div>
    <Footer />
    <Modals />
  </div>
);

export default App;
