let restaurants, // eslint-disable-line no-unused-vars
  neighborhoods, // eslint-disable-line no-unused-vars
  cuisines, // eslint-disable-line no-unused-vars
  observer; // eslint-disable-line no-unused-vars
let map; // eslint-disable-line no-unused-vars
let markers = []; // eslint-disable-line no-unused-vars
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  DBHelper.fetchNeighborhoods(handleNeighborhoods);
  DBHelper.fetchCuisines(handleCuisines);
  DBHelper.fetchRestaurants(handlerCuisineAndNeighborhod);
});

/**
 * Will hot-load images as soon as the element is within the current viewport
 *
 */
observer = new IntersectionObserver(changes => {
  for (const change of changes) {
      if (!change.isIntersecting) return;
      var targets = change.target.childNodes;
      for (const target of targets) {
          target.setAttribute('srcset', target.getAttribute('data-srcset'));
          if (target.tagName === 'IMG') {
              // src is not supported on SOURCE elements soon (deprecation warning)
              target.setAttribute('src', target.getAttribute('data-src'));
          }
      }
      observer.unobserve(change.target);
  }
});


const handleNeighborhoods = (error, neighborhoods) => {
  if (error) {
    // Got an error
    console.error(error);
  } else {
    self.neighborhoods = neighborhoods;
    fillNeighborhoodsHTML(neighborhoods);
  }
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    option.name = neighborhood;
    select.append(option);
  });
};


const handleCuisines = (error, cuisines) => {
  if (error) {
    // Got an error!
    console.error(error);
  } else {
    self.cuisines = cuisines;
    fillCuisinesHTML();
  }
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false,
    keyboardShortcuts: false
  });
};

window.showMap = () => {
  requestAnimationFrame(() => {
    const contianer = document.getElementById("map-container");
    contianer.classList.remove('hidden');
    contianer.classList.add('active');
    addMarkersToMap(restaurants);
  });
}

const handlerCuisineAndNeighborhod = (error, restaurants) => {
  if (error) {
    // Got an error!
    console.error(error);
  } else {
    resetRestaurants(restaurants);
    fillRestaurantsHTML();
  }
};

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    handlerCuisineAndNeighborhod
  );
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = restaurants => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';
  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
};

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = restaurant => {
  const li = document.createElement('li');

  const image = document.createElement('picture');

  DBHelper.getSourcesForRestaurant(restaurant).map(el => {
      el.setAttribute('alt', 'Picture of ' + restaurant.name + " restaurant");
      image.append(el);
  });
  image.className = 'restaurant-img';
  li.append(image);
  observer.observe(image);

  const info = document.createElement('div');
  info.className = 'restaurant-info';

  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  name.id = `restaurant-item-${restaurant.id}`;
  info.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  info.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  info.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute('aria-labelledby', `restaurant-detail-${restaurant.id}`);
  info.append(more);

  const detail = document.createElement('span');
  detail.hidden = true;
  detail.id = `restaurant-detail-${restaurant.id}`;
  detail.innerHTML = `Restaurant name: ${restaurant.name}, address:${
    restaurant.address
  }, click the link to view detail`;

  li.appendChild(detail);
  li.append(info);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};
