let restaurant; // eslint-disable-line no-unused-vars
let map; // eslint-disable-line no-unused-vars

const installOfflineWatcher = (offlineUpdatedCallback) => {
    window.addEventListener('online', () => offlineUpdatedCallback(false));
    window.addEventListener('offline', () => offlineUpdatedCallback(true));

    offlineUpdatedCallback(navigator.onLine === false);
};

self.installOfflineWatcher = installOfflineWatcher;
self.installOfflineWatcher((offline) => {
    isAppOffline(offline);
});

function isAppOffline(offline) {
    const els = document.querySelectorAll('.offline');
    if (offline) {
        els.forEach(el => el.classList.remove('hidden'));
    } else {
        els.forEach(el => {
            if (!el.classList.contains('hidden')) {
                el.classList.add('hidden');
            }
        });
    }
}

const reviewForm = document.getElementById('review-form');
reviewForm.addEventListener('submit', hanldePostReview);

document.addEventListener('DOMContentLoaded', () => {
    fetchReviewFromURL();
    fetchRestaurantFromURL(handleFetchRestaurantFromURL);
});


/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {

    self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
    });

    DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
};

const handleFetchReview = (error, reviews) => {
    if (error) {
        console.error(error);
        return;
    }
    fillReviewsHTML(reviews);
};


function hanldePostReview(event) {
    event.preventDefault();
    const id = getParameterByName('id');

    if (id) {
        const name =
            document.getElementById('review-input-name').value || 'Anonymous';
        const rating = document.getElementById('review-select-rating').value || '';
        const comments =
            document.getElementById('review-textarea-comments').value || '';
        const time = +new Date();


        DBHelper.postNewReview({
            restaurant_id: id,
            name,
            rating,
            comments,
            createdAt: time,
            updatedAt: time
        })
            .then((review) => {
                addToReviewList(review);
            })
            .catch((err) => {
                if (err.data) {
                    addToReviewList(err.data);
                }
            })
            .finally(() => {
                if (reviewForm) {
                    reviewForm.reset();
                }
            });
    } else {
        console.error('hanldePostReview: No resutaurant id present');
    }
}

function fetchReviewFromURL(callback) {
    const id = getParameterByName('id');
    if (!id) {
        // no id found in URL
        const error = 'No restaurant id in URL';
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantReviewById(id, handleFetchReview);
    }
}

const handleFetchRestaurant = callback => (error, restaurant) => {
    self.restaurant = restaurant;
    if (!restaurant) {
        console.error(error);
        return;
    }
    fillRestaurantHTML();
    callback(null, restaurant);
};

function handleFetchRestaurantFromURL(error, restaurant) {
    if (error) {
        // Got an error!
        console.error(error);
    } else {
        self.restaurant = restaurant;
        fillBreadcrumb(restaurant);
    }
}

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = callback => {
    if (self.restaurant) {
        // restaurant already fetched!
        callback(null, self.restaurant);
        return;
    }
    const id = getParameterByName('id');
    if (!id) {
        // no id found in URL
        const error = 'No restaurant id in URL';
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(id, handleFetchRestaurant(callback));
    }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;
    name.setAttribute('tabindex', '0');
    name.setAttribute('aria-label', `restaurant ${restaurant.name}`);

    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.alt = `Restaurant ${restaurant.name}`;
    image.srcset = DBHelper.imageSrcset(restaurant);
    image.sizes = '(max-width: 640px) 100vw, 50vw';

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = self.restaurant.reviews) => {
    const container = document.getElementById('reviews-container');

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById('reviews-list');
    ul.innerHTML = '';
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
};


const addToReviewList = (review) => {
    const ul = document.getElementById('reviews-list');
    ul.appendChild(createReviewHTML(review));
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = review => {
    const li = document.createElement('li');

    const wrapper = document.createElement('article');
    wrapper.className = 'review-wrapper';

    const name = document.createElement('h4');
    name.className = 'review-name';
    name.innerHTML = review.name;
    wrapper.appendChild(name);

    const rating = document.createElement('p');
    rating.innerHTML = `${review.rating}`;
    rating.className = 'review-rating';
    wrapper.appendChild(rating);

    li.append(wrapper);

    const date = document.createElement('p');
    date.innerHTML = new Date(review.createdAt).toLocaleDateString();
    date.className = 'review-date';
    li.appendChild(date);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
    const breadcrumb = document.querySelector('#breadcrumb');
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = DBHelper.urlForRestaurant(restaurant);
    link.innerHTML = restaurant.name;
    link.setAttribute('aria-current', 'page');
    li.append(link);
    breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
