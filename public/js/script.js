document.addEventListener('DOMContentLoaded', function() {
  // Actualizar los valores en el DOM
  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');

  function updateCountdown() {
    // Obtener la fecha actual utilizando Moment.js
    const now = moment();

    // Definir la fecha objetivo como el 1 de septiembre de 2023
    const targetDate = moment('2023-09-01');

    // Calcular la diferencia de tiempo entre la fecha actual y la fecha objetivo utilizando Moment.js
    const diff = moment.duration(targetDate.diff(now));

    // Obtener la duración en días, horas, minutos y segundos
    const days = Math.floor(diff.asDays());
    const hours = diff.hours();
    const minutes = diff.minutes();
    const seconds = diff.seconds();

    // Actualizar el contenido en el DOM
    daysElement.textContent = days;
    hoursElement.textContent = addLeadingZero(hours);
    minutesElement.textContent = addLeadingZero(minutes);
    secondsElement.textContent = addLeadingZero(seconds);
  }

  function addLeadingZero(value) {
    // Agregar un cero delante si el valor es menor que 10
    return value < 10 ? `0${value}` : value;
  }

  setInterval(updateCountdown, 1000); // Actualizar cada segundo

  // Obtener la barra de navegación
  const headerNav = document.getElementById('headerNav');

  let prevScrollPos = window.pageYOffset;

  // Función para controlar la visibilidad de la barra de navegación
  function handleNavVisibility() {
    const currentScrollPos = window.pageYOffset;

    if (prevScrollPos > currentScrollPos || currentScrollPos === 0) {
      // El usuario está haciendo scroll hacia arriba o se encuentra en la parte superior de la página
      headerNav.style.transform = 'translateY(0)';
    } else {
      // El usuario está haciendo scroll hacia abajo
      headerNav.style.transform = 'translateY(-100%)';
    }

    prevScrollPos = currentScrollPos;
  }

  // Mostrar la barra de navegación al cargar la página
  handleNavVisibility();

  // Evento de desplazamiento
  window.addEventListener('scroll', handleNavVisibility);

  // Agrega la funcionalidad de desplazamiento al contenedor de las tarjetas
  const cardContainer = document.querySelector('.card-container');

  let isCardScrolling = false; // Variable para rastrear si se está desplazando verticalmente dentro de las tarjetas

  cardContainer.addEventListener('wheel', (event) => {
    if (!isCardScrolling) {
      event.preventDefault();
      cardContainer.scrollLeft += event.deltaY;
    }
  });

  cardContainer.addEventListener('mouseenter', () => {
    isCardScrolling = true;
  });

  cardContainer.addEventListener('mouseleave', () => {
    isCardScrolling = false;
  });

  // Verificar si es un dispositivo móvil o tableta
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobileDevice) {
    // Deshabilitar los indicadores en dispositivos móviles
    const scrollIndicatorsContainer = document.querySelector('.scroll-indicators');
    scrollIndicatorsContainer.style.display = 'none';
  } else {
    let activeIndex = 0; // Índice activo del indicador seleccionado
    const indicators = []; // Array para almacenar los indicadores

    // Función para generar los indicadores de desplazamiento
    function generateIndicators() {
      const scrollIndicatorsContainer = document.querySelector('.scroll-indicators');
      const totalCards = cardContainer.children.length;
      const cardWidth = cardContainer.offsetWidth;
      const containerWidth = cardContainer.scrollWidth;
      const middleScrollPosition = (containerWidth - cardWidth) / 2;

      scrollIndicatorsContainer.innerHTML = ''; // Limpiar los indicadores existentes

      // Generar los indicadores (3 en total)
      for (let i = 0; i < 3; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('scroll-indicator');
        scrollIndicatorsContainer.appendChild(indicator);
        indicators.push(indicator);
      }

      updateActiveIndicator(); // Actualizar el estado activo del indicador seleccionado

      // Función para manejar el clic en los indicadores
      function handleIndicatorClick(index) {
        let scrollPosition;

        if (index === 0) {
          scrollPosition = 0; // Desplazar al principio
        } else if (index === 1) {
          scrollPosition = middleScrollPosition; // Desplazar a la mitad
        } else {
          scrollPosition = containerWidth - cardWidth; // Desplazar al final
        }

        cardContainer.scroll({
          left: scrollPosition,
          behavior: 'smooth'
        });

        activeIndex = index; // Actualizar el índice activo del indicador seleccionado
        updateActiveIndicator(); // Actualizar el estado activo del indicador seleccionado
      }

      // Agregar el evento de clic a los indicadores
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          handleIndicatorClick(index);
        });
      });
    }

    generateIndicators(); // Generar los indicadores iniciales

    // Actualizar los indicadores cuando se agregan o eliminan tarjetas
    new MutationObserver(generateIndicators).observe(cardContainer, {
      childList: true
    });

    // Realizar el desplazamiento al principio al cargar la página
    cardContainer.scroll({
      left: 0,
      behavior: 'smooth'
    });

    // Actualizar el estado activo del indicador cuando se desplaza el contenedor
    function handleCardScroll() {
      const scrollPosition = cardContainer.scrollLeft;
      const cardWidth = cardContainer.offsetWidth;
      const containerWidth = cardContainer.scrollWidth;
      const middleScrollPosition = (containerWidth - cardWidth) / 2;

      if (scrollPosition === 0) {
        activeIndex = 0; // Desplazamiento al principio
      } else if (scrollPosition === middleScrollPosition) {
        activeIndex = 1; // Desplazamiento en la mitad
      } else if (scrollPosition === containerWidth - cardWidth) {
        activeIndex = 2; // Desplazamiento al final
      }

      updateActiveIndicator(); // Actualizar el estado activo del indicador seleccionado
    }

    // Función para actualizar el estado activo del indicador seleccionado
    function updateActiveIndicator() {
      indicators.forEach((indicator, index) => {
        if (index === activeIndex) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }

    cardContainer.addEventListener('scroll', handleCardScroll);
  }

  // Crear el mapa Leaflet
  const mapContainer = document.getElementById('map');
  const map = L.map(mapContainer).setView([36.7047342, -4.4615338], 16);

  // Crear el marcador
  const marker = L.marker([36.7047342, -4.4615338]).addTo(map);

  // Añadir una etiqueta al marcador (opcional)
  marker.bindPopup("ActionGroup 2023, Málaga").openPopup();

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);
});

document.querySelector('#contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.elements.name.value = '';
  e.target.elements.email.value = '';
  e.target.elements.message.value = '';
});