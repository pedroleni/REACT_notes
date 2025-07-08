import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router"

const Header = () => {
    return(
        <div className="container">
            <Navbar className="yellotail">
                <Navbar.Brand as={Link} to="/">The daily news</Navbar.Brand>
            </Navbar>
            <Nav>
                <Nav.Item>
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default Header;