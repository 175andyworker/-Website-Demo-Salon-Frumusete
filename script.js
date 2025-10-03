// ----------------------------------------------------
// 2. Logica Preloader (Noua Logică cu 2 Pași)
// ----------------------------------------------------
const preloader = document.querySelector('.preloader');
const LOGO_SHRINK_DURATION = 1000; // 1 secundă pentru micșorare
const TOTAL_DURATION = LOGO_SHRINK_DURATION + 500; // 1.5 secunde total (1s shrink + 0.5s fade-out)

function hidePreloader() {
    if (preloader) {
        // Pasul 2: Adaugă clasa pentru a face logo-ul să se micșoreze
        preloader.classList.add('shrink-logo');
        
        // Pasul 3: După ce logo-ul s-a micșorat, ascunde întregul preloader
        setTimeout(() => {
            preloader.classList.add('hide-preloader');
        }, LOGO_SHRINK_DURATION);
    }
}

if (preloader) {
    // Pasul 1: Pornirea animației la încărcarea paginii
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 100); // Pornim animația la scurt timp după încărcare
    });
    
    // Asigură-te că dispare forțat (dacă durează mult peste 3 secunde)
    setTimeout(() => {
        if (!preloader.classList.contains('hide-preloader')) {
            preloader.classList.add('hide-preloader');
        }
    }, 3500); 
}
// =======================================================
// CONSTANTE ȘI FUNCȚII GLOBALE (Disponibile peste tot)
// =======================================================

/**
 * Formatează un șir de dată (e.g., '2025-09-30') într-un format lung (e.g., "luni, 30 septembrie 2025").
 * @param {string} dateString - Data în format ISO (YYYY-MM-DD).
 * @returns {string} Data formatată.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data selectată';
    
    // Adaugă 1 zi pentru a compensa potentialele probleme de fus orar la input[type="date"]
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000 + 24 * 60 * 60 * 1000); 
    
    return localDate.toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// SIMULARE ORE DISPONIBILE (Se poate schimba aici intervalul de lucru)
const availableHours = [
    "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"
];

// ORE OCUPATE (TU VEI MODIFICA ACEST OBIECT DUPĂ FIECARE PROGRAMARE PRIMITĂ)
const bookedSlots = {
    // FORMAT: 'AAAA-LL-ZZ': ["Ora1", "Ora2"],
    '2025-09-30': ["11:30", "16:00"], 
    '2025-10-02': ["10:00", "19:00"], 
    '2025-10-05': ["13:00"],          
};


// =======================================================
// LOGICA APLICATĂ DUPĂ ÎNCĂRCAREA COMPLETĂ A PAGINII
// =======================================================
document.addEventListener("DOMContentLoaded", function() {
    
    // Corecția universală pentru a preveni reîncărcarea la butoanele simple
    document.querySelectorAll('button:not([type="submit"])').forEach(button => {
        if (!button.closest('form')) {
            button.type = 'button';
        }
    });
    
    // --- Variabile pentru formularul de programare ---
    const serviceSelect = document.getElementById('service-select');
    const dateSelect = document.getElementById('date-select');
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    const calendarDayLabel = document.getElementById('calendar-day-label');
    const finalBookingForm = document.getElementById('final-booking-form');
    const summaryText = document.getElementById('summary-text');
    const initialMessageCol2 = document.getElementById('initial-message-col2');
    const whatsappModal = document.getElementById('whatsapp-modal');
    const bookingForm = document.getElementById('booking-details-form');
    let selectedSlot = null;
    
    // ----------------------------------------------------
    // 1. Logica Formularului de Programare (contact.html)
    // ----------------------------------------------------

    if (serviceSelect && dateSelect && timeSlotsGrid) {
        
        /**
         * Verifică orele disponibile și le afișează în grid.
         */
        function updateTimeSlots() {
            const selectedDate = dateSelect.value;
            const selectedService = serviceSelect.value;
            
            // Dacă nu e selectată o dată sau un serviciu, nu afișăm nimic
            if (!selectedDate || !selectedService) {
                timeSlotsGrid.innerHTML = '<p class="initial-message">Selectează un serviciu și o dată.</p>';
                calendarDayLabel.textContent = 'Disponibilitate:';
                finalBookingForm.style.display = 'none';
                initialMessageCol2.style.display = 'block';
                return;
            }

            const formattedDate = formatDate(selectedDate);
            calendarDayLabel.textContent = `Disponibilitate: ${formattedDate}`;
            timeSlotsGrid.innerHTML = '';
            selectedSlot = null; // Resetăm slotul selectat

            const bookedForThisDay = bookedSlots[selectedDate] || [];

            availableHours.forEach(hour => {
                const isBooked = bookedForThisDay.includes(hour);
                const slotDiv = document.createElement('div');
                slotDiv.className = `time-slot ${isBooked ? 'booked' : 'available'}`;
                slotDiv.textContent = hour;
                slotDiv.dataset.time = hour;

                if (!isBooked) {
                    slotDiv.addEventListener('click', () => {
                        // Deselectează toate celelalte sloturi
                        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                        // Selectează slotul curent
                        slotDiv.classList.add('selected');
                        selectedSlot = { date: selectedDate, time: hour, service: selectedService };
                        
                        // Actualizează sumarul și afișează formularul final
                        updateSummary();
                        finalBookingForm.style.display = 'block';
                        initialMessageCol2.style.display = 'none';
                    });
                }
                
                timeSlotsGrid.appendChild(slotDiv);
            });
        }
        
        /**
         * Actualizează textul sumarului de programare.
         */
        function updateSummary() {
            if (selectedSlot) {
                const date = formatDate(selectedSlot.date);
                summaryText.innerHTML = `**Programare selectată:**<br>
                                         **Serviciu:** ${selectedSlot.service.toUpperCase()}<br>
                                         **Data:** ${date}<br>
                                         **Ora:** ${selectedSlot.time}`;
            }
        }

        // Atașează listenere la schimbarea Serviciului sau a Datei
        serviceSelect.addEventListener('change', updateTimeSlots);
        dateSelect.addEventListener('change', updateTimeSlots);
        
        // Setează data minimă pe ziua curentă (nu se poate programa în trecut)
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateSelect.min = `${yyyy}-${mm}-${dd}`;
        
        // ----------------------------------------------------
        // 1b. Logica de Trimitere a Formularului (FĂRĂ WhatsApp)
        // ----------------------------------------------------
        if (bookingForm) {
            bookingForm.addEventListener('submit', function(event) {
                event.preventDefault(); // CRITIC: Blochează reîncărcarea paginii

                if (!selectedSlot) {
                    alert("Te rugăm să selectezi un slot orar disponibil.");
                    return;
                }
                
                const clientName = document.getElementById('client-name').value;
                const clientPhone = document.getElementById('client-phone').value;

                if (!clientName || !clientPhone) {
                    alert("Numele și telefonul sunt obligatorii.");
                    return;
                }
                
                // SIMULARE LOGICĂ DE TRIMITERE EMAIL/SERVER (Aici se trimit datele real)
                console.log("Programare trimisă (simulare):", {
                    nume: clientName,
                    telefon: clientPhone,
                    serviciu: selectedSlot.service,
                    data: selectedSlot.date,
                    ora: selectedSlot.time
                });

                // Afișează un mesaj de succes
                alert(`Mulțumim, ${clientName}! Cererea ta pentru ${selectedSlot.service.toUpperCase()} în data de ${formatDate(selectedSlot.date)} la ora ${selectedSlot.time} a fost trimisă. Te vom contacta în curând pentru confirmare.`);

                // Resetează UI și formularul
                bookingForm.reset();
                selectedSlot = null;
                updateTimeSlots(); // Reîmprospătează gridul
            });
        }
    }
    
    // --- Curățare: Logica veche de formular (pentru simplitate) ---
    // (Lăsată goală, presupunând că ai eliminat formularul simplu din HTML)
    
    // ----------------------------------------------------
    // 2. Logica Preloader
    // ----------------------------------------------------
    const preloader = document.querySelector('.preloader');
    
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hide-preloader');
        }
    }

    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(hidePreloader, 500); 
        });
        setTimeout(hidePreloader, 3000); 
    }

    // ----------------------------------------------------
    // 3. Logica pentru Tab-urile de Servicii (servicii.html)
    // ----------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(targetTab)?.classList.add('active');
            });
        });
        document.querySelector('.tab-button')?.click(); 
    }
    
    // ----------------------------------------------------
    // 4. Logica pentru Carousel-ul de Recenzii (index.html)
    // ----------------------------------------------------
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            const newIndex = index % slides.length;
            slides[newIndex].classList.add('active');
            dots[newIndex].classList.add('active');
            currentSlide = newIndex;
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                showSlide(parseInt(e.target.dataset.slide));
                resetInterval();
            });
        });

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 7000); 
        }

        resetInterval(); 
        showSlide(currentSlide);
    }
    
    // ----------------------------------------------------
    // 5. Logica de Filtrare Portofoliu (portofoliu.html)
    // ----------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                filterBtns.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                portfolioItems.forEach(item => {
                    item.style.display = 'none'; 

                    if (filter === 'all' || item.classList.contains(filter)) {
                        // Folosim setTimeout pentru a re-declanșa layout-ul gridului/masonry
                        setTimeout(() => {
                            item.style.display = 'block'; 
                        }, 50); 
                    }
                });
            });
        });
        document.querySelector('.filter-btn[data-filter="all"]')?.click();
    }
});