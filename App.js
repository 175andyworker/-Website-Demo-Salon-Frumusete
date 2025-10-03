import React from 'react';
import ReactDOM from 'react-dom/client';
import DomeGallery from './DomeGallery';

// Acesta este componenta principala a aplicatiei tale
function App() {
    return (
        <div>
            {/* Animatia cu logo - va trebui refacuta in React */}
            <div className="preloader">
                <img src="logo.png" alt="Logo" className="logo-intro" />
            </div>

            {/* Antetul site-ului */}
            <header className="nav-wrapper">
                <div className="header-content">
                    <img src="logo.png" alt="Logo" />
                    <button className="hamburger-menu">
                        <span className="line"></span>
                        <span className="line"></span>
                        <span className="line"></span>
                    </button>
                </div>
                <div className="menu-container">
                    <nav>
                        <ul>
                            <li><a href="index.html">Acasă</a></li>
                            <li><a href="servicii.html">Servicii</a></li>
                            <li><a href="portofoliu.html">Portofoliu</a></li>
                            <li><a href="despre-noi.html">Despre noi</a></li>
                            <li><a href="contact.html">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Sectiunea Hero */}
            <section className="hero-section">
                <div className="hero-text">
                    <h1>Transformăm Frumusețea Ta Exterioară Pentru a o potrivi cu Cea Interioară</h1>
                    <div className="hero-buttons">
                        <button>Programează acum</button>
                        <button className="portfolio-btn">Portofoliu</button>
                    </div>
                </div>
                
                <div className="working-hours animate-on-scroll">
                    <p><strong>Luni - Duminică:</strong> 09:00 - 20:00</p>
                    <p><strong>Aleea Mircea Cel Batrân 4/6, Chișinău</strong></p>
                </div>
            </section>
            
            {/* AICI ESTE NOUA GALERIE DOME */}
            <DomeGallery />
            {/* AICI SE TERMINA NOUA GALERIE */}

            {/* Sectiunea Servicii */}
            <section className="services-section animate-on-scroll">
                <div className="service-item">
                    <img src="pensule.png" alt="Servicii Machiaj" />
                    <h3>Machiaj</h3>
                    <p>Machiaj profesional pentru evenimente speciale, de zi sau de seară, adaptat perfect trăsăturilor tale.</p>
                </div>
                <div className="service-item">
                    <img src="pensule.png" alt="Servicii Manichiura" />
                    <h3>Manichiură și Pedichiură</h3>
                    <p>Manichiură și pedichiură impecabilă, cu o gamă variată de culori și modele creative pentru unghii perfecte.</p>
                </div>
                <div className="service-item">
                    <img src="pensule.png" alt="Servicii Coafura" />
                    <h3>Coafură</h3>
                    <p>Coafuri de look, tunsori de precizie și tratamente personalizate pentru un păr sănătos și strălucitor.</p>
                </div>
            </section>

            {/* Sectiunea de tip 'Call to Action' */}
            <section className="call-to-action-banner animate-on-scroll">
                <div className="banner-content">
                    <h2>. . . Look Beautiful • Feel Beautiful . . .</h2>
                    <button>Programează acum</button>
                </div>
            </section>

            {/* Sectiunea Despre Artisti */}
            <section className="artist-section animate-on-scroll">
                <div className="artist-image-container">
                    <div className="image-circle"></div>
                    <img src="pensule.png" alt="Artist Machiaj" />
                </div>
                <div className="artist-text-container">
                    <h2>Cunoaște Artiștii</h2>
                    <p>
                        Pasiunea noastră pentru frumusețe a început cu mult timp în urmă. Suntem dedicate artei transformării, punând accent pe tehnică și pe cele mai noi tendințe. Fiecare client este o sursă de inspirație, iar scopul nostru este să dăm viață unui look care să-i pună în valoare frumusețea unică. Te așteptăm la salon pentru o experiență memorabilă!
                    </p>
                    <button>Despre noi</button>
                </div>
            </section>

            {/* Subsolul paginii */}
            <footer>
                <div className="footer-container">
                    <p>&copy; 2025 Numele Salonului. Toate drepturile rezervate.</p>
                </div>
            </footer>
        </div>
    );
}

// Aceasta linie va randa aplicatia in elementul cu id="root"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);