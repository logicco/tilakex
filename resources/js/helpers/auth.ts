export function isAuth() {
    return localStorage.getItem('auth') === "true" || false;
}

export function setAuth() {
    return localStorage.setItem('auth', 'true');
}

export function resetAuth() {
    return localStorage.clear();
}

