export function createElements(html: string): Array<Element> {
    const template = document.createElement('div');
    template.innerHTML = html.trim();
    return [...template.children];
}
