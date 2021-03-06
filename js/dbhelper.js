/**
 * photograph no longer return 1.jpg
 in api returns 1, so format data here
 also the last one doesn't have, using id to replace
 * @param r
 * @returns {{} & any & {photograph: string}}
 */
function formatSingleRestaurantData(r) {
    return Object.assign({}, r, {
        photograph: r.photograph ? `${r.photograph}.jpg` : `${r.id}.jpg`
    });
}

/**
 * Format restaurants array data
 * @param restaurants
 */
function formatRestaurantsData(restaurants) {
    return restaurants.map(formatSingleRestaurantData);
}

/**
 * Common database helper functions.
 */
class DBHelper {
    // eslint-disable-line no-unused-vars

    constructor() {
        this.restaurants = [];
        this.neighborhoods = [];
        this.cuisines = [];
        this.details = {};
    }

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get DATABASE_URL() {
        const port = 1337; // Change this to your server port
        return `http://localhost:${port}/restaurants`;
    }

    static get REVIEW_URL() {
        const port = 1337;
        return `http://localhost:${port}/reviews`;
    }

    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants(callback) {
        fetch(DBHelper.DATABASE_URL)
            .then(res => res.json())
            .then(formatRestaurantsData)
            .then(restaurants => {
                if (callback) {
                    callback(null, restaurants)
                }
            })
            .catch(error => {
                if (callback) {
                    callback(error, null)
                }
            });
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
        fetch(`${DBHelper.DATABASE_URL}/${id}`)
            .then(res => res.json())
            .then(formatSingleRestaurantData)
            .then(restaurant => {
                if (restaurant) {
                    // Got the restaurant
                    callback(null, restaurant);
                } else {
                    // Restaurant does not exist in the database
                    callback('Restaurant does not exist', null);
                }
            })
            .catch(error => callback(error, null));
    }

    static fetchRestaurantReviewById(id, callback) {
        return fetch(`${DBHelper.REVIEW_URL}/?restaurant_id=${id}`)
            .then(res => res.json())
            .then((reviews = []) => {
                return callback(null, reviews);
            })
            .catch(err => callback(err, null));
    }

    static postNewReview(review) {
        return fetch(`${DBHelper.REVIEW_URL}/`, {
            method: 'POST',
            body: JSON.stringify(review)
        })
            .then((res) => {
                return res.json();
            })
            .catch(() => {
                return review;
            })
            .finally(() => {
                DBHelper.updateReviews(review);
            });
    }

    static updateRestaurants(isFavorite, id) {
        window.caches.open('my-restaurants-cache')
            .then(caches => {
                return caches.keys()
                    .then(requests => {
                        requests.forEach(r => {
                            caches.match(r)
                                .then(res => res.json())
                                .then(data => {
                                    if(!Array.isArray(data)) {
                                        return;
                                    }
                                    const newData = data.map(d => {
                                        if (Number(d.id) === Number(id)) {
                                            d['is_favorite'] = isFavorite;
                                        }
                                        return d;
                                    });
                                    return caches.put(r, new Response(`${JSON.stringify(newData)}`, {
                                        headers: {"Content-Type": "application/json"}
                                    }));
                                })
                        });
                    });
            })
    }

    static updateReviews(review) {
        const restaurant_id = review.restaurant_id;
        window.caches.open('my-reviews-cache')
            .then((caches) => {
                return caches.keys()
                    .then(requests => {
                        requests.forEach(r => {
                            if(r.url.indexOf(`restaurant_id=${restaurant_id}`) === -1) {
                                return;
                            }
                            caches.match(r)
                                .then(res => res.json())
                                .then(data => {
                                    const newData = [...data, review];
                                    return caches.put(r, new Response(`${JSON.stringify(newData)}`, {
                                        headers: {"Content-Type": "application/json"}
                                    }));
                                });
                        })
                    });
            });
    }


    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type == cuisine);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood == neighborhood);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine,
                                                   neighborhood,
                                                   callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants;
                if (cuisine != 'all') {
                    // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') {
                    // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map(
                    (v, i) => restaurants[i].neighborhood
                );
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter(
                    (v, i) => neighborhoods.indexOf(v) == i
                );

                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter(
                    (v, i) => cuisines.indexOf(v) == i
                );
                callback(null, uniqueCuisines);
            }
        });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return `./restaurant.html?id=${restaurant.id}`;
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(name, ext) {
        return `/img/${name}-320_small.${ext}`;
    }

    /**
     * Generate name of different size of images
     */
    static imageSrcset(restaurant) {
        const [name, ext] = restaurant.photograph.split('.');
        return `/img/${name}-320_small.${ext} 400w, /img/${name}-640_medium.${ext} 640w, /img/${name}-800_large.${ext} 800w `;
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        const marker = new google.maps.Marker({
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map: map,
            animation: google.maps.Animation.DROP
        });
        return marker;
    }

    static getSourcesForRestaurant(restaurant) {
        const [filename, ext] = restaurant.photograph.split('.');

        let jpeg = document.createElement('SOURCE');
        jpeg.setAttribute(
            'data-srcset',
            DBHelper.imageUrlForRestaurant(filename, ext)
        );

        let webp = document.createElement('SOURCE');
        webp.setAttribute(
            'data-srcset',
            DBHelper.imageUrlForRestaurant(filename, 'webp')
        );
        webp.setAttribute('type', 'image/webp');

        let fallback = document.createElement('img');
        fallback.setAttribute(
            'data-srcset',
            DBHelper.imageUrlForRestaurant(filename, ext)
        );

        return [webp, jpeg, fallback];
    }

    static markRestaurantAsFavorite(isFavorite, id) {
        return fetch(`${DBHelper.DATABASE_URL}/${id}/?is_favorite=${isFavorite}`, {
            method: 'PUT'
        }).finally(() => {
            DBHelper.updateRestaurants(isFavorite, id);
        });
    }
}
