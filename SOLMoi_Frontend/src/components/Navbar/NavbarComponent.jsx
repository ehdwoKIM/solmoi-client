//Navbar/NavbarComponent.jsx
import { useUser } from "../../contexts/userContext";
import { useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function NavbarComponent() {
    const expand = 'lg';
    const { onLogin, setEmail, email, Logout } = useUser();

    // email 값이 없으면 sessionStorage에서 가져옴
    useEffect(() => {
        if (!email) {
            const storedEmail = sessionStorage.getItem('email');
            if (storedEmail) {
                setEmail(storedEmail);
            }
        }
    }, [setEmail]);

    return (
        <Navbar expand={expand} className="bg-body-tertiary">
            <Container fluid className="custom-navbar">
                <Navbar.Brand href="/">쏠모이</Navbar.Brand>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                >
                    <Offcanvas.Header closeButton>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {!onLogin ? (
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link href="/auth/login">로그인</Nav.Link>
                                <Nav.Link href="/auth/register">회원가입</Nav.Link>
                            </Nav>
                        ) : (
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link onClick={Logout}>로그아웃</Nav.Link>
                            </Nav>
                        )}
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
}
