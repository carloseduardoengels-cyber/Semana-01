 function mudarCor() {
            const header = document.querySelector('.header');
            if (header.style.backgroundColor === 'rgb(231, 76, 60)') {
                header.style.backgroundColor = '#2c3e50';
            } else {
                header.style.backgroundColor = '#e74c3c';
            }
        }
        const visitas = Math.floor(Math.random() * 900) + 100;
        document.getElementById('visitas').textContent = '👁️' + visitas + ' visualizações';