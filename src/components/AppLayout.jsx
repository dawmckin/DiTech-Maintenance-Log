import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
    return (
        <div className='app-container'>
            <Header />

            <div className='app-content'>
                <Outlet />
            </div>

            <Footer />
        </div>
    )
}