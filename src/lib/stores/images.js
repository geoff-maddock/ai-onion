import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = 'images/spinner2.gif'
const initialValue = browser ? window.localStorage.getItem('articleImage') ?? defaultValue : defaultValue

const articleImage = writable(initialValue);

articleImage.subscribe((value) => {
    if (browser) {
        // store articles in local storage
        window.localStorage.setItem('articleImage', value);
    }
});

export default articleImage;