// --- 1. CARREGAMENTO DOS DADOS (O Coração do Site) ---
let dadosGlobais = {};

// Puxa os dados do arquivo data.json assim que o site carrega
fetch('./data.json')
  .then(response => response.json())
  .then(json => {
    dadosGlobais = json;
    console.log("Dados carregados com sucesso!", dadosGlobais);
  })
  .catch(err => console.error("Erro ao carregar data.json:", err));


// --- 2. CONTROLE DO MENU MOBILE ---
const navToggle = document.querySelector(".mobile-nav-toggle");
const primaryNav = document.querySelector(".primary-navigation");

if (navToggle) {
    navToggle.addEventListener("click", () => {
        const visibility = primaryNav.getAttribute("data-visible");

        if (visibility === "false" || !visibility) {
            // Se estiver fechado, ABRE
            primaryNav.setAttribute("data-visible", "true");
            navToggle.setAttribute("aria-expanded", "true");
        } else {
            // Se estiver aberto, FECHA
            primaryNav.setAttribute("data-visible", "false");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
}


// --- 3. FUNÇÃO: MUDAR O DESTINO (Planetas) ---
function changeDestination(index) {
  const destino = dadosGlobais.destinations[index];
  if (!destino) return;

  // Atualiza Imagem
  document.getElementById('planet-image').src = destino.images.png;
  document.getElementById('planet-image').alt = destino.name;

  // Atualiza Textos
  document.getElementById('planet-name').innerText = destino.name;
  document.getElementById('planet-desc').innerText = destino.description;
  document.getElementById('planet-distance').innerText = destino.distance;
  document.getElementById('planet-time').innerText = destino.travel;

  // Atualiza o menu (Abas)
  const botoes = document.querySelectorAll('.tab-list button');
  botoes.forEach(btn => btn.setAttribute('aria-selected', 'false'));
  botoes[index].setAttribute('aria-selected', 'true');
}


// 1. O "Banco de Dados" dos tripulantes
const crewData = [
    {
        name: "Douglas Hurley",
        role: "Commander",
        bio: "Douglas Gerald Hurley is an American engineer, former Marine Corps pilot and former NASA astronaut. He launched into space for the third time as commander of Crew Dragon Demo-2.",
        image: "./assets/crew/image-douglas-hurley.png",
        imageWebp: "./assets/crew/image-douglas-hurley.webp"
    },
    {
        name: "Mark Shuttleworth",
        role: "Mission Specialist",
        bio: "Mark Richard Shuttleworth is the founder and CEO of Canonical, the company behind the Linux-based Ubuntu operating system. Shuttleworth became the first South African to travel to space as a space tourist.",
        image: "./assets/crew/image-mark-shuttleworth.png",
        imageWebp: "./assets/crew/image-mark-shuttleworth.webp"
    },
    {
        name: "Victor Glover",
        role: "Pilot",
        bio: "Pilot on the first operational flight of the SpaceX Crew Dragon to the International Space Station. Glover is a commander in the U.S. Navy where he pilots an F/A-18.He was a crew member of Expedition 64, and served as a station systems flight engineer.",
        image: "./assets/crew/image-victor-glover.png",
        imageWebp: "./assets/crew/image-victor-glover.webp"
    },
    {
        name: "Anousheh Ansari",
        role: "Flight Engineer",
        bio: "Anousheh Ansari is an Iranian-American engineer and co-founder of Prodea Systems. Ansari was the fourth self-funded space tourist, the first self-funded woman to fly to the ISS, and the first Iranian in space.",
        image: "./assets/crew/image-anousheh-ansari.png",
        imageWebp: "./assets/crew/image-anousheh-ansari.webp"
    }
];

// 2. Selecionar os elementos do HTML que vamos atualizar
const dotIndicators = document.querySelectorAll('.dot-indicators button');
const roleElement = document.getElementById('role');
const nameElement = document.getElementById('name');
const bioElement = document.getElementById('bio');
const imageElement = document.getElementById('image');
const imageWebpElement = document.getElementById('image-webp');

// 3. Função para trocar o tripulante
function changeCrew(index) {
    const crew = crewData[index];

    // Atualiza os textos
    roleElement.innerText = crew.role;
    nameElement.innerText = crew.name;
    bioElement.innerText = crew.bio;

    // Atualiza as imagens (PNG e WebP)
    imageElement.src = crew.image;
    imageElement.alt = crew.name;
    imageWebpElement.srcset = crew.imageWebp;

    // Atualiza as bolinhas (Visual + Acessibilidade)
    dotIndicators.forEach(dot => dot.setAttribute('aria-selected', false));
    dotIndicators[index].setAttribute('aria-selected', true);
}

// 4. Adicionar o "ouvidor" de clique em cada bolinha
dotIndicators.forEach((dot) => {
    dot.addEventListener('click', (e) => {
        // Pega o número do index que guardamos no HTML (data-index)
        // O "currentTarget" garante que pegamos o botão, mesmo se clicar no span dentro dele
        const index = e.currentTarget.getAttribute('data-index');
        changeCrew(index);
    });
});

/* =========================================
   FUNCIONALIDADE DE SWIPE (DESLIZAR)
   ========================================= */

let touchStartX = 0;
let touchEndX = 0;

// Elemento que vai "sentir" o toque (pode ser o body ou o main)
const swipeArea = document.querySelector('body');

function handleGesture() {
    // Verifica se o deslize foi para a ESQUERDA ou DIREITA
    if (touchEndX < touchStartX - 50) {
        // Deslizou para ESQUERDA (Próximo)
        changeIndex(1); 
    }
    if (touchEndX > touchStartX + 50) {
        // Deslizou para DIREITA (Anterior)
        changeIndex(-1);
    }
}

// Função auxiliar para calcular o novo índice (com loop infinito)
function changeIndex(direction) {
    // 1. Descobre qual bolinha está ativa agora
    let currentIndex = 0;
    dotIndicators.forEach((dot, index) => {
        if (dot.getAttribute('aria-selected') === 'true') {
            currentIndex = index;
        }
    });

    // 2. Calcula o próximo número
    let newIndex = currentIndex + direction;

    // 3. Lógica de Loop (Se passar do último, volta pro zero e vice-versa)
    if (newIndex >= crewData.length) {
        newIndex = 0; // Volta pro começo
    } else if (newIndex < 0) {
        newIndex = crewData.length - 1; // Vai pro final
    }

    // 4. Chama a função que já criamos para trocar tudo
    changeCrew(newIndex);
}

// EVENT LISTENERS (Ouvidores de Toque)
swipeArea.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

swipeArea.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});
// --- 5. FUNÇÃO: MUDAR A TECNOLOGIA (Foguetes) ---
function changeTechnology(index) {
  const tecnologia = dadosGlobais.technology[index];
  if (!tecnologia) return;

  // Atualiza Textos
  document.getElementById('tech-name').innerText = tecnologia.name;
  document.getElementById('tech-desc').innerText = tecnologia.description;
  
  // Atualiza as Imagens (Mobile e Desktop)
  const imgLandscape = document.getElementById('tech-img-landscape');
  const imgPortraitSource = document.getElementById('tech-img-portrait');

  // Atualiza a imagem padrão (Landscape/Mobile)
  // Verificamos se o elemento existe para evitar erros
  if (imgLandscape) {
      imgLandscape.src = tecnologia.images.landscape;
      imgLandscape.alt = tecnologia.name;
  }
  
  // Atualiza a imagem Desktop (Portrait) dentro do <source>
  if (imgPortraitSource) {
      imgPortraitSource.srcset = tecnologia.images.portrait;
  }

  // Atualiza os Botões Numerados (1, 2, 3)
  const botoes = document.querySelectorAll('.number-indicators button');
  botoes.forEach(btn => btn.setAttribute('aria-selected', 'false'));
  botoes[index].setAttribute('aria-selected', 'true');
}
/* =========================================
   LÓGICA DA PÁGINA DESTINATION
   ========================================= */

// 1. Banco de Dados dos Planetas
const destinations = {
    "moon": {
        name: "Moon",
        image: "./assets/destination/image-moon.png",
        source: "./assets/destination/image-moon.webp",
        description: "See our planet as you’ve never seen it before. A perfect relaxing trip away to help regain perspective and come back refreshed. While you’re there, take in some history by visiting the Luna 2 and Apollo 11 landing sites.",
        distance: "384,400 km",
        travel: "3 days"
    },
    "mars": {
        name: "Mars",
        image: "./assets/destination/image-mars.png",
        source: "./assets/destination/image-mars.webp",
        description: "Don’t forget to pack your hiking boots. You’ll need them to tackle Olympus Mons, the tallest planetary mountain in our solar system. It’s two and a half times the size of Everest!",
        distance: "225 mil. km",
        travel: "9 months"
    },
    "europa": {
        name: "Europa",
        image: "./assets/destination/image-europa.png",
        source: "./assets/destination/image-europa.webp",
        description: "The smallest of the four Galilean moons orbiting Jupiter, Europa is a winter lover’s dream. With an icy surface, it’s perfect for a bit of ice skating, curling, hockey, or simple relaxation in your snug wintery cabin.",
        distance: "628 mil. km",
        travel: "3 years"
    },
    "titan": {
        name: "Titan",
        image: "./assets/destination/image-titan.png",
        source: "./assets/destination/image-titan.webp",
        description: "The only moon known to have a dense atmosphere other than Earth, Titan is a home away from home (just a few hundred degrees colder!). As a bonus, you get striking views of the Rings of Saturn.",
        distance: "1.6 bil. km",
        travel: "7 years"
    }
};

// 2. Selecionar os elementos
const destinationTabs = document.querySelectorAll('.tab-list button');
const planetName = document.getElementById('planet-name');
const planetDesc = document.getElementById('planet-desc');
const planetDistance = document.getElementById('planet-distance');
const planetTime = document.getElementById('planet-time');
const planetImage = document.getElementById('planet-image');
const planetSource = document.getElementById('planet-source'); // Para suporte a webp

// 3. Adicionar evento de clique (se existirem botões na página)
// 3. Adicionar evento de clique (VERSÃO CORRIGIDA)
if (destinationTabs.length > 0) {
    destinationTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const targetPlanet = e.currentTarget.getAttribute('data-name'); // Usar currentTarget é mais seguro
            const data = destinations[targetPlanet];

            if (data) {
                // Atualiza o HTML
                if(planetName) planetName.innerText = data.name;
                if(planetDesc) planetDesc.innerText = data.description;
                if(planetDistance) planetDistance.innerText = data.distance;
                
                // FORÇA A ATUALIZAÇÃO DO TEMPO (O que estava sumindo)
                if(planetTime) {
                    planetTime.style.display = "block"; // Garante visibilidade
                    planetTime.innerText = data.travel;
                }
                
                // Troca a imagem
                if(planetImage) {
                    planetImage.src = data.image;
                    planetImage.alt = data.name;
                }
                if(planetSource) planetSource.srcset = data.source;

                // Atualiza a linha embaixo do botão
                destinationTabs.forEach(t => t.setAttribute('aria-selected', false));
                e.currentTarget.setAttribute('aria-selected', true);
            }
        });
    });
}
/* =========================================
   LÓGICA DA PÁGINA TECHNOLOGY
   ========================================= */

// 1. Dados das Tecnologias (Launch Vehicle, Spaceport, Capsule)
const techData = [
    {
        name: "Launch vehicle",
        description: "A launch vehicle or carrier rocket is a rocket-propelled vehicle used to carry a payload from Earth's surface to space, usually to Earth orbit or beyond. Our WEB-X carrier rocket is the most powerful in operation. Standing 150 metres tall, it's quite an awe-inspiring sight on the launch pad!",
        imagePortrait: "./assets/technology/image-launch-vehicle-portrait.jpg",
        imageLandscape: "./assets/technology/image-launch-vehicle-landscape.jpg"
    },
    {
        name: "Spaceport",
        description: "A spaceport or cosmodrome is a site for launching (or receiving) spacecraft, by analogy to the seaport for ships or airport for aircraft. Based in the famous Cape Canaveral, our spaceport is ideally situated to take advantage of the Earth’s rotation for launch.",
        imagePortrait: "./assets/technology/image-spaceport-portrait.jpg",
        imageLandscape: "./assets/technology/image-spaceport-landscape.jpg"
    },
    {
        name: "Space capsule",
        description: "A space capsule is an often-crewed spacecraft that uses a blunt-body reentry capsule to reenter the Earth's atmosphere without wings. Our capsule is where you'll spend your time during the flight. It includes a space gym, cinema, and plenty of other activities to keep you entertained.",
        imagePortrait: "./assets/technology/image-space-capsule-portrait.jpg",
        imageLandscape: "./assets/technology/image-space-capsule-landscape.jpg"
    }
];

// 2. Selecionar os elementos do HTML
const techButtons = document.querySelectorAll('.number-indicators button');
const techName = document.getElementById('tech-name');
const techDesc = document.getElementById('tech-desc');
const techImgPortrait = document.getElementById('tech-image-portrait');
const techImgLandscape = document.getElementById('tech-image-landscape');
const techImgDefault = document.getElementById('tech-image-default');

// 3. Adicionar evento de clique
if (techButtons.length > 0) {
    techButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            const tech = techData[index];
            
            // Atualiza Texto
            techName.innerText = tech.name;
            techDesc.innerText = tech.description;
            
            // Atualiza Imagens (Troca tanto a versão Mobile quanto a Desktop)
            techImgPortrait.srcset = tech.imagePortrait;
            techImgLandscape.srcset = tech.imageLandscape;
            techImgDefault.src = tech.imagePortrait;

            // Atualiza Botão Ativo (Cor branca)
            techButtons.forEach(b => b.setAttribute('aria-selected', false));
            btn.setAttribute('aria-selected', true);
        });
    });
}