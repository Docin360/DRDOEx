  import React from "react";
  import Form from "./components/Form"; // Updated to use the Form component

  function App() {
    return (
      <div className="App">
        <header style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
          <h1>DRDO Application Form</h1>
          <p>Please fill out the form below to submit your application.</p>
        </header>

        <main style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
          <Form /> {/* Use the updated Form component */}
        </main>

        <footer style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
          <p>DRDO - Application Verification System</p>
        </footer>
      </div>
    );
  }

  export default App;
