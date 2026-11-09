/*
    Transforma '/produtos/:id' em uma Regex que reconhece '/produtos/5'
    e captura o 5 como parâmetro "id" (route params).
*/
export function buildRoutePath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g;
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-zA-Z0-9\\-_]+)');

    return new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);
}
