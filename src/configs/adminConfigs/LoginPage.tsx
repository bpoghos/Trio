import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useAuth } from "./AuthContext"; // Import Auth Context
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase authentication
import { auth } from '../firebase/firebase';


const LoginPage = () => {
    const { setIsLogin } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const email = (e.target as HTMLFormElement).userName.value;
        const password = (e.target as HTMLFormElement).password.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsLogin(true);
            navigate("/trio-admin");
        } catch (err: any) {
            setError("Invalid email or password!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Form style={{ width: "20%" }} onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3 d-flex flex-column" controlId="formHorizontalUserName">
                    <Form.Label column sm={2}>Email</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="email" placeholder="Email" name='userName' required />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 d-flex flex-column" controlId="formHorizontalPassword">
                    <Form.Label column sm={2}>Password</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="password" placeholder="Password" name='password' required />
                    </Col>
                </Form.Group>

                {error && (
                    <Form.Group as={Row} className="mb-3">
                        <Col sm={12}>
                            <div className="text-danger">{error}</div>
                        </Col>
                    </Form.Group>
                )}

                <Form.Group as={Row} className="mb-3">
                    <Col sm={10} className="d-flex justify-content-start">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    );
};

export default LoginPage;
