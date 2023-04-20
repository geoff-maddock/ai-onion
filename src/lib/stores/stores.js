import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const defaultValue = '["Loading Story Title#Loading Story Contents"]'
const initialValue = browser ? window.localStorage.getItem('articles') ?? defaultValue : defaultValue

const parsedInitialValue = JSON.parse(initialValue);

const articles = writable(parsedInitialValue);

articles.subscribe((value) => {
    if (browser) {

        // merge the parsed initial value with the new value
        const mergedValue = [...parsedInitialValue, ...value];

        // stringify the value so it can be stored
        // const stringifiedValue = JSON.stringify(mergedValue);

        const stringifiedValue = JSON.stringify(value);

        // store articles in local storage
        window.localStorage.setItem('articles', stringifiedValue);
    }
});

export default articles;