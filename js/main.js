mapboxgl.accessToken = 'pk.eyJ1IjoiY3lvbzM3IiwiYSI6ImNta3oxcTRodzBlYm4zY3BzcW12b2k1MTAifQ.rJIiNrA1UOOb-qolJvwlAg';

const scenes = [
  {
    id: 'tokyo',
    label: '01',
    center: [139.6917, 35.6895],
    zoom: 11,
    pitch: 45,
    bearing: -15,
    style: 'mapbox://styles/mapbox/dark-v11',
    markerLabel: 'Tokyo, Japan',
  },
  {
    id: 'cairo',
    label: '02',
    center: [31.2357, 30.0444],
    zoom: 11,
    pitch: 30,
    bearing: 20,
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    markerLabel: 'Cairo, Egypt',
  },
  {
    id: 'rio',
    label: '03',
    center: [-43.1729, -22.9068],
    zoom: 11,
    pitch: 50,
    bearing: -30,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    markerLabel: 'Rio de Janeiro, Brazil',
  },
  {
    id: 'oslo',
    label: '04',
    center: [10.7522, 59.9139],
    zoom: 11,
    pitch: 20,
    bearing: 10,
    style: 'mapbox://styles/mapbox/light-v11',
    markerLabel: 'Oslo, Norway',
  },
  {
    id: 'sydney',
    label: '05',
    center: [151.2093, -33.8688],
    zoom: 12,
    pitch: 55,
    bearing: -20,
    style: 'mapbox://styles/mapbox/dark-v11',
    markerLabel: 'Sydney, Australia',
  },
];


let map;
let scriptPanel = scrollama();
let activeMarker = null;   

function initMap() {
  map = new mapboxgl.Map({
    container: 'map',
    style: scenes[0].style,
    center: scenes[0].center,
    zoom: scenes[0].zoom,
    pitch: scenes[0].pitch,
    bearing: scenes[0].bearing,
    projection: 'globe',         
    antialias: true,
  });


  map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-left');

  map.on('style.load', () => {
    try {
      map.setFog({
        color: 'rgb(10, 8, 6)',
        'high-color': 'rgb(30, 25, 20)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(5, 4, 3)',
        'star-intensity': 0.6,
      });
    } catch (e) {
     
    }
  });

  map.on('load', () => {
    
    activateScene(0);
    
    initScrollama();
  });
}


function activateScene(index) {
  const scene = scenes[index];
  if (!scene) return;


  map.flyTo({
    center: scene.center,
    zoom: scene.zoom,
    pitch: scene.pitch,
    bearing: scene.bearing,
    speed: 0.9,
    curve: 1.4,
    essential: true,
  });

  
  const currentStyle = map.getStyle().sprite;
  if (currentStyle && !currentStyle.includes(scene.style.split('/').pop())) {
    map.setStyle(scene.style);
  }


  if (activeMarker) {
    activeMarker.remove();
    activeMarker = null;
  }


  const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: false,
    closeOnClick: false,
  }).setHTML(`<strong>${scene.markerLabel}</strong>`);

  activeMarker = new mapboxgl.Marker({ color: '#c9892a' })
    .setLngLat(scene.center)
    .setPopup(popup)
    .addTo(map);

  activeMarker.togglePopup();


  document.getElementById('scene-num').textContent = scene.label;

 
  document.querySelectorAll('.scene').forEach((el, i) => {
    if (i === index) {
      el.classList.add('is-active');
    } else {
      el.classList.remove('is-active');
    }
  });
}


function initScrollama() {
  scriptPanel
    .setup({
      step: '.scene',
      offset: 0.4,
      debug: false,
    })
    .onStepEnter(handleSceneEnter)
    .onStepExit(handleSceneExit);

 
  window.addEventListener('resize', scriptPanel.resize);
}


function handleSceneEnter(response) {
  const index = response.index;

 
  if (index === 0) {
    document.getElementById('cover').style.opacity = '0';
    document.getElementById('cover').style.pointerEvents = 'none';
  }

  activateScene(index);


function handleSceneExit(response) {
  const index = response.index;
  const direction = response.direction;

  
  if (index === 0 && direction === 'up') {
    document.getElementById('cover').style.opacity = '1';
    document.getElementById('cover').style.pointerEvents = 'auto';
  }

 
  const el = document.querySelector(`[data-scene="${index}"]`);
  if (el) el.classList.remove('is-active');
}


function adjustStoryboardSize() {
  const storyboard = document.getElementById('storyboard');
  storyboard.style.height = window.innerHeight + 'px';
  if (map) map.resize();
}

window.addEventListener('resize', adjustStoryboardSize);


adjustStoryboardSize();
initMap();
