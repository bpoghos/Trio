import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useAuth } from "./AuthContext"; // Import Auth Context
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';



const LoginPage = () => {
    // const [showPassword, setShowPassword] = useState(false);
    const { setIsLogin } = useAuth(); // ✅ Get global state updater
    const navigate = useNavigate(); // ✅ Use navigate to redirect

    const [error, setError] = useState<string | null>(null); // Error state to store error message

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userName = (e.target as HTMLFormElement).userName.value; // Get username
        const password = (e.target as HTMLFormElement).password.value; // Get password

        // If username or password is incorrect, show an error message
        if(userName !== "aram" || password !== "ilich") {
            setError("Invalid username or password!"); // Set error message
        } else {
            setIsLogin(true); // ✅ Update global state if login is successful
            navigate("/trio-admin"); // ✅ Redirect to admin page
            setError(null); // Clear any previous errors if login is successful
        }
    }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Form style={{ width: "20%" }} onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3 d-flex flex-column" controlId="formHorizontalUserName" >
          <Form.Label column sm={2}>Username</Form.Label>
          <Col sm={10}>
            <Form.Control type="text" placeholder="Username" name='userName'/>
          </Col>
        </Form.Group>
  
        <Form.Group as={Row} className="mb-3 d-flex flex-column position-relative" controlId="formHorizontalPassword">
          <Form.Label column sm={2}>Password</Form.Label>
          <Col sm={10} className="position-relative">
            <Form.Control 
              type={/* showPassword ? "text" : */ "password"} 
              placeholder="Password" 
              name='password'
            />
            {/* Eye Icon */}
            {/* <span 
              className="position-absolute end-0 top-50 translate-middle-y me-4"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span> */}
          </Col>
        </Form.Group>

        {/* Error Message */}
        {error && (
          <Form.Group as={Row} className="mb-3">
            <Col sm={12}>
              <div className="text-danger">{error}</div> {/* Display error in red */}
            </Col>
          </Form.Group>
        )}

        <Form.Group as={Row} className="mb-3">
          <Col sm={10} className="d-flex justify-content-start">
            <Button type="submit">Sign in</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LoginPage;
