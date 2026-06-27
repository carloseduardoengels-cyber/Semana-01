 function mudarCor() {
            const header = document.querySelector('.header');
            if (header && header.style.backgroundColor === 'rgb(231, 76, 60)') {
                header.style.backgroundColor = '#2c3e50';
            } else {
                header.style.backgroundColor = '#e74c3c';
            }
        }
        const visitas = Math.floor(Math.random() * 900) + 100;
        const el = document.getElementById('visitas');
        if (el) el.textContent = '👁️' + visitas + ' visualizações';
        function alternarTema() {
            document.body.classList.toggle('dark-mode');
            const botao = document.getElementById('botaoTema');
            if (document.body.classList.contains('dark-mode')) {
                botao.textContent = '☀️';
                localStorage.setItem('tema', 'dark');
            } else {
                botao.textContent = '🌙';
                localStorage.setItem('tema', 'light');
            }
        }
        const temaSalvo = localStorage.getItem('tema');
        if (temaSalvo === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('botaoTema').textContent = '☀️';
        }