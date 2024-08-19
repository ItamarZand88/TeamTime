// src/pages/SetupPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Alert } from "reactstrap";
import ShiftSetupTable from "../../components/adminComponents/ShiftTableSetup";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const SetupPage = () => {
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/config`);
        if (response.data && response.data.length > 0) {
          setShifts(response.data[0].shifts);
        }
      } catch (error) {
        console.error("Error fetching configuration:", error);
        setError("Failed to load settings. Please try again.");
      } finally {
        setLoading(false); // Ensure loading is false after fetch
      }
    };

    fetchConfig();
  }, []);

  const handleShiftsChange = (newShifts) => {
    setShifts(newShifts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/api/config`, {
        shifts,
      });
      setSuccess("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving shifts:", error);
      setError("Failed to save settings. Please try again."); // Handle error state or display error message
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        ></div>
        <Row>
          <Col md={12}>
            <ShiftSetupTable
              shifts={shifts}
              onShiftsChange={handleShiftsChange}
              handleSubmit={handleSubmit}
            />
          </Col>
        </Row>
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
      </Form>
    </Container>
  );
};

export default SetupPage;
