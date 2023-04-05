import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = 'Default Title|Default article'
const initialValue = browser ? window.localStorage.getItem('articles') ?? defaultValue : defaultValue

const articles = writable(initialValue);

articles.subscribe((value) => {
    if (browser) {
        // store articles in local storage
        window.localStorage.setItem('articles', value);
    }
});

export default articles;