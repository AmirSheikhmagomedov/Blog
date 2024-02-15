import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Container from '../Container/Container';

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
}
